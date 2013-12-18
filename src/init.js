var request = require("request");
var fs = require("fs");

exports = function(opts) {
    var args = opts.args;
    var config = opts.config;
    
    var repoUrl = args.repo ? args.repo : config.repoMain;
    
    console.log("Initializing Packages".green);
    request(repoUrl).pipe(fs.createWriteStream(config.path + "/repo.json"));
};