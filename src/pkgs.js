var fs = require("fs");
var gzip = require("zlib").createGunzip();
var tar = require("tar");
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
    request(tarUrl).pipe(gzip).pipe(tar.Extract({ path: "/" }));
};

exports.remove = function(opts) {
    var config = opts.config;
    var pkg = opts.pkg;
};
