import GLib from 'gi://GLib';
function getCircularReplacer() {
    const seen = new WeakSet();
    return (key, value) => {
        if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
                return "[Circular]";
            }
            seen.add(value);
        }
        return value;
    };
}

/**
 * Helper class for logging stuff
 * copied from `appindicatorsupport@rgcjonas.gmail.com/util.js`
 */
export class Logger {
    static _logStructured(logLevel, message, extraFields = {}) {
        if (!Object.values(GLib.LogLevelFlags).includes(logLevel)) {
            Logger._logStructured(GLib.LogLevelFlags.LEVEL_WARNING,
                'logLevel is not a valid GLib.LogLevelFlags');
            return;
        }

        if (!Logger._levels.includes(logLevel))
            return;

        let fields = {
            'SYSLOG_IDENTIFIER': this.uuid,
            'MESSAGE': `${message}`,
        };

        let thisFile = null;
        const { stack } = new Error();
        for (let stackLine of stack.split('\n')) {
            stackLine = stackLine.replace('resource:///org/gnome/Shell/', '');
            const [code, line] = stackLine.split(':');
            const [func, file] = code.split(/@(.+)/);

            if (!thisFile || thisFile === file) {
                thisFile = file;
                continue;
            }

            fields = Object.assign(fields, {
                'CODE_FILE': file || '',
                'CODE_LINE': line || '',
                'CODE_FUNC': func || '',
            });

            break;
        }

        GLib.log_structured(Logger._domain, logLevel, Object.assign(fields, extraFields));
    }

    static init(extension) {
        if (Logger._domain)
            return;

        const allLevels = Object.values(GLib.LogLevelFlags);
        const domains = GLib.getenv('G_MESSAGES_DEBUG');
        const { name: domain } = extension.metadata;
        this.uuid = extension.metadata.uuid;
        Logger._domain = domain.replaceAll(' ', '-');

        if (domains === 'all' || (domains && domains.split(' ').includes(Logger._domain))) {
            Logger._levels = allLevels;
        } else {
            Logger._levels = allLevels.filter(
                l => l <= GLib.LogLevelFlags.LEVEL_WARNING);
        }
    }

    static debug(message) {
        Logger._logStructured(GLib.LogLevelFlags.LEVEL_DEBUG, message);
    }

    static message(message) {
        Logger._logStructured(GLib.LogLevelFlags.LEVEL_MESSAGE, message);
    }

    static warn(message) {
        Logger._logStructured(GLib.LogLevelFlags.LEVEL_WARNING, message);
    }

    static error(message) {
        Logger._logStructured(GLib.LogLevelFlags.LEVEL_ERROR, message);
    }

    static critical(message) {
        Logger._logStructured(GLib.LogLevelFlags.LEVEL_CRITICAL, message);
    }

    static dir(obj) {
        Logger.debug(JSON.stringify(obj, getCircularReplacer(), 2));
    }
}