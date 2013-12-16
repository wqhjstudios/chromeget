var fs = require("fs");

exports.repo = function(config) {
    var pkgsPath = config.path + "/repo.json";
    return JSON.parse(fs.readFileSync(pkgsPath));
}

exports.install = function(opts) {
    var config = opts.config;
    var pkg = opts.pkg;
}

exports.remove = function(opts) {
    var config = opts.config;
    var pkg = opts.pkg;
}