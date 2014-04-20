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

    var settings            = require("Settings"),
        Theme               = require("Theme"),
        themeSettings       = require("views/settings"),
        themeFiles          = require("ThemeFiles"),
        themeApply          = require("ThemeApply"),
        scrollbarsApply     = require("ScrollbarsApply"),
        generalSettings     = require("GeneralSettings"),
        viewCommandsManager = require("ViewCommandsManager");

    var themeManager = {
        selected: settings.getValue("theme"),
        docMode: "",
        themes: {}
    };

    var _initted = false;

    if ( themeManager.selected === undefined ) {
        settings.setValue("theme",  ["default"]);
        themeManager.selected = ["default"];
    }


    /**
    * Process theme meta deta to create theme instances
    */
    function loadThemesFiles(themes) {
        // Iterate through each name in the themes and make them theme objects
        return _.map(themes.files, function (themeFile) {
            var theme = new Theme({fileName: themeFile, path: themes.path});
            return (themeManager.themes[theme.name] = theme);
        });
    }


    function setThemesClass(newThemes) {
        var oldThemes = themeManager.selected;
        themeManager.selected = (newThemes = newThemes || []);

        // We gotta prefix theme names with "theme" because themes that start with a number
        // will not render correctly.  Class names that start with a number are invalid
        newThemes = _.map(newThemes, function(theme){ return "theme-" + theme; }).join(" ");
        oldThemes = _.map(oldThemes, function(theme){ return "theme-" + theme; }).join(" ");
        $("html").removeClass(oldThemes.replace(' ', ',')).addClass(newThemes.replace(' ', ','));
    }


    function setDocumentMode(cm) {
        var mode = cm.getDoc().getMode();
        var docMode = mode && (mode.helperType || mode.name);
        $("html").removeClass("doctype-" + themeManager.docMode).addClass("doctype-" + docMode);
        themeManager.docMode = docMode;
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
            theme = themeManager.themes[name];

        if ( theme && theme.getFile().parentPath === file.parentPath ) {
            themeManager.update(true);
        }
    });


    $(settings)
        .on("change:fontSize", function() {
            themeManager.update();
        })
        .on("change:theme", function(evt, theme) {
            setThemesClass(theme);
            themeManager.update(true);
        });


    themeManager.update = function(refreshThemes) {
        var cm = getCM();
        if ( cm ) {
            setDocumentMode(cm);
            themeApply(themeManager, cm);
            refresh(cm);
        }

        if ( refreshThemes === true ) {
            loadThemes(themeManager.getThemes(), refreshThemes === true).done(function() {
                setThemesClass(settings.getValue("theme"));
                generalSettings(themeManager);
                scrollbarsApply(themeManager);

                if ( cm ) {
                    refresh(cm);
                }
            });
        }
    };


    themeManager.getThemes = function() {
        return _.map(settings.getValue("theme").slice(0), function (item) {
            return themeManager.themes[item];
        });
    };


    themeManager.init = function() {
        if ( _initted ) {
            return;
        }

        _initted = true;

        // Init themes when files meta data have all been loaded.  By the time
        // themeManager.init has been called, this is generally ready
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

            themeManager.update(true);
            themeSettings.themes(themeManager.themes);

            $(EditorManager).on("activeEditorChange", function() {
                themeManager.update();
            });
        });
    };


    return themeManager;
});
