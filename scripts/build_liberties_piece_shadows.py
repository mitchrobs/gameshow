from __future__ import annotations

import json
import shutil
import subprocess
import textwrap
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
BLENDER = Path("/Applications/Blender.app/Contents/MacOS/Blender")
TMP_DIR = ROOT / "tmp" / "liberties-piece-shadows"
RENDER_DIR = TMP_DIR / "renders"
SHADOW_DIR = ROOT / "assets" / "liberties" / "shadows"
THEME_DIR = ROOT / "assets" / "liberties" / "themes"
CONTACT_SHEET = TMP_DIR / "contact-sheet.png"

SHADOW_CONFIGS = {
    "pebble": {
        "black": {"shape": "sphere", "scale": [0.68, 0.62, 0.18], "z": 0.26, "max_alpha": 68},
        "white": {"shape": "sphere", "scale": [0.66, 0.60, 0.16], "z": 0.24, "max_alpha": 52},
        "blocker": {"shape": "sphere", "scale": [0.68, 0.62, 0.18], "z": 0.26, "max_alpha": 60},
    },
    "knob": {
        "black": {"shape": "sphere", "scale": [0.55, 0.47, 0.33], "z": 0.40, "max_alpha": 72},
        "white": {"shape": "sphere", "scale": [0.53, 0.45, 0.32], "z": 0.39, "max_alpha": 55},
        "blocker": {"shape": "box", "scale": [0.68, 0.46, 0.17], "z": 0.22, "max_alpha": 62},
    },
    "neo-city": {
        "black": {"shape": "tower", "scale": [0.48, 0.40, 0.44], "z": 0.50, "max_alpha": 76},
        "white": {"shape": "tower", "scale": [0.47, 0.39, 0.43], "z": 0.49, "max_alpha": 58},
        "blocker": {"shape": "box", "scale": [0.66, 0.40, 0.18], "z": 0.23, "max_alpha": 62},
    },
    "soft-ceramic": {
        "black": {"shape": "sphere", "scale": [0.62, 0.52, 0.18], "z": 0.26, "max_alpha": 50},
        "white": {"shape": "sphere", "scale": [0.60, 0.50, 0.17], "z": 0.25, "max_alpha": 42},
        "blocker": {"shape": "sphere", "scale": [0.62, 0.52, 0.18], "z": 0.26, "max_alpha": 48},
    },
}

PREVIEW_PLACEMENT = {
    "pebble": {
        "black": {"piece_anchor": 0, "piece_scale": 1, "shadow_opacity": 0.88, "shadow_scale": 1, "shadow_offset": [0, 0]},
        "white": {"piece_anchor": 0, "piece_scale": 1, "shadow_opacity": 0.76, "shadow_scale": 1, "shadow_offset": [0, 0]},
        "blocker": {"piece_anchor": 0, "piece_scale": 1, "shadow_opacity": 0.82, "shadow_scale": 1, "shadow_offset": [0, 0]},
    },
    "knob": {
        "black": {"piece_anchor": -0.16, "piece_scale": 0.98, "shadow_opacity": 0.88, "shadow_scale": 1, "shadow_offset": [0, 0]},
        "white": {"piece_anchor": -0.16, "piece_scale": 0.98, "shadow_opacity": 0.74, "shadow_scale": 1, "shadow_offset": [0, 0]},
        "blocker": {"piece_anchor": -0.04, "piece_scale": 0.98, "shadow_opacity": 0.30, "shadow_scale": 0.88, "shadow_offset": [0, 0.02]},
    },
    "neo-city": {
        "black": {"piece_anchor": -0.17, "piece_scale": 0.96, "shadow_opacity": 0.86, "shadow_scale": 0.94, "shadow_offset": [-0.01, 0.01]},
        "white": {"piece_anchor": -0.17, "piece_scale": 0.96, "shadow_opacity": 0.74, "shadow_scale": 0.94, "shadow_offset": [-0.01, 0.01]},
        "blocker": {"piece_anchor": -0.08, "piece_scale": 0.96, "shadow_opacity": 0.34, "shadow_scale": 0.86, "shadow_offset": [0, 0.02]},
    },
    "soft-ceramic": {
        "black": {"piece_anchor": -0.05, "piece_scale": 0.98, "shadow_opacity": 0.56, "shadow_scale": 0.92, "shadow_offset": [0, 0.01]},
        "white": {"piece_anchor": -0.05, "piece_scale": 0.98, "shadow_opacity": 0.48, "shadow_scale": 0.92, "shadow_offset": [0, 0.01]},
        "blocker": {"piece_anchor": -0.05, "piece_scale": 0.98, "shadow_opacity": 0.52, "shadow_scale": 0.92, "shadow_offset": [0, 0.01]},
    },
}


