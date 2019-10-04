const git = require("nodegit");
const fs = require("fs");
const path = require("path");
const rmfr = require('rmfr');

module.exports = async function(src) {

    // Clone a given repository into the `dest` directory
    // The directory must be empty
    console.log(`cloning ${src}`);
    const repo = await git.Clone(src, ".");
    console.log("done");
    

    // --depth 1 is not available, so we delete the .git folder
    // return rmfr(".git");

    console.log(`delete gitdir`);
    await rmfr(".git");
    console.log(`done`);
}