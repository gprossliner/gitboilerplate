const isUrl=require('is-url')
const path = require("path");
const url = require("url");

module.exports.getProjectName = function(src) {
    if(isUrl(src)){
        return path.basename(url.parse(src).path);
    }

    return path.basename(src);
}