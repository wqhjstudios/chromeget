var fs = require("fs");
var gzip = require("zlib").createGunzip();
var tar = require("tar");
var spawn = require("child_process").spawn;
var request = require("request");

exports.repo = function(config) {
    var pkgsPath = config.path + "/repo.json";
    return JSON.parse(fs.readFileSync(pkgsPath));
};

exports.install = function(opts) {
    var config = opts.config;
    var pkg = opts.pkg;
    
    var prefix = config.prefix;
    var tarUrl = pkg.tar;
    console.log("Installing".green + " " + pkg.name.red);
    request(tarUrl).pipe(gzip).pipe(tar.Extract({ path: prefix }));
    if (pkg.scripts) {
        if (pkg.scripts.install) {
            var install_script = pkg.scripts.install;
            var scriptProcess = spawn('sh', [ prefix + install_script ], {
                cwd: prefix,
                env: {}
            }).on('data', function(data) {
                console.log(data);
            });
        }
    }
};

exports.remove = function(opts) {
    var config = opts.config;
    var pkg = opts.pkg;
};
