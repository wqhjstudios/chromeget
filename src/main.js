var colors = require("colors");
var args = require("argh").argv;

var config = {
    path: process.env["HOME"] + "/.chromeget",
    repoMain: "https://raw.github.com/kaendfinger/chromeget/master/pkgs/main.json"
};

var pkgs = require("./pkgs.js");

if (!args.argv) {
    console.log("usage: chromeget [command] [arguments]");
    process.exit(0);
}

var cmd = args.argv[0];

if (cmd == "init") {
    require("./init.js").exec({
        args: args,
        config: config
    });
} else if (cmd == "list") {
    var repo = pkgs.repo(config);
    repo.packages.forEach(function(e) {
        console.dir(e);
    });
}