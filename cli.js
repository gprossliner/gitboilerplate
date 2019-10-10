#!/usr/bin/env node
'use strict';

const argsparser = require("./argsparser")
const validator = require("./validator")
const runner = require("./runner")

async function main(){

    const args = argsparser(process.argv)
    await validator(args, true)
    await runner(args)
}

main()
    .catch(reason=>{
        if(reason instanceof Error)
            throw reason;
        else
            throw new Error(reason);
    });
    