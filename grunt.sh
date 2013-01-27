#!/bin/sh
supervisor -e "css|js|html" -n exit -w ./lib  -x grunt default