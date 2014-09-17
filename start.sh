#!/bin/bash
echo Starting teleinfo data collection

current_folder=$(dirname $0)
cmd="$current_folder/collect.js"
echo "Launching '$cmd'"

/usr/bin/screen -d -m $cmd
