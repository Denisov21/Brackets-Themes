/**
 * Brackets Themse Copyright (c) 2014 Miguel Castillo.
 *
 * Licensed under MIT
 */


define(function (require) {
    "use strict";

    var _ = brackets.getModule("thirdparty/lodash");
    var PreferencesManager = brackets.getModule("preferences/PreferencesManager"),
        SettingsDialog     = require("views/settings"),
        PREFERENCES_KEY    = "brackets-themes",
        _settings          = PreferencesManager.getExtensionPrefs(PREFERENCES_KEY);


    function Settings() {
    }

    Settings.open = function() {
        SettingsDialog.open(Settings);
    };

    Settings.close = function() {
        SettingsDialog.close();
    };

    Settings.getValue = function() {
        return _settings.get.apply(_settings, arguments);
    };

    Settings.setValue = function() {
        _settings.set.apply(_settings, arguments);
        $(Settings).trigger("change", arguments);
        $(Settings).trigger("change:" + arguments[0], [arguments[1]]);
    };

    Settings.getAll = function() {
        var pathLength = _settings.prefix.length;
        var prefix = _settings.prefix;

        return _.transform(_settings.base._scopes.user.data, function(result, value, key) {
            if ( key.indexOf(prefix) === 0 ) {
                result[key.substr(pathLength)] = value;
            }
        });
    };

    return Settings;
});
