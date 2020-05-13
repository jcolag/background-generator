#!/bin/sh
node=$(which node)
forever start -c ${node} index.js
