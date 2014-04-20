/**
 * Brackets Themse Copyright (c) 2014 Miguel Castillo.
 *
 * Licensed under MIT
 */


define(function (require) {
    "use strict";

    var _ = brackets.getModule("thirdparty/lodash");
    var PreferencesManager = brackets.getModule("preferences/PreferencesManager"),
        Defaults           = require("Defaults"),
        SettingsDialog     = require("views/settings"),
        fontSettings       = require("FontSettings"),
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

    Settings.reset = function() {
        Settings.setValue("paths", Defaults.paths);
        Settings.setValue("theme",  Defaults.theme);
        Settings.setValue("fontSize", Defaults.fontSize + "px");
        Settings.setValue("lineHeight", Defaults.lineHeight);
        Settings.setValue("fontType", Defaults.fontType);
        Settings.setValue("customScrollbars", Defaults.customScrollbars);
    };


    ///
    ///  Make sure we have good default values.
    ///


    if ( Settings.getValue("paths") === (void 0) ) {
        Settings.setValue("paths", Defaults.paths);
    }

    if ( Settings.getValue("theme") === (void 0) ) {
        Settings.setValue("theme",  Defaults.theme);
    }

    if ( Settings.getValue("fontSize") === (void 0) ) {
        Settings.setValue("fontSize", Defaults.fontSize + "px");
    }

    if ( Settings.getValue("lineHeight") === (void 0) ) {
        Settings.setValue("lineHeight", Defaults.lineHeight);
    }

    if ( Settings.getValue("fontType") === (void 0) ) {
        Settings.setValue("fontType", Defaults.fontType);
    }

    if ( Settings.getValue("customScrollbars") === (void 0) ) {
        Settings.setValue("customScrollbars", Defaults.customScrollbars);
    }

    fontSettings(Settings);
    return Settings;
});
