import http.server
import os

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.path.abspath(os.path.join(os.path.dirname(__file__), "dist")), **kwargs)

    def do_GET(self):
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
