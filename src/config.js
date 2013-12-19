var fs = require("fs");

var defaultConfig = {
    path: "/usr/local/chromeget",
    repoMain: "https://raw.github.com/kaendfinger/chromeget/master/pkgs/main.json",
    prefix: "/usr/local"
};


exports.initialize = function () {
    fs.exists(defaultConfig.path, function (exists) {
        if (!exists) {
            fs.mkdir(defaultConfig.path);
        }
    });
};

exports.config = function (filename) {
    var configPath = defaultConfig.path + "/" + (filename ? filename : "config.json");

    if (!fs.existsSync(configPath)) {
        fs.writeFile(configPath, JSON.stringify(defaultConfig, null, 4) + "\n", function () {});
        return defaultConfig;
    } else {
        return JSON.parse(fs.readFileSync(filename ? filename : configPath));
    }
};