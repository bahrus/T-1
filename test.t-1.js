///<reference path='Scripts/typings/mocha/mocha.d.ts'/>
///<reference path='Scripts/typings/chai/chai.d.ts'/>
describe('t_1.StringMatch', function () {
    it('Test 1.  No matches', function () {
        var test1 = new t_1.StringMatch(['doesNotExist'], 'I am here');
        chai.expect(test1.posOfHead).to.equal(-1);
    });
    it('Test 2.  A match', function () {
        var test2 = new t_1.StringMatch(['th', 'th'], 'Is this the face that launched a thousand ships?');
        chai.expect(test2.posOfHead).to.equal(3);
    });
    it('Test 3. get sequence', function () {
        var test3 = new t_1.StringMatch(['th', 'th'], 'Is this the face that launched a thousand ships?');
        var seq = test3.posSequence();
        chai.expect(seq).to.deep.equal([3, 8]);
    });
    it('Test 4.  generate object', function () {
        var obj = {
            prop1: 'obj.prop1',
            prop2: 'obj.prop2'
        };
        //var test4 = new t_1.StringMatch(['th', 'th'], 'Is this the face that launched a thousand ships?');
        var test4 = (_a = ["Hello, ", " : ", " can you"], _a.raw = ["Hello, ", " : ", " can you"], t_1.compile(_a, obj.prop1, obj.prop2));
        var resultObj = test4.parse('Hello, monsieur : how can you');
        chai.expect(resultObj).to.deep.equal({
            prop1: 'monsieur',
            prop2: 'how',
        });
        var _a;
    });
    it('Test 5.  parse InactiveScript', function () {
        var obj = {
            varName: 'obj.varName',
            varVal: 'obj.varVal',
            comment: 'obj.comment'
        };
        var test5 = (_a = ["const ", " = ", "; ", ""], _a.raw = ["const ", " = ", "; ", ""], t_1.compile(_a, obj.varName, obj.varVal, (_b = ["//", ""], _b.raw = ["//", ""], t_1.opt(_b, obj.comment))));
        var resultObj = test5.parse('const test = "hello"; //some comment');
        //debugger;
        chai.expect(resultObj).to.deep.equal({
            varName: 'test',
            varVal: '"hello"',
            comment: 'some comment'
        });
        var _a, _b;
    });
    it('Test 6.  Parse InactiveScript, ignore whitespace', function () {
        var obj = {
            varName: 'obj.varName',
            varVal: 'obj.varVal',
            comment: 'obj.comment'
        };
        var test6 = (_a = ["const    ", "=", ";", ""], _a.raw = ["const    ", "=", ";", ""], t_1.compile(_a, obj.varName, obj.varVal, (_b = ["//", ""], _b.raw = ["//", ""], t_1.opt(_b, obj.comment))));
        var parseOpts = {
            //ignoreWhitespace: true,
            normalizeFunction: t_1.removeWhitespaceInJS,
        };
        //debugger;
        var resultObj = test6.parse('const test   =   "hello";      //another     comment', null, parseOpts);
        //debugger;
        chai.expect(resultObj).to.deep.equal({
            varName: 'test',
            varVal: '"hello"',
            comment: 'another     comment'
        });
        var _a, _b;
    });
    it("Test 7.  Parse xml where order doesn't matter ignore whitespace", function () {
        var obj = {
            beforeText: 'obj.beforeText',
            option1: 'obj.option1',
            option2: 'obj.option2',
            afterText: 'obj.afterText'
        };
        var test7 = (_a = ["\n                ", "\n                <select>\n                    <option>", "</option>\n                    <option>", "</option>\n                </select>\n                ", "\n            "], _a.raw = ["\n                ", "\n                <select>\n                    <option>", "</option>\n                    <option>", "</option>\n                </select>\n                ", "\n            "], t_1.compile(_a, obj.beforeText, obj.option1, obj.option2, obj.afterText));
        var parseOpts = {
            normalizeFunction: t_1.normalizeXML,
        };
        //debugger;
        var resultObj = test7.parse("\n            <html>\n                <head>\n                    <title>My Document</title>\n                </head>\n                <body>\n                    <select><option>test 1</option><option>test2</option></select>\n                </body>\n            </html>\n            ", null, parseOpts);
        chai.expect(resultObj['option1']).to.equal('test 1');
        var _a;
    });
    it("Test 8.  Use of Symbols", function () {
        var obj = {
            varName: Symbol(),
            varVal: Symbol(),
            comment: Symbol(),
        };
        var compiler = new t_1.TemplateCompiler(obj);
        console.log(obj);
        var test8 = (_a = ["const    ", "=", ";", ""], _a.raw = ["const    ", "=", ";", ""], compiler.compile(_a, obj.varName, obj.varVal, (_b = ["//", ""], _b.raw = ["//", ""], t_1.opt(_b, obj.comment))));
        var parseOpts = {
            //ignoreWhitespace: true,
            normalizeFunction: t_1.removeWhitespaceInJS,
        };
        var _a, _b;
        //var resultObj = test8.parse('const test   =   "hello";      //another     comment', null, parseOpts);
    });
    it("Test 9.  Use of reflection with metadata", function () {
        var obj = {
            properties: {
                varName: {
                    path: 'obj.varName'
                },
                varVal: {
                    path: 'obj.varVal'
                },
                comment: {
                    path: 'obj.comment'
                }
            }
        };
        var test9 = (_a = ["const    ", "=", ";", ""], _a.raw = ["const    ", "=", ";", ""], t_1.compile(_a, obj.properties.varName.path, obj.properties.varVal.path, (_b = ["//", ""], _b.raw = ["//", ""], t_1.opt(_b, obj.properties.comment.path))));
        var parseOpts = {
            //ignoreWhitespace: true,
            normalizeFunction: t_1.removeWhitespaceInJS,
        };
        var resultObj = test9.parse('const test   =   "hello";      //another     comment', null, parseOpts);
        console.log('test9 =>');
        console.log(resultObj);
        var _a, _b;
    });
});
//# sourceMappingURL=test.t-1.js.map