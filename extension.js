import { Extension, InjectionManager, gettext as _ } from 'resource:///org/gnome/shell/extensions/extension.js';
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import * as WindowMenu from 'resource:///org/gnome/shell/ui/windowMenu.js';
import { Logger } from './log.js';

export default class TransparentWindow extends Extension {

    constructor(metadata) {
        super(metadata);
        Logger.init(this);
    }

    initLocalTranslations() {
        /* this.initTranslations('gnome-shell'); */
        const en = [
            'Always on Top',
        ]
        this._texts = {};
        en.forEach((text) => {
            this._texts[text] = _(text);
        });

        this.initTranslations('transparent-window@aclon');
        Logger.debug(`_texts=${JSON.stringify(this._texts)}`);
    }

    _debug_callTerminal() {
        if (!GLib.getenv('G_MESSAGES_DEBUG')) return;
        try {
            const proc = Gio.Subprocess.new(
                ['foot'],
                // The flags control what I/O pipes are opened and how they are directed
                Gio.SubprocessFlags.STDOUT_PIPE | Gio.SubprocessFlags.STDERR_PIPE
            );
            // proc.force_exit();
        } catch (e) {
            Logger.error(`callTerminal: ${e}`);
        }
    }

    enable() {
        this._debug_callTerminal();
        this.initLocalTranslations();

        this._injectionManager = new InjectionManager();
        this._injectionManager.overrideMethod(WindowMenu.WindowMenu.prototype, '_buildMenu',
            originalMethod => {
                const self = this;
                let pos = 5;
                return function (window) {
                    originalMethod.call(this, window);
                    this.myItem = new PopupMenu.PopupMenuItem(_('Transparency'), true, {});
                    // this.myItem.icon.icon_name = 'preferences-desktop-wallpaper-symbolic';

                    let items = this._getMenuItems();

                    // Remove "Take screenshot" off the window menu
                    //items[0].destroy();

                    // Move "Take screenshot" just below the "Resize" button
                    // this.moveMenuItem(items[0], 4);

                    // Move "Take screenshot" just above the "Close" button
                    // Note: The separator line above the Close button counts as an item
                    //this.moveMenuItem(items[0],items.length-3);

                    /* search for the "Always on Top" button */
                    if (!items[pos].toString().includes(self._texts['Always on Top'])) {
                        for (pos = items.length; pos >= 0; pos--)
                            if (items[pos].toString().includes(self._texts['Always on Top'])) break;
                    }
                    this.addMenuItem(this.myItem, pos + 1);
                }
            }
        );
    }

    disable() {
        // WindowMenu.removeMenuItem(this.myItem);
        this._injectionManager.clear();
        this._injectionManager = null;
        Logger.debug('TransparentWindow disabled');
    }
}
