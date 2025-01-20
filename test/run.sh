SH=zsh
cd ..
# FULL_SH_PATH="$(realpath "$0")"
# FULL_SH_DIR="$(dirname "$FULL_SH_PATH")"
# SH_DIR="$(basename "$FULL_SH_DIR")"
# echo gnome-extensions enable $SH_DIR | xclip -selection clipboard -r

# move popup to my offset pos
(sleep 2 ; wmctrl -r gnome-shell -e 0,870,1355,-1,-1 ; xdotool key Escape) &

# export LANG=en_US LANGUAGE=en_US:en
export "G_MESSAGES_DEBUG=Transparent-Window"
env GNOME_SHELL_SLOWDOWN_FACTOR=2 MUTTER_DEBUG_DUMMY_MODE_SPECS=1024x768 \
    dbus-run-session -- gnome-shell --nested --wayland
# open `foot` terminal, type `gnome-extensions enable addon@name`