/**
 * Brackets Themse Copyright (c) 2014 Miguel Castillo.
 *
 * Licensed under MIT
 */


define(function (require) {
    "use strict";

    var _ = brackets.getModule("thirdparty/lodash");
    var EditorManager  = brackets.getModule("editor/EditorManager"),
        FileSystem     = brackets.getModule("filesystem/FileSystem");

    var Settings            = require("Settings"),
        Theme               = require("Theme"),
        themeSettings       = require("views/settings"),
        themeFiles          = require("ThemeFiles"),
        themeApply          = require("ThemeApply"),
        scrollbarsApply     = require("ScrollbarsApply"),
        viewCommandsManager = require("ViewCommandsManager");

    var ThemeManager = {
        selected: Settings.getValue("theme"),
        docMode: "",
        themes: {}
    };

    var _initted = false;


    /**
    * Process theme meta deta to create theme instances
    */
    function loadThemesFiles(themes) {
        // Iterate through each name in the themes and make them theme objects
        return _.map(themes.files, function (themeFile) {
            var theme = new Theme({fileName: themeFile, path: themes.path});
            return (ThemeManager.themes[theme.name] = theme);
        });
    }


    function setThemesClass(newThemes) {
        var oldThemes = ThemeManager.selected;
        ThemeManager.selected = (newThemes = newThemes || []);

        // We gotta prefix theme names with "theme" because themes that start with a number
        // will not render correctly.  Class names that start with a number are invalid
        newThemes = _.map(newThemes, function(theme){ return "theme-" + theme; }).join(" ");
        oldThemes = _.map(oldThemes, function(theme){ return "theme-" + theme; }).join(" ");
        $("html").removeClass(oldThemes.replace(' ', ',')).addClass(newThemes.replace(' ', ','));
    }


    function setDocumentMode(cm) {
        var mode = cm.getDoc().getMode();
        var docMode = mode && (mode.helperType || mode.name);
        $("html").removeClass("doctype-" + ThemeManager.docMode).addClass("doctype-" + docMode);
        ThemeManager.docMode = docMode;
    }


    /**
    * Loads theme style files
    */
    function loadThemes(themes, refresh) {
        var pending = _.map(themes, function (theme) {
            if ( theme ) {
                return theme.load(refresh);
            }
        });

        return $.when.apply((void 0), pending);
    }


    function refresh(cm) {
        // Really dislike timing issues with CodeMirror.  I have to refresh
        // the editor after a little bit of time to make sure that themes
        // are properly applied to quick edit widgets
        setTimeout(function(){
            cm.refresh();
            EditorManager.resizeEditor();
        }, 100);
    }


    function getCM() {
        var editor = EditorManager.getActiveEditor();
        if (!editor || !editor._codeMirror) {
            return;
        }
        return editor._codeMirror;
    }


    FileSystem.on("change", function(evt, file) {
        var name = (file.name || "").substring(0, file.name.lastIndexOf('.')),
            theme = ThemeManager.themes[name];

        if ( theme && theme.getFile().parentPath === file.parentPath ) {
            ThemeManager.update(true);
        }
    });


    $(Settings)
        .on("change:theme", function(evt, theme) {
            setThemesClass(theme);
            ThemeManager.update(true);
        })
        .on("change:fontSize", function() {
            ThemeManager.update();
        });


    ThemeManager.update = function(refreshThemes) {
        var cm = getCM();
        if ( cm ) {
            setDocumentMode(cm);
            themeApply(ThemeManager, cm);
            refresh(cm);
        }

        if ( refreshThemes === true ) {
            loadThemes(ThemeManager.getThemes(), refreshThemes === true).done(function() {
                setThemesClass(Settings.getValue("theme"));
                scrollbarsApply(ThemeManager);

                if ( cm ) {
                    refresh(cm);
                }
            });
        }
    };


    ThemeManager.getThemes = function() {
        return _.map(Settings.getValue("theme").slice(0), function (item) {
            return ThemeManager.themes[item];
        });
    };


    ThemeManager.init = function() {
        if ( _initted ) {
            return;
        }

        _initted = true;

        // Init themes when files meta data have all been loaded.  By the time
        // ThemeManager.init has been called, this is generally ready
        themeFiles.ready(function() {
            viewCommandsManager();

            var i, length;
            var args = arguments;

            for ( i = 0, length = args.length; i < length; i++ ) {
                if ( args[i].error ) {
                    console.log("=============> Themes error", args[i], args[i].error);
                    continue;
                }

                loadThemesFiles(args[i]);
            }

            ThemeManager.update(true);
            themeSettings.themes(ThemeManager.themes);

            $(EditorManager).on("activeEditorChange", function() {
                ThemeManager.update();
            });
        });
    };


    return ThemeManager;
});
