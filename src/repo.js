var request = require("request");
var fs = require("fs-extended");

exports.update = function(opts) {
    var args = opts.args;
    var config = opts.config;
    
    var repoUrl = args.repo ? args.repo : config.repoMain;
    var repoFile = config.path + "/repo.json";

    console.log("Updating Package List");

    request(repoUrl, function (error, response, body) {
    	if (error) {
    		console.log("ERROR: Unable to fetch package list!", error);
    		process.exit(1);
    	}
    	fs.createFile(repoFile, body, function (error) {
    		if (error) {
    			console.log("ERROR: Unable to write package list to disk!", error);
    		}
    	});
    });
    console.log("Successfully Updated".green);
};

exports.packages = function(config) {
    try {
        var pkgsPath = config.path + "/repo.json";
        return fs.readJsonSync(pkgsPath);
    } catch(err) {
        console.log("ERROR: No Packages Found! Please run 'chromeget update' to download package list.");
        process.exit(1);
    }
};