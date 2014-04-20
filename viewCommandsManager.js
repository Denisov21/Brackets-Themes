/**
 * Brackets Themes Copyright (c) 2014 Miguel Castillo.
 * @author Brad Gearon
 *
 * Licensed under MIT
 */


define(function (require) {
    "use strict";

    var Settings = require("Settings"),
        Defaults = require("Defaults"),
        ViewCommandHandlers = brackets.getModule("view/ViewCommandHandlers"),
        PreferencesManager = brackets.getModule("preferences/PreferencesManager");

    function ViewCommandsManager () {
        $(ViewCommandHandlers).on("fontSizeChange", updateThemeFontSize);
        $(Settings).on("change:fontSize", updateBracketsFontSize);
    }

    function updateThemeFontSize (evt, adjustment, fontSize /*, lineHeight*/) {
        Settings.setValue("fontSize", fontSize);
    }

    function updateBracketsFontSize() {
        var fontSize = Settings.getValue("fontSize"),
            fontSizeNumeric = Number(fontSize.replace(/px|em/, "")),
            fontSizeOffset = fontSizeNumeric - Defaults.fontSize;

        if(!isNaN(fontSizeOffset)) {
            PreferencesManager.setViewState("fontSizeAdjustment", fontSizeOffset);
            PreferencesManager.setViewState("fontSizeStyle", fontSize);
        }
    }

    // Let's make sure we use Themes fonts by default
    updateBracketsFontSize();
    return ViewCommandsManager;
});
