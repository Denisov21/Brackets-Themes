/**
 * Brackets Themse Copyright (c) 2014 Miguel Castillo.
 *
 * Licensed under MIT
 */


define(function () {
    "use strict";

    function initAddons() {
        // Set some default value for codemirror...
        CodeMirror.defaults.highlightSelectionMatches = true;
        CodeMirror.defaults.styleSelectedText = true;
    }

    function init() {
        var deferred = $.Deferred();

        /**
        *  This is where is all starts to load up...
        */
        brackets.getModule([
            "thirdparty/CodeMirror2/addon/selection/mark-selection",
            "thirdparty/CodeMirror2/addon/search/match-highlighter"
        ], deferred.resolve);

        return deferred.done(initAddons).promise();
    }

    return {
        ready: init().done
    };
});

