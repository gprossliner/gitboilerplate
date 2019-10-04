const fs = require("fs");
const os = require("os");
const path = require("path");

const helpers = require("./helpers");
const fetcher = require("./fetcher");
const processor = require("./fileprocessor");

// get boilerplate repo
const src = "/tmp/GitVersion"

// the local path to apply
const dest = "/tmp/MYPROJ"

async function run() {

    const pwd = process.cwd();

    const destabs = !path.isAbsolute(dest) ? 
        path.join(pwd, dest) : dest;

    let options = {
        projectpath : destabs,
        projectname : path.basename(destabs),
        boilerplateurl : src,
        boilerplatename : helpers.getProjectName(src)
    }

    try{

        console.log(`Apply ${options.boilerplateurl} to ${options.projectpath}`);

        const workdir = fs.mkdtempSync(path.join(os.tmpdir(), "gbp-"))
        console.log("workdir: " + workdir)
        process.chdir(workdir)

        await fetcher(options.boilerplateurl);
        console.log("done!");

        await processor(options);

    } catch (e) {
        console.log(e);
    }

    process.chdir(pwd);
}

run()
    .then(()=>console.log("end."));