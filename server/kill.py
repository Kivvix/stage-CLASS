#! /usr/bin/env python
# -*- coding: utf-8 -*-

import os

print """Content-type: text/html

<!DOCTYPE htmL><html><head><title>Kill server</title><meta charset="utf-8" /></head><body><h1>Kill server</h1></body></html>
"""

pid_file = open("server.pid","r")
pid = pid_file.readline()

os.kill(int(pid),5)
os.remove("server.pid")
