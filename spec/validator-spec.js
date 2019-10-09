const git = require('nodegit')
const fs = require('fs')
const os = require('os')
const path = require('path')
const rmrf = require('rmfr')

describe("Validator", function() {

    let workdirSrc;
    let workdirDest;
    beforeEach(function() {
        workdirSrc = fs.mkdtempSync(path.join(os.tmpdir(), "gbptest-"))
        workdirDest = fs.mkdtempSync(path.join(os.tmpdir(), "gbptest-"))
    });

    afterEach(async function() {
        await rmrf(workdirSrc);
        await rmrf(workdirDest);
    });
  
    async function validation(args, errorMatches){

        const validator = require("../validator");

        if(errorMatches)
            return expectError(args, errorMatches);
        else
            return expectNoError(args);

        async function expectError(args, messageMatches){
            let error;
            try{
                await validator(args, true);
            } catch(e){
                error = e;
            }

            if(!error) throw new Error("Validator not failed, as expected.");

            expect(error).not.toBeNull();
            expect(error.message).toMatch(messageMatches);
        }

        async function expectNoError(args){
            await validator(args, true);
        }
    }

    it("--skipUndoValidation not specified and target no repository", async function() {
      
        const args = {
            boilerplate: workdirSrc,
            target: workdirDest
        }

        return validation(
            args,
            /^[/-\w]+ is no repository, so undo is not possible. You may specify -s to skip this validation.$/
        )
      
    });

    it("--skipUndoValidation specified and target no repository", function() {
        const args = {
            boilerplate: workdirSrc,
            target: workdirDest,
            skipUndoValidation: true
        }

        return validation(args)
    });

    it("--skipUndoValidation not specified and uncommitted changes", async function() {
      
        // init repo
        await git.Repository.init(workdirDest, 0);

        // create a uncommitted change
        fs.writeFileSync(path.join(workdirDest, "newfile"), "content");

        const args = {
            boilerplate: workdirSrc,
            target: workdirDest
        }

        return validation(
            args,
            /^[/-\w]+ has uncommitted changes, so undo is not possible. You may specify -s to skip this validation.$/
        )
      
    });

    it("--skipUndoValidation specified and uncommitted changes", async function() {
      
        // init repo
        await git.Repository.init(workdirDest, 0);

        // create a uncommitted change
        fs.writeFileSync(path.join(workdirDest, "newfile"), "content");

        const args = {
            boilerplate: workdirSrc,
            target: workdirDest,
            skipUndoValidation: true
        }

        return validation(
            args
        )
      
    })

    it("target directory doesn't exist", async function() {
        const args = {
            boilerplate: workdirSrc,
            target: path.join(workdirDest, 'doesntexit'),
            skipUndoValidation: true
        }

        return validation(
            args,
            /^The directory [/-\w]+ does not exist.$/
        )
      
    })

});