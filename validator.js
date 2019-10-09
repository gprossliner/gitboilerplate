const git = require("nodegit");
const fs = require("fs");

// performs validation, if nothrow is specifed,
// If "nocli" is specified, the error is thrown, otherwise is it printed to stderr,
// and the process exits with code 1
module.exports = async function validator(args, nocli){
    
    if(!args) throw new Error("'args' parameter is mandatory");

    const src = args.boilerplate;
    const dest = args.target;
    let error;

    do {

        // check if destination exist
        if(!fs.existsSync(dest)){
            error = `The directory ${dest} does not exist.`;
            break;
        }

        // check if the destination is no git repository
        let repo;
        try{
            repo = await git.Repository.open(dest);
        } catch(e){
            if(e.errno == -3){
                if(!args.skipUndoValidation){
                    error = `${dest} is no repository, so undo is not possible. You may specify -s to skip this validation.`
                }
            } else {
                throw e;
            }
        }

        if(repo){
            let filestatus = await repo.getStatus();
            if(filestatus.length > 0){
                if(!args.skipUndoValidation){
                    error = `${dest} has uncommitted changes, so undo is not possible. You may specify -s to skip this validation.`
                }
            }
        }

    } while(0);

    if(error){
        if(nocli) {
            throw new Error(error);
        } else {
            console.error(error);
            process.exit(1);
        }
    }
}