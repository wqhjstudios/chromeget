var fs = require("fs");

exports.repo = function(config) {
    var pkgsPath = config.path + "/repo.json";
    return JSON.parse(fs.readFileSync(pkgsPath));
}