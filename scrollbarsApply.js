/**
 * Brackets Themse Copyright (c) 2014 Miguel Castillo.
 *
 * Licensed under MIT
 */


define(function (require) {
    "use strict";

    var Settings = require("Settings");
    var enableScrollbars = Settings.getValue("enableScrollbars");
    var $scrollbars = $("<style id='scrollbars'>").appendTo("head");
    var theme;


    if ( enableScrollbars === undefined ) {
        Settings.setValue("enableScrollbars", true);
    }


    function scrollbarsApply(themeManager) {
        scrollbarsApply.update(themeManager);
    }


    scrollbarsApply.update = function(themeManager) {
        theme = themeManager ? themeManager.getThemes()[0] : (theme || {});
        if ( Settings.getValue("enableScrollbars") ) {
            var scrollbar = (theme.scrollbar || []).join(" ");
            $scrollbars.text(scrollbar || "");
        }
        else {
            $scrollbars.text("");
        }
    };


    scrollbarsApply.enable = function(themeManager) {
        Settings.setValue("enableScrollbars", true);
        scrollbarsApply.update(themeManager);
    };


    scrollbarsApply.disable = function(themeManager) {
        Settings.setValue("enableScrollbars", true);
        scrollbarsApply.update(themeManager);
    };


    $(Settings).on("change:enableScrollbars", function() {
        scrollbarsApply.update();
    });


    return scrollbarsApply;
});

