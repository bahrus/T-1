///<reference path='Scripts/typings/node/node.d.ts'/>
///<reference path='t-1.ts'/>

if (typeof (global) !== 'undefined') {
    require('./t-1');
}

const obj = {
    varName: 'obj.varName',
    varVal: 'obj.varVal',
    comment: 'obj.comment'
};
const test = t_1.compile
    `const    ${obj.varName}=${obj.varVal};${t_1.opt`//${obj.comment}`}`;
const parseOpts: t_1.IParseOptions = {
    normalizeFunction: t_1.removeWhitespaceInJS,
};
const resultObj = test.parse('const test   =   "hello";      //another     comment', null, parseOpts);
console.log(resultObj);