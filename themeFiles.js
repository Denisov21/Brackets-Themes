/**
 * Brackets Themse Copyright (c) 2014 Miguel Castillo.
 *
 * Licensed under MIT
 */


define(function(require) {
    "use strict";

    var FileSystem  = brackets.getModule("filesystem/FileSystem"),
        Settings    = require("Settings"),
        paths       = Settings.getValue("paths");

    // Root directory for CodeMirror themes
    var validExtensions = ["css", "less"];


    /**
    *  Return all the files in the specified path
    */
    function loadDirectory (path) {
        var result = $.Deferred();

        if ( !path ) {
            return result.resolve({
                files: [],
                path: path,
                error: "Path not defined"
            });
        }

        function readContent(err, entries) {
            var i, files = [];
            entries = entries || [];

            for (i = 0; i < entries.length; i++) {
                if (entries[i].isFile && validExtensions.indexOf(getExtension(entries[i].name)) !== -1) {
                    files.push(entries[i].name);
                }
            }

            result.resolve({
                files: files,
                path: path,
                error: err
            });
        }

        FileSystem.getDirectoryForPath(path).getContents(readContent);
        return result.promise();
    }


    function getExtension(file) {
        var lastIndexOf = file.lastIndexOf(".") + 1;
        return file.substr(lastIndexOf);
    }


    function init() {
        var i, length, directories = [];

        for ( i = 0, length = paths.length; i < length; i++ ) {
            directories.push(loadDirectory( paths[i].path ));
        }

        return $.when.apply((void 0), directories).promise();
    }


    return {
        ready: init().done,
        loadDirectory: loadDirectory
    };

});

