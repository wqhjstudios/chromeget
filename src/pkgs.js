var fs = require("fs");
var fsext = require("fs-extended");
var gzip = require("zlib").createGunzip();
var tar = require("tar");
var spawn = require("child_process").spawn;
var request = require("request");

function targunzip(file, target) {
    fs.createReadStream(file).pipe(gzip).pipe(tar.Extract({ path: target }));
}

exports.install = function(opts) {
    var config = opts.config;
    var pkg = opts.pkg;
    
    var prefix = config.prefix;
    var tarUrl = pkg.tar;
    console.log("Downloading".cyan + " '" + pkg.name.red + "'");
    var downloaded = config.prefix + pkg.name + ".tar.gz";
    request(tarUrl).pipe(fs.createWriteStream(downloaded, function() {}));

    console.log("Installing".green + " '" + pkg.name.red + "'");

    targunzip(downloaded, prefix);

    if (pkg.scripts) {
        if (pkg.scripts.install) {
            var install_script = pkg.scripts.install;
            console.log("--" + "Executing Install Script".magenta + "--");
            var scriptProcess = spawn('sh', [ prefix + "/" + install_script ], {
                cwd: prefix,
                env: {}
            });
            scriptProcess.stdout.on('data', function(data) {
                process.stdout.write(data);
            }).on('exit', function (exitCode) {
                console.log("Process Completed with status " + exitCode);
            });
        }
    }
};

exports.remove = function(opts) {
    var config = opts.config;
    var pkg = opts.pkg;
};