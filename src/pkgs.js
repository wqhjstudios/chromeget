var fs = require("fs");
var fsext = require("fs-extended");
var spawn = require("child_process").spawn;
var request = require("request");

function extractPkg(file, target, pkgType, strip, callback) {
    var finished = false;
    var tarArgs = (function() {
      if (pkgType.type == "tar") {
        return "xvf";
      } else if (pkgType.type == "tar.gz") {
        return "zxvf";
      }
    })();
    var args = [tarArgs, file, "-C" + target, "--strip-components=" + strip];
    var process = spawn("/bin/tar", args, {
        cwd: "/usr/local"
    });
    process.on("error", function (err) {
        console.log("Unable to extract tar!".red);
    });
    process.stderr.on('data', function (data) {
        console.log(data.toString());
    });
    process.stdout.on('data', function (data) {
        console.log(data.toString());
    });
    process.on("exit", function (code) {
        if (code !== 0) {
            console.log("Failed to Extract Tar!".red);
        }
        callback(code);
    });
}

function urlInfo(pkg) {
  if (pkg["tar.gz"]) {
    return {
      type: "tar.gz",
      url: pkg["tar.gz"]
    };
  } else if (pkg.tar) {
    return {
      type: "tar",
      url: pkg.tar
    };
  } else {
    console.log("Unable to find package type!".red);
    process.exit(1);
  }
}

exports.install = function (opts) {
    var config = opts.config;
    var pkg = opts.pkg;

    var prefix = config.prefix;
    var pkgType = urlInfo(pkg);
    console.log("Downloading".cyan + " '" + pkg.name.red + "'");
    var downloaded = config.path + "/" + pkg.name + pkgType.type;
    request(pkgType.url).pipe(fs.createWriteStream(downloaded, function () {}));

    console.log("Installing".green + " '" + pkg.name.red + "'");

    var strip = pkg.strip ? pkg.strip : 0;

    extractPkg(downloaded, prefix, pkgType, strip, function(code) {
        if (code !== 0) {
          return;
        }
        if (pkg.scripts) {
            if (pkg.scripts.install) {
                var install_script = pkg.scripts.install;
                console.log("--" + "Executing Install Script".magenta + "--");
                var scriptProcess = spawn('sh', [prefix + "/" + install_script], {
                    cwd: prefix,
                    env: {}
                });
                scriptProcess.stdout.on('data', function (data) {
                    process.stdout.write(data);
                }).on('exit', function (exitCode) {
                    console.log("Process Completed with status " + exitCode);
                });
            }
        }
    });
};

exports.remove = function (opts) {
    var config = opts.config;
    var pkg = opts.pkg;
};