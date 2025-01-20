import { Extension, InjectionManager, gettext as _ } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import * as WindowMenu from 'resource:///org/gnome/shell/ui/windowMenu.js';
import { Logger } from './log.js';

export default class TransparentWindow extends Extension {

    constructor(metadata) {
        super(metadata);
        Logger.init(this);
    }

    initLocalTranslations() {
        // this.initTranslations('gnome-shell');
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

    enable() {
        this.initLocalTranslations();

        this._injectionManager = new InjectionManager();
        this._injectionManager.overrideMethod(WindowMenu.WindowMenu.prototype, '_buildMenu',
            originalMethod => {
                const self = this;
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

                    // search for the "Always on Top" button
                    let pos = 0;
                    for (pos = 0; pos < items.length; pos++) {
                        const str = items[pos].toString();
                        if (str.includes(self._texts['Always on Top'])) {
                            break;
                        }
                    }

                    this.addMenuItem(this.myItem, pos + 1);
                }
            }
        );
    }

    disable() {
        WindowMenu.removeMenuItem(this.myItem);
        this._injectionManager.clear();
        this._injectionManager = null;
        Logger.debug('TransparentWindow disabled');
    }
}
