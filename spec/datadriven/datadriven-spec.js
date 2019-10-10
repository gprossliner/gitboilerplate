const git = require('nodegit')
const fs = require('fs-extra')
const os = require('os')
const path = require('path')
const rmrf = require('rmfr')

const runner = require('../../runner')

describe("Datadriven Tests", function() {
    
    let workdir;

    beforeEach(async function() {

        if(require('inspector').url()){
            console.log("Running in debugger, setting timeout")
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10*60*1000; // 10 min
        }        

        workdir = fs.mkdtempSync(path.join(os.tmpdir(), "gbptest-"))
    });

    afterEach(async function() {
        await rmrf(workdir);
    });

    async function addAndCommit(repo){
        var index = await repo.refreshIndex()
        await index.addAll();
        await index.write();
        var oid = await index.writeTree();

        var commit = await repo.createCommit(
            "HEAD", 
            git.Signature.now("a", "a"), 
            git.Signature.now("c", "c"),
            "message",
            oid, []
        )

        return commit;
    }
  
    // performs the setup and returns the 'args' object
    async function setup(testname){
        let args = {};
        args["name"] = testname

        const testdir = args["testdir"] = path.join(__dirname, testname);

        // copy boilerplate items
        args.boilerplate = path.join(workdir, 'BOILERPLATE')
        await fs.copy(path.join(testdir, "BOILERPLATE"), args.boilerplate);

        // init repo and commit changes
        var repo = await git.Repository.init(args.boilerplate, 0)
        var commit = await addAndCommit(repo);
        args["commitId"] = commit.toString()
        
        // copy or create PROJECT subdirectory
        args.target = path.join(workdir, 'PROJECT')

        if(!fs.existsSync(args.target)){
            fs.mkdirSync(args.target);
        } else {
            args.target = path.join(workdir, 'PROJECT');
            await fs.copy(path.join(testdir, "PROJECT"), args.target);
        }

        return args;
    }

    async function compare(args){
        // we use git to compare. We copy the "RESULT" to the "PROJECT",
        // and check of uncommited changes

        const srcDir = path.join(args["testdir"], "RESULT");
        const destDir = path.join(workdir, "PROJECT");

        // create repo and commit
        var repo = await git.Repository.init(destDir, 0)
        await addAndCommit(repo);

        await fs.copy(
            srcDir, 
            destDir, {
                overwrite: true,
                preserveTimestamps: true,
                recursive:true
            }
        );

        // check for changes
        let filestatus = await repo.getStatus();
        expect(filestatus.length).toBe(0);

        args.toString();
    }

    // list all sub directories
    const tests = fs
        .readdirSync(__dirname)
        .filter(n=>fs.statSync(path.join(__dirname, n)).isDirectory())


    tests.forEach(test => {

        it(test, async function() {
            let args = await setup(test)
            await runner(args)
            await compare(args);
        });
      
    });
  

  });