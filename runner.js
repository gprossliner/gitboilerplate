"use strict"
const fs = require("fs-extra");
const os = require("os");
const path = require("path");
const rmrf = require("rmfr");

const helpers = require("./helpers");
const fetcher = require("./fetcher");
const processor = require("./fileprocessor");

module.exports = async function runner(args) {

    const src = args.boilerplate;
    const dest = args.target;

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

        // apply to project
        await fs.copy(
            workdir, 
            options.projectpath, {
                overwrite: true
            }
        )

        console.log("remove workdir: " + workdir)
        await rmrf(workdir)

    } catch (e) {
        console.log(e);
    }

    process.chdir(pwd);
}
