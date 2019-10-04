const fs = require("fs");
const os = require("os");
const path = require("path");

const dest = fs.mkdtempSync(path.join(os.tmpdir(), "gbp-"));
const src = "https://github.com/GitTools/GitVersion"


const fetcher = require("./fetcher");
const processor = require("./fileprocessor");

// this will be extracted later
let options = {
    projectname : "MYPROJ",
    boilerplatename : "GitVersion"
}

console.log("workdir: " + dest);


async function run() {

    try{

        await fetcher(src, dest);
        console.log("done!");

        await processor(dest, options);

    } catch (e) {
        console.log(e);
    }
}

run()
    .then(()=>console.log("end."));