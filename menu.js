/**
 * Brackets Themse Copyright (c) 2014 Miguel Castillo.
 *
 * Licensed under MIT
 */


define(function(require) {
    "use strict";
    var Menus          = brackets.getModule("command/Menus"),
        Commands       = brackets.getModule("command/Commands"),
        CommandManager = brackets.getModule("command/CommandManager"),
        Settings       = require("Settings");

    var menu = Menus.getMenu(Menus.AppMenuBar.FILE_MENU);
    var COMMAND_ID = "theme.settings";

    CommandManager.register("Theme Settings...", COMMAND_ID, Settings.open);
    menu.addMenuItem(COMMAND_ID, null, Menus.AFTER, Commands.FILE_PROJECT_SETTINGS);
});
