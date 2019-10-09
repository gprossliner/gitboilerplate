#!/usr/bin/env node
'use strict';
 
const ArgumentParser = require('argparse').ArgumentParser
const fs = require('fs')
const validator = require('./validator')

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
var args = parser.parseArgs();

// console.dir(args);

const validation=validator(args, true);
