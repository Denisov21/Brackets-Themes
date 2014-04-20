/**
 * Brackets Themse Copyright (c) 2014 Miguel Castillo.
 *
 * Licensed under MIT
 */


define(function (require) {
    "use strict";

    var Settings = require("Settings"),
        Defaults = require("Defaults");

    var fontSize = Settings.getValue("fontSize"),
        fontType = Settings.getValue("fontType"),
        lineHeight = Settings.getValue("lineHeight"),
        $lineHeight = $("<style type='text/css' id='lineHeight'>").appendTo("head"),
        $fontSize = $("<style type='text/css' id='fontSize'>").appendTo("head"),
        $fontType = $("<style type='text/css' id='fontType'>").appendTo("head");

    if (fontSize === undefined) {
        Settings.setValue("fontSize", Defaults.FONT_SIZE + "px");
    }

    if (lineHeight === undefined) {
        Settings.setValue("lineHeight", Defaults.LINE_HEIGHT);
    }

    if (fontType === undefined) {
        Settings.setValue("fontType", "'SourceCodePro-Medium', ＭＳ ゴシック, 'MS Gothic', monospace");
    }


    function generalSettings() {
        generalSettings.update();
    }

    generalSettings.updateLineHeight = function () {
        var value = Settings.getValue("lineHeight");
        $lineHeight.text(".CodeMirror{" + "line-height: " + value + ";}");
    };

    generalSettings.updateFontSize = function () {
        var value = Settings.getValue("fontSize");
        $fontSize.text(".CodeMirror{" + "font-size: " + value + " !important; }");
    };

    generalSettings.updateFontType = function () {
        var value = Settings.getValue("fontType");
        $fontType.text(".CodeMirror{" + "font-family: " + value + " !important; }");
    };

    generalSettings.update = function () {
        // Remove this tag that is intefering with font settings set in this module
        $("#codemirror-dynamic-fonts").remove();

        generalSettings.updateLineHeight();
        generalSettings.updateFontSize();
        generalSettings.updateFontType();
    };

    $(Settings).on("change:lineHeight", generalSettings.updateLineHeight);
    $(Settings).on("change:fontSize", generalSettings.updateFontSize);
    $(Settings).on("change:fontType", generalSettings.updateFontType);
    return generalSettings;
});
