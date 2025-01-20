#!/bin/bash -e
DIR=js
FULL_SH_PATH="$(realpath "$0")"
FULL_SH_DIR="$(dirname "$FULL_SH_PATH")"
SH_DIR="$(basename "$FULL_SH_DIR")"
if [ $DIR = "test" ]; then cd .. ; fi
cd gnome-shell

git sparse-checkout init --cone
git sparse-checkout set $DIR
git checkout