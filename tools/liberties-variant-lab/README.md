# Liberties Variant Lab

Playable sandbox for testing Liberties rule directions without touching the production game or homepage.

## Run

```bash
python3 -m http.server 8125 --directory tools/liberties-variant-lab
```

Open `http://127.0.0.1:8125`.

## Playtest

```bash
node tools/liberties-variant-lab/playtest.mjs --pack-size=12 --json=tmp/liberties-variant-lab-playtest.json
```

The runner generates a 12-day mini-pack for each of the 12 variants, solves each puzzle with the same rules engine used by the browser lab, and reports solve rate, filler ratio, shared moves, responses, and day-to-day score variance.

Browser smoke test:

```bash
node tools/liberties-variant-lab/browser-smoke.mjs
```

This opens the lab in headless Chrome, clicks through all variants, auto-plays each solved sample, and verifies that every variant reaches a settled state.

## Variants

- Efficient Capture
- Stone Budget
- Shared Crossing
- Dark Chain Survival
- Capture Race
- Responsive Lights
- Net / Ladder Chase
- Snapback / Sacrifice
- Life Shape
- Ko Threat Miniature
- Green Release Locks
- Territory Closure

The lab is intentionally small and synthetic. It exists to compare mechanics quickly before any production pack rewrite.
