const git = require("nodegit");
const fs = require("fs");

// performs validation, if nothrow is specifed,
// the error is returned as a string
module.exports = function validator(args, nothrow){
    
    if(!args) throw new Error("'args' parameter is mandatory");

    const src = args.boilerplate;
    const dest = args.target;
    let error;

    do {

        // check if destination exist
        if(!fs.existsSync(dest)){
            error = `The directory ${dest} doesn't exist`;
            break;
        }

        // check if the destination is no git repository
        const rep = git.Repository.open(dest);

    } while(0);

    if(error){
        if(nothrow)
            return error;
        else
            throw new Error(error);
    }
}