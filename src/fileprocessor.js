const fs = require("fs");
const path = require("path");
const rif = require("replace-in-file");

module.exports = async function fileprocessor(directory, options){
    
    let files = [];

    // this function recursive walks the directory, renames files and dirs,
    // and adds all files to the 'files' array.
    function processdir(directory) {
        fs.readdirSync(directory).forEach(name=>{

            let namepath = path.join(directory, name);

            // check if we need to change the name
            let newname = name.replace(options.boilerplatename, options.projectname);
            if(newname != name) {

                // perform the rename
                let newnamepath = path.join(directory, newname);
                console.log(`rename ${namepath} -> ${newnamepath}`);

                fs.renameSync(namepath, newnamepath);

                // and switch variables
                name = newname;
                namepath = newnamepath;
            }

            if (fs.statSync(namepath).isDirectory()) {
                processdir(namepath);
            } else {
                files.push(namepath);
            }
        });
        
    }

    processdir(directory);

    console.log("replace file contents")
    rif.sync({
        files,
        verbose: true,
        from: new RegExp(options.boilerplatename, "g"),
        to: options.projectname
    });
    console.log("done");
}