import http.server
import json
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DIST_DIR = ROOT / "dist"

def _load_base_url() -> str:
    config_path = ROOT / "app.json"
    if not config_path.exists():
        return "/"
    try:
        with config_path.open("r", encoding="utf-8") as handle:
            config = json.load(handle)
    except json.JSONDecodeError:
        return "/"
    expo = config.get("expo", {})
    web = expo.get("web", {})
    base_url = web.get("baseUrl") or expo.get("experiments", {}).get("baseUrl") or "/"
    if not isinstance(base_url, str) or not base_url.strip():
        return "/"
    if not base_url.startswith("/"):
        base_url = "/" + base_url
    if not base_url.endswith("/"):
        base_url += "/"
    return base_url

BASE_URL = _load_base_url()

def _strip_base_url(path: str) -> str:
    if BASE_URL == "/":
        return path
    if path == BASE_URL[:-1]:
        return "/"
    if path.startswith(BASE_URL):
        remainder = path[len(BASE_URL):]
        return f"/{remainder}" if remainder else "/"
    return path

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DIST_DIR), **kwargs)

    def do_GET(self):
        self.path = _strip_base_url(self.path)
        path = self.translate_path(self.path)
        if os.path.exists(path) and not os.path.isdir(path):
            return super().do_GET()
        if os.path.isdir(path) and os.path.exists(os.path.join(path, 'index.html')):
            return super().do_GET()
        self.path = '/index.html'
        return super().do_GET()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', '8080'))
    server = http.server.HTTPServer(('0.0.0.0', port), SPAHandler)
    print(f"Serving on http://0.0.0.0:{port}")
    server.serve_forever()