def write_blender_script(path: Path, configs: dict[str, dict[str, dict[str, object]]]) -> None:
    payload = json.dumps(configs)
    path.write_text(
        textwrap.dedent(
            f"""
            import json
            import math
            from pathlib import Path

            import bpy

            CONFIGS = json.loads({payload!r})
            RENDER_DIR = Path({str(RENDER_DIR)!r})

            def reset_scene():
                bpy.ops.object.select_all(action='SELECT')
                bpy.ops.object.delete()
                scene = bpy.context.scene
                scene.render.engine = 'CYCLES'
                scene.cycles.samples = 96
                scene.cycles.use_denoising = True
                scene.view_settings.view_transform = 'Standard'
                scene.view_settings.look = 'None'
                scene.view_settings.exposure = 0
                scene.view_settings.gamma = 1
                scene.render.film_transparent = False
                scene.render.resolution_x = 512
                scene.render.resolution_y = 512
                scene.world = scene.world or bpy.data.worlds.new('World')
                scene.world.color = (1, 1, 1)

                camera_data = bpy.data.cameras.new('Camera')
                camera = bpy.data.objects.new('Camera', camera_data)
                bpy.context.collection.objects.link(camera)
                camera.location = (0, 0, 6)
                camera.rotation_euler = (0, 0, 0)
                camera.data.type = 'ORTHO'
                camera.data.ortho_scale = 3.65
                scene.camera = camera

                bpy.ops.mesh.primitive_plane_add(size=8, location=(0, 0, 0))
                plane = bpy.context.object
                plane.name = 'matte-board'
                material = bpy.data.materials.new('matte-white')
                material.diffuse_color = (1, 1, 1, 1)
                plane.data.materials.append(material)

                bpy.ops.object.light_add(type='AREA', location=(-2.15, -2.7, 3.6))
                key = bpy.context.object
                key.name = 'wide-soft-key'
                key.data.energy = 440
                key.data.size = 3.65

                bpy.ops.object.light_add(type='AREA', location=(2.4, 2.5, 4.2))
                fill = bpy.context.object
                fill.name = 'lift-fill'
                fill.data.energy = 58
                fill.data.size = 6.25
                return scene

            def add_box(config):
                bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, config['z']))
                obj = bpy.context.object
                obj.scale = tuple(config['scale'])
                bevel = obj.modifiers.new('softened-footprint', 'BEVEL')
                bevel.width = 0.18
                bevel.segments = 12
                obj.modifiers.new('weighted-corner-normals', 'WEIGHTED_NORMAL')
                return obj

            def add_sphere(config):
                bpy.ops.mesh.primitive_uv_sphere_add(segments=72, ring_count=36, location=(0, 0, config['z']))
                obj = bpy.context.object
                obj.scale = tuple(config['scale'])
                return obj

            def add_tower(config):
                obj = add_box(config)
                shoulder_scale = (config['scale'][0] * 0.74, config['scale'][1] * 0.76, config['scale'][2] * 0.55)
                bpy.ops.mesh.primitive_cube_add(size=1, location=(0, -0.02, config['z'] + config['scale'][2] * 0.52))
                cap = bpy.context.object
                cap.scale = shoulder_scale
                bevel = cap.modifiers.new('softened-shoulder', 'BEVEL')
                bevel.width = 0.12
                bevel.segments = 10
                cap.modifiers.new('weighted-shoulder-normals', 'WEIGHTED_NORMAL')
                return obj

            def create_casters(config):
                if config['shape'] == 'box':
                    objects = [add_box(config)]
                elif config['shape'] == 'tower':
                    before = set(bpy.context.scene.objects)
                    add_tower(config)
                    objects = [obj for obj in bpy.context.scene.objects if obj not in before]
                else:
                    objects = [add_sphere(config)]
                material = bpy.data.materials.new('shadow-caster')
                material.diffuse_color = (0.035, 0.035, 0.035, 1)
                for obj in objects:
                    obj.data.materials.append(material)
                    obj.visible_camera = False
                return objects

            scene = reset_scene()
            RENDER_DIR.mkdir(parents=True, exist_ok=True)
            scene.render.filepath = str(RENDER_DIR / 'base.png')
            bpy.ops.render.render(write_still=True)

            for theme, pieces in CONFIGS.items():
                for kind, config in pieces.items():
                    casters = create_casters(config)
                    out_dir = RENDER_DIR / theme
                    out_dir.mkdir(parents=True, exist_ok=True)
                    scene.render.filepath = str(out_dir / f'{{kind}}.png')
                    bpy.ops.render.render(write_still=True)
                    for obj in casters:
                        bpy.data.objects.remove(obj, do_unlink=True)
            """
        )
    )


