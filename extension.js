import { Extension, InjectionManager, gettext as _ } from 'resource:///org/gnome/shell/extensions/extension.js';
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import { WindowMenu } from 'resource:///org/gnome/shell/ui/windowMenu.js';
import { Slider } from 'resource:///org/gnome/shell/ui/slider.js';
import { Logger } from './log.js';
import Atk from 'gi://Atk';

export default class TransparentWindow extends Extension {

    constructor(metadata) {
        super(metadata);
        Logger.init(this);
    }

    initLocalTranslations() {
        this.initTranslations('gnome-shell');
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
        this._injectionManager.overrideMethod(WindowMenu.prototype, '_buildMenu',
            originalMethod => {
                const self = this;
                let pos = 5;
                return function (window) {
                    originalMethod.call(this, window);
                    // this.myItem = new PopupMenu.PopupMenuItem(_('Transparency'), true, {});

                    let noneSlider = new Slider(0);
                    let noneSliderItem = new PopupMenu.PopupBaseMenuItem({ activate: false });
                    noneSliderItem.setOrnament(PopupMenu.Ornament.CHECK)
                    noneSliderItem.add_accessible_state(Atk.StateType.CHECKED)
                    noneSliderItem.add_child(noneSlider);


                    let items = this._getMenuItems();

                    //items[0].destroy();
                    // this.moveMenuItem(items[0], 4);

                    /* search for the "Always on Top" button */
                    function is_onTop() {
                        return items[pos].toString().includes(self._texts['Always on Top']);
                    }
                    if (!is_onTop()) {
                        for (pos = items.length; pos >= 0; pos--)
                            if (is_onTop()) break;
                    }
                    Logger.dir(items[pos], 'items[pos]');
                    this.addMenuItem(noneSliderItem, pos + 1);
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
