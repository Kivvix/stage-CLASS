#! /usr/bin/env python
# -*- coding: utf-8 -*-

import BaseHTTPServer
import CGIHTTPServer
import cgitb; cgitb.enable(format="html")

import os

# save pid of server
pid = str(os.getpid())
pid_file = open("server.pid","w")
pid_file.write( pid )
pid_file.close()

# prepare sever
server_address = ("", 8080)
handler = CGIHTTPServer.CGIHTTPRequestHandler
handler.cgi_directories = ["/"]
httpd = CGIHTTPServer.BaseHTTPServer.HTTPServer(server_address, handler)

# lanch server
print """Server HTTP on 0.0.0.0 port """ + str(server_address[1]) + """ (pid: """ + pid + """)"""
try:
	httpd.serve_forever()
except KeyboardInterrupt:
	httpd.socket.close()
