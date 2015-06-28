///<reference path='Scripts/typings/node/node.d.ts'/>
///<reference path='t-1.ts'/>
if (typeof (global) !== 'undefined') {
    require('./t-1');
}
var obj = {
    varName: 'obj.varName',
    varVal: 'obj.varVal',
    comment: 'obj.comment'
};
var test = (_a = ["const    ", "=", ";", ""], _a.raw = ["const    ", "=", ";", ""], t_1.compile(_a, obj.varName, obj.varVal, (_b = ["//", ""], _b.raw = ["//", ""], t_1.opt(_b, obj.comment))));
var parseOpts = {
    normalizeFunction: t_1.removeWhitespaceInJS,
};
var resultObj = test.parse('const test   =   "hello";      //another     comment', null, parseOpts);
console.log(resultObj);
var _a, _b;
//# sourceMappingURL=app.js.map