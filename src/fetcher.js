const git = require("nodegit");
const fs = require("fs");
const path = require("path");
const rmfr = require('rmfr');

module.exports = async function(src, dest) {

    // Clone a given repository into the `dest` directory
    // The directory must be empty
    console.log(`cloning ${src} to ${dest}`);
    const repo = await git.Clone(src, dest);
    console.log("done");
    

    // --depth 1 is not available, so we delete the .git folder
    // return rmfr(".git");
    const gitdir = path.join(dest, ".git");

    console.log(`delete gitdir: ${gitdir}`);
    await rmfr(gitdir);
    console.log(`done`);
}