SH=zsh
FULL_SH_PATH="$(realpath "$0")"
FULL_SH_DIR="$(dirname "$FULL_SH_PATH")"
SH_DIR="$(basename "$FULL_SH_DIR")"
echo gnome-extensions enable $SH_DIR | xclip -selection clipboard -r

env GNOME_SHELL_SLOWDOWN_FACTOR=2 MUTTER_DEBUG_DUMMY_MODE_SPECS=1024x768 \
dbus-run-session -- gnome-shell --nested --wayland
# open `foot` terminal, type `gnome-extensions enable addon@name`