def render_shadow_sources() -> None:
    if not BLENDER.exists():
        raise SystemExit(f"Blender not found at {BLENDER}")
    if RENDER_DIR.exists():
        shutil.rmtree(RENDER_DIR)
    TMP_DIR.mkdir(parents=True, exist_ok=True)
    blender_script = TMP_DIR / "render_contact_shadows.py"
    write_blender_script(blender_script, SHADOW_CONFIGS)
    subprocess.run(
        [str(BLENDER), "--background", "--python", str(blender_script)],
        check=True,
        cwd=ROOT,
    )


def shadow_from_render(render_path: Path, base_path: Path, max_alpha: int) -> Image.Image:
    render = Image.open(render_path).convert("RGB")
    base = Image.open(base_path).convert("RGB")
    delta = ImageChops.subtract(base.convert("L"), render.convert("L"))
    delta = delta.filter(ImageFilter.GaussianBlur(0.45))
    max_delta = max(delta.getextrema()[1], 1)
    alpha = delta.point(
        lambda value: 0
        if value < 2
        else min(max_alpha, round(((value / max_delta) ** 0.78) * max_alpha))
    )
    alpha = alpha.filter(ImageFilter.GaussianBlur(0.35))
    alpha = alpha.point(lambda value: 0 if value < 2 else value)
    shadow = Image.new("RGBA", render.size, (0, 0, 0, 0))
    shadow.putalpha(alpha)
    return shadow


def write_shadow_assets() -> None:
    if SHADOW_DIR.exists():
        shutil.rmtree(SHADOW_DIR)
    base_path = RENDER_DIR / "base.png"
    for theme, pieces in SHADOW_CONFIGS.items():
        out_dir = SHADOW_DIR / theme
        out_dir.mkdir(parents=True, exist_ok=True)
        for kind, config in pieces.items():
            shadow = shadow_from_render(RENDER_DIR / theme / f"{kind}.png", base_path, int(config["max_alpha"]))
            shadow.save(out_dir / f"{kind}.png")


def make_contact_sheet() -> None:
    rows: list[tuple[str, Path]] = []
    for theme in ("pebble", "knob", "neo-city", "soft-ceramic"):
        if theme == "neo-city":
            piece_dir = THEME_DIR / theme / "light"
        else:
            piece_dir = THEME_DIR / theme
        rows.append((theme, piece_dir))

    sheet = Image.new("RGB", (1120, 880), (17, 29, 35))
    draw = ImageDraw.Draw(sheet)
    for row_index, (theme, piece_dir) in enumerate(rows):
        y = 36 + row_index * 210
        draw.text((34, y + 76), theme, fill=(230, 236, 233))
        for col_index, kind in enumerate(("black", "white", "blocker")):
            x = 190 + col_index * 290
            board = Image.new("RGBA", (172, 172), (17, 29, 35, 255))
            grid = ImageDraw.Draw(board)
            grid.line((86, 14, 86, 158), fill=(80, 98, 104, 255), width=2)
            grid.line((14, 86, 158, 86), fill=(80, 98, 104, 255), width=2)
            shadow = Image.open(SHADOW_DIR / theme / f"{kind}.png").resize((96, 96), Image.Resampling.LANCZOS)
            placement = PREVIEW_PLACEMENT[theme][kind]
            shadow_size = round(96 * float(placement["shadow_scale"]))
            shadow = shadow.resize((shadow_size, shadow_size), Image.Resampling.LANCZOS)
            shadow_alpha = shadow.getchannel("A").point(
                lambda value: round(value * float(placement["shadow_opacity"]))
            )
            shadow.putalpha(shadow_alpha)
            piece_size = round(96 * float(placement["piece_scale"]))
            piece = Image.open(piece_dir / f"{kind}.png").resize((piece_size, piece_size), Image.Resampling.LANCZOS)
            shadow_offset = placement["shadow_offset"]
            board.alpha_composite(
                shadow,
                (
                    86 - shadow_size // 2 + round(96 * float(shadow_offset[0])),
                    86 - shadow_size // 2 + round(96 * float(shadow_offset[1])),
                ),
            )
            board.alpha_composite(
                piece,
                (
                    86 - piece_size // 2,
                    86 - piece_size // 2 + round(96 * float(placement["piece_anchor"])),
                ),
            )
            sheet.paste(board.convert("RGB"), (x, y))
            draw.text((x + 54, y + 184), kind, fill=(160, 176, 178))
    CONTACT_SHEET.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(CONTACT_SHEET)
    print(CONTACT_SHEET)


def main() -> None:
    render_shadow_sources()
    write_shadow_assets()
    make_contact_sheet()


if __name__ == "__main__":
    main()
