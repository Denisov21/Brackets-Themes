/**
 * Brackets Themse Copyright (c) 2014 Miguel Castillo.
 *
 * Licensed under MIT
 */


define(function (require) {
    "use strict";

    var Settings = require("Settings");
    var $lineHeight = $("<style type='text/css' id='lineHeight'>").appendTo("head"),
        $fontSize = $("<style type='text/css' id='fontSize'>").appendTo("head"),
        $fontType = $("<style type='text/css' id='fontType'>").appendTo("head");

    function GeneralSettings() {
        GeneralSettings.update();
    }

    GeneralSettings.updateLineHeight = function () {
        var value = Settings.getValue("lineHeight");
        $lineHeight.text(".CodeMirror{" + "line-height: " + value + ";}");
    };

    GeneralSettings.updateFontSize = function () {
        var value = Settings.getValue("fontSize");
        $fontSize.text(".CodeMirror{" + "font-size: " + value + " !important; }");
    };

    GeneralSettings.updateFontType = function () {
        var value = Settings.getValue("fontType");
        $fontType.text(".CodeMirror{" + "font-family: " + value + " !important; }");
    };

    GeneralSettings.update = function () {
        // Remove this tag that is intefering with font settings set in this module
        $("#codemirror-dynamic-fonts").remove();

        GeneralSettings.updateLineHeight();
        GeneralSettings.updateFontSize();
        GeneralSettings.updateFontType();
    };

    $(Settings).on("change:lineHeight", GeneralSettings.updateLineHeight);
    $(Settings).on("change:fontSize", GeneralSettings.updateFontSize);
    $(Settings).on("change:fontType", GeneralSettings.updateFontType);
    return GeneralSettings;
});
