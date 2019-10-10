module.exports = function argsparser(argv) {

    // ArgumentParser expects argv to slice the first two elements (node + .js file)
    if(argv[0] == process.argv0) {
        argv = argv.slice(2);
    }

    const ArgumentParser = require('argparse').ArgumentParser
    const fs = require('fs')

    // read package.json metadata
    const packageinfo = JSON.parse(fs.readFileSync("package.json"));

    var parser = new ArgumentParser({
        version: packageinfo.version,
        addHelp:true,
        description: packageinfo.description
    });

    parser.addArgument(
    [ "boilerplate" ],
    {
        help: "the URL of the Boilerplate-Repository",
        required: false
    }
    );

    parser.addArgument(
        [ "target" ],
        {
        help: "The path to apply the Repository. Default is current directory",
        defaultValue: ".",
        nargs:"?"
        }
    );

    parser.addArgument(
        [ "-s", "--skip-undo-validation" ],
        {
        help: `If set, ${parser.prog} doesn't validate that undo can be performed`,
        defaultValue: false,
        nargs:"0",
        dest: "skipUndoValidation",
        action: "storeTrue"
        }
    );

    // parseArgs exits with ret-code 2, if failed
    // if exists with 0 if -h or -v
    // we need to copy the returned object, so that args.constructor === Object
    // otherwise the expect().toEqual({}) fails.
    const args = { ... parser.parseArgs(argv) };

    // console.dir(args);
    return args;
}