var args = require("argh").argv;
var cmdline = require("./cmdline.js");

if (process.getuid && process.setuid) {
    if (process.getuid() !== 0) {
        try {
            process.setuid(0);
            console.log("Gained Superuser Permissions".blue);
        } catch (err) {
            console.log("Failed to gain Superuser Permissions. Please run this with sudo!".red);
            process.exit(1);
        }
    }
}

var configManager = require("./config.js");

configManager.initialize();

var config = configManager.config();

var pkgs = require("./pkgs.js");
var repo = require("./repo.js");
var cmd;

if (!args.argv || args.help) {
    cmd = "help";
} else {
    cmd = args.argv[0];
}

if (cmd == "update") {
    repo.update({
        args: args,
        config: config
    });
} else if (cmd == "list") {
    var pkgrepo = repo.packages(config);
    Object.keys(pkgrepo.packages).forEach(function (name) {
        var pkg = pkgrepo.packages[name];
        console.log(name);
    });
} else if (cmd == "install") {
    if (args.argv.length == 1) {
        console.log("usage: chromeget install <package>");
        process.exit(0);
    }
    var pkgName = args.argv[1];
    var pkgrepo = repo.packages(config);

    var pkg = pkgrepo.packages[pkgName];

    if (pkg === undefined) {
        console.log("Package " + pkgName.red + " not found.");
        process.exit(1);
    }

    pkg.name = pkgName;

    pkgs.install({
        pkg: pkg,
        config: config,
        args: args
    });
} else if (cmd == "help") {
    var hasCommand = args.argv !== undefined;
    if (hasCommand) {
        cmdline.printUsage(args.argv[1]);
    } else {
        cmdline.printUsage();
    }
}