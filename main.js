/**
 * Brackets Themes Copyright (c) 2014 Miguel Castillo.
 *
 * Licensed under MIT
 */


define(function (require, exports, module) {
    "use strict";

    require("String");
    require("Menu");

    var ExtensionUtils  = brackets.getModule("utils/ExtensionUtils"),
        AppInit         = brackets.getModule("utils/AppInit");

    var ThemeManager     = require("ThemeManager"),
        CodeMirrorAddons = require("CodeMirrorAddons");

    // Load up reset.css to override brackground settings from brackets because
    // they make the themes look really bad.
    ExtensionUtils.loadStyleSheet(module, "reset.css");
    ExtensionUtils.loadStyleSheet(module, "views/settings.css");

    AppInit.appReady(function(){
        CodeMirrorAddons.ready(ThemeManager);
    });
});

