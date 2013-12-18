var fs = require("fs");
var targz = require('tar.gz');
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
    console.log("Installing " + pkg.name);
    request(tarUrl).pipe(fs.createWriteStream(config.path + "/tmp.tar.gz"));
    
    var compress = new targz().extract(config.path + "/tmp.tar.gz", config.prefix, function(err) {
        if(err) {
            console.log(err);
            process.exit(1);
        }
    });
};

exports.remove = function(opts) {
    var config = opts.config;
    var pkg = opts.pkg;
};