var fs = require("fs");
var fsext = require("fs-extended");
var gzip = require("zlib").createGunzip();
var tar = require("tar");
var spawn = require("child_process").spawn;
var request = require("request");

function targunzip(file, target) {
    var process = spawn("/bin/tar", [ "zxvf", file, "-C" + target ], {
      cwd: "/",
      env: {}
    });
    process.on("error", function(err) {
      console.log("Unable to extract tar!".red);
    });
    process.stderr.on('data', function(data) {
      console.log(data.toString());
    });
    process.on("exit", function(code) {
      if (code !== 0) {
        console.log("Failed to Extract Tar!".red);
      }
    });
}

exports.install = function(opts) {
    var config = opts.config;
    var pkg = opts.pkg;
    
    var prefix = config.prefix;
    var tarUrl = pkg.tar;
    console.log("Downloading".cyan + " '" + pkg.name.red + "'");
    var downloaded = config.path+ "/" + pkg.name + ".tar.gz";
    request(tarUrl).pipe(fs.createWriteStream(downloaded, function() {}));

    console.log("Installing".green + " '" + pkg.name.red + "'");

    var strip = pkg.strip ? pkg.strip : 0;

    targunzip(downloaded, prefix, strip);

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
