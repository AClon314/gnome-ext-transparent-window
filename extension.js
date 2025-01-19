import { Extension, InjectionManager, gettext as _ } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import * as WindowMenu from 'resource:///org/gnome/shell/ui/windowMenu.js';

export default class TransparentWindow extends Extension {
    enable() {
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

                    this.addMenuItem(this.myItem, items.length - 4);

                    console.log('WindowMenu items:', items);
                }
            }
        );
    }

    disable() {
        WindowMenu.removeMenuItem(this.myItem);
        this._injectionManager.clear();
        this._injectionManager = null;
    }
}
