var args = require("argh").argv;
var cmdline = require("./cmdline.js");
var pkgs = require("./pkgs.js");

var cmd;

var config = require("./config.js").config();

if (!args.argv || args.help) {
    cmd = "help";
} else {
    cmd = args.argv[0];
}

if (cmd == "init") {
    require("./init.js").exec({
        args: args,
        config: config
    });
} else if (cmd == "list") {
    var repo = pkgs.repo(config);
    Object.keys(repo.packages).forEach(function(name) {
        var pkg = repo.packages[name];
        console.log(pkg);
    });
} else if (cmd == "install") {
    if (args.argv.length == 1) {
        console.log("usage: chromeget install <package>");
        process.exit(0);
    }
    var pkgName = args.argv[1];
    console.log("Will install " + pkgName);
} else if (cmd == "help") {
    var hasCommand = args.argv !== undefined;
    if (hasCommand) {
        cmdline.printUsage(args.argv[1]);
    } else {
        cmdline.printUsage();
    }
}