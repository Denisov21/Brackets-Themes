/**
 * Brackets Themes Copyright (c) 2014 Miguel Castillo.
 *
 * Licensed under MIT
 */


define(function (require, exports, module) {
    "use strict";

    var _ = brackets.getModule("thirdparty/lodash");
    var PreferencesManager  = brackets.getModule("preferences/PreferencesManager"),
        FileUtils           = brackets.getModule("file/FileUtils"),
        ExtensionUtils      = brackets.getModule("utils/ExtensionUtils"),
        ExtensionLoader     = brackets.getModule("utils/ExtensionLoader"),
        ViewCommandHandlers = brackets.getModule("view/ViewCommandHandlers"),
        SettingsDialog      = require("views/settings"),
        prefs               = PreferencesManager.getExtensionPrefs("brackets-themes-extension");

    var cm_path     = FileUtils.getNativeBracketsDirectoryPath() + "/thirdparty/CodeMirror2/theme",
        user_path   = ExtensionUtils.getModulePath(module, "theme"),
        custom_path = user_path.substr(0, ExtensionLoader.getUserExtensionPath().lastIndexOf('/')) + "/themes";

    var defaults = {
        fontSize: '12px',
        lineHeight: '1.3em',
        fontType: "'SourceCodePro-Medium', ＭＳ ゴシック, 'MS Gothic', monospace",
        customScrollbars: true,
        themes: ["default"],
        paths: [{path:custom_path}, {path:user_path}, {path:cm_path}]
    };


    function init() {
        var fontSize        = prefs.get("fontSize"),
            fontSizeNumeric = Number(fontSize.replace(/px|em/, "")),
            fontSizeOffset  = fontSizeNumeric - Number(defaults.fontSize.replace(/px|em/, ""));

        if (!isNaN(fontSizeOffset)) {
            PreferencesManager.setViewState("fontSizeAdjustment", fontSizeOffset);
            PreferencesManager.setViewState("fontSizeStyle", fontSize);
        }

        $(ViewCommandHandlers).on("fontSizeChange", function(evt, adjustment, fontSize /*, lineHeight*/) {
            prefs.set("fontSize", fontSize);
        });

        prefs.on("change", "fontSize", function() {
            PreferencesManager.setViewState("fontSizeStyle", prefs.get("fontSize"));
        });
    }


    function openDialog() {
        SettingsDialog.open(exports);
    }

    function closeDialog() {
        SettingsDialog.close();
    }

    function getValue() {
        return prefs.get.apply(prefs, arguments);
    }

    function setValue() {
        prefs.set.apply(prefs, arguments);
        $(exports).trigger("change", arguments);
        $(exports).trigger("change:" + arguments[0], [arguments[1]]);
    }

    function getAll() {
        var pathLength = prefs.prefix.length;
        var prefix = prefs.prefix;

        return _.transform(prefs.base._scopes.user.data, function(result, value, key) {
            if ( key.indexOf(prefix) === 0 ) {
                result[key.substr(pathLength)] = value;
            }
        });
    }

    function reset() {
        prefs.set("themes", defaults.themes);
        prefs.set("fontSize", defaults.fontSize);
        prefs.set("lineHeight", defaults.lineHeight);
        prefs.set("fontType", defaults.fontType);
        prefs.set("customScrollbars", defaults.customScrollbars);
        prefs.set("paths", defaults.paths);
    }


    // Define all default values
    prefs.definePreference("themes", "array", defaults.themes);
    prefs.definePreference("fontSize", "string", defaults.fontSize);
    prefs.definePreference("lineHeight", "string", defaults.lineHeight);
    prefs.definePreference("fontType", "string", defaults.fontType);
    prefs.definePreference("customScrollbars", "boolean", defaults.customScrollbars);
    prefs.definePreference("paths", "array", defaults.paths);


    exports.init        = init;
    exports.defaults    = defaults;
    exports.reset       = reset;
    exports.openDialog  = openDialog;
    exports.closeDialog = closeDialog;
    exports.getValue    = getValue;
    exports.setValue    = setValue;
    exports.getAll      = getAll;
    exports.customPath  = custom_path;
});
