import { Extension, InjectionManager, gettext as _ } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import * as WindowMenu from 'resource:///org/gnome/shell/ui/windowMenu.js';
import { Logger } from './log.js';

export default class TransparentWindow extends Extension {

    constructor(metadata) {
        super(metadata);
        Logger.init(this);
    }
    enable() {
        Logger.debug('TransparentWindow enabled');

        this._alwaysOnTop_ = _('Always on Top');
        this.initTranslations('transparent-window@aclon');

        this._injectionManager = new InjectionManager();
        this._injectionManager.overrideMethod(WindowMenu.WindowMenu.prototype, '_buildMenu',
            originalMethod => {
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
                        if (items[pos].toString().includes(this._alwaysOnTop_)) {
                            break;
                        }
                    }

                    this.addMenuItem(this.myItem, pos);

                    Logger.debug('always on top', this._alwaysOnTop_);
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
