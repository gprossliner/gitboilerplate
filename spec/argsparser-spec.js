const argsparser = require("../argsparser");


describe("argsparser", function() {

    let retcode;
    let orgexit;
    let stdout;
    let stderr;
    
    beforeEach(()=>{

        retcode = 11111;
        stdout = "";
        stderr = "";

        orgexit = process.exit;
        orgwrite = process.stdout.write;

        process.exit = nr=>retcode = nr;
        process.stdout.write = s=>stdout += s;
        process.stderr.write = s=>stderr += s;
    });

    afterEach(()=>{
        process.exit = orgexit;
        process.stdout.write = orgwrite;
        process.stderr.write = orgwrite;
    })

    it("should parse ok without flags", ()=>{
        const args = argsparser(['http://boilerplate'])
        expect(args).toEqual({
            boilerplate: "http://boilerplate",
            target: ".",
            skipUndoValidation:false
        });
    });

    it("should parse -s correctly", ()=>{
        const args = argsparser(['http://boilerplate', '-s'])
        expect(args).toEqual({
            boilerplate: "http://boilerplate",
            target: ".",
            skipUndoValidation:true
        });
    });

    it("should parse -skip-undo-validation correctly", ()=>{
        const args = argsparser(['http://boilerplate', '--skip-undo-validation'])
        expect(args).toEqual({
            boilerplate: "http://boilerplate",
            target: ".",
            skipUndoValidation:true
        });
    });
    it("should return 2 and print help on --help", ()=>{
        argsparser(['-h'])
        expect(retcode).toBe(2)
        expect(stdout).toMatch("Allows you to easly use a git repository as a boilerplate")
    });

    it("should return 2 and print version on --version", ()=>{
        argsparser(['--version'])
        expect(retcode).toBe(2)
        expect(stdout).toMatch(/0.1.0/)
    });
});