#!/usr/bin/env python3
"""
Simple HTTP Server for English Exam Practice Website
Serves the website locally so JSON files can load properly
"""

import http.server
import socketserver
import webbrowser
import os
import socket

def find_free_port(start_port=8000):
    """Find a free port starting from start_port"""
    for port in range(start_port, start_port + 100):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(('', port))
                return port
        except OSError:
            continue
    raise OSError("No free ports available")

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def start_server():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # Find an available port
    try:
        PORT = find_free_port(8000)
    except OSError:
        print("❌ No available ports found. Please close other servers and try again.")
        return
    
    with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
        print(f"🚀 English Exam Practice Website Server")
        print(f"📡 Server running at: http://localhost:{PORT}")
        print(f"🌐 Opening in browser...")
        print(f"🛑 Press Ctrl+C to stop the server")
        
        # Open in browser
        webbrowser.open(f'http://localhost:{PORT}')
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print(f"\n✅ Server stopped.")

if __name__ == "__main__":
    start_server() 