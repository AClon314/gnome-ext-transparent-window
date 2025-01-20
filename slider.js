import Gio from 'gi://Gio';
import GObject from 'gi://GObject';
import { QuickSlider } from '../quickSettings.js';
import { loadInterfaceXML } from '../../misc/fileUtils.js';
import { Logger } from './log.js'

const BUS_NAME = 'org.gnome.SettingsDaemon.Power';
const OBJECT_PATH = '/org/gnome/SettingsDaemon/Power';

const TransparencyInterface = loadInterfaceXML('org.gnome.SettingsDaemon.Power.Screen');
const TransparencyProxy = Gio.DBusProxy.makeProxyWrapper(TransparencyInterface);

export const TransparencySlider = GObject.registerClass(
    class TransparencySlider extends QuickSlider {
        _init(extensionObject) {
            super._init({
                iconName: 'selection-mode-symbolic',
                iconLabel: _('Icon Accessible Name'),
            });

            // Watch for changes and set an accessible name for the slider
            this._sliderChangedId = this.slider.connect('notify::value',
                this._onSliderChanged.bind(this));
            this.slider.accessible_name = _('Example Slider');

            // Make the icon clickable (e.g. volume mute/unmute)
            this.iconReactive = true;
            this._iconClickedId = this.connect('icon-clicked',
                () => Logger.debug('Slider icon clicked!'));

            // Binding the slider to a GSettings key
            this._settings = extensionObject.getSettings();
            this._settings.connect('changed::slider-value',
                this._onSettingsChanged.bind(this));
            this._onSettingsChanged();
        }

        _onSettingsChanged() {
            // Prevent the slider from emitting a change signal while being updated
            this.slider.block_signal_handler(this._sliderChangedId);
            this.slider.value = this._settings.get_uint('slider-value') / 100.0;
            this.slider.unblock_signal_handler(this._sliderChangedId);
        }

        _onSliderChanged() {
            // Assuming our GSettings holds values between 0..100, adjust for the
            // slider taking values between 0..1
            const percent = Math.floor(this.slider.value * 100);
            this._settings.set_uint('slider-value', percent);
        }
    });