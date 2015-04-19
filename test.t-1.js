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
        var test4 = t_1.compile `Hello, ${obj.prop1} : ${obj.prop2} can you`;
        var resultObj = test4.parse('Hello, monsieur : how can you');
        chai.expect(resultObj).to.deep.equal({
            prop1: 'monsieur',
            prop2: 'how',
        });
    });
    it('Test 5.  parse InactiveScript', function () {
        var obj = {
            varName: 'obj.varName',
            varVal: 'obj.varVal',
            comment: 'obj.comment'
        };
        var test5 = t_1.compile `const ${obj.varName} = ${obj.varVal}; ${t_1.opt `//${obj.comment}`}`;
        var resultObj = test5.parse('const test = "hello"; //some comment');
        //debugger;
        chai.expect(resultObj).to.deep.equal({
            varName: 'test',
            varVal: '"hello"',
            comment: 'some comment'
        });
    });
    it('Test 6.  Parse InactiveScript, ignore whitespace', function () {
        var obj = {
            varName: 'obj.varName',
            varVal: 'obj.varVal',
            comment: 'obj.comment'
        };
        var test6 = t_1.compile `const    ${obj.varName}=${obj.varVal};${t_1.opt `//${obj.comment}`}`;
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
    });
    it(`Test 7.  Parse xml where order doesn't matter ignore whitespace`, function () {
        var obj = {
            beforeText: 'obj.beforeText',
            option1: 'obj.option1',
            option2: 'obj.option2',
            afterText: 'obj.afterText'
        };
        var test7 = t_1.compile `
                ${obj.beforeText}
                <select>
                    <option>${obj.option1}</option>
                    <option>${obj.option2}</option>
                </select>
                ${obj.afterText}
            `;
        var parseOpts = {
            normalizeFunction: t_1.normalizeXML,
        };
        //debugger;
        var resultObj = test7.parse(`
            <html>
                <head>
                    <title>My Document</title>
                </head>
                <body>
                    <select><option>test 1</option><option>test2</option></select>
                </body>
            </html>
            `, null, parseOpts);
        chai.expect(resultObj['option1']).to.equal('test 1');
    });
    it(`Test 8.  Use of Symbols`, function () {
        var obj = {
            varName: Symbol(),
            varVal: Symbol(),
            comment: Symbol(),
        };
        var compiler = new t_1.TemplateCompiler(obj);
        console.log(obj);
        var test8 = compiler.compile `const    ${obj.varName}=${obj.varVal};${t_1.opt `//${obj.comment}`}`;
    });
});
//# sourceMappingURL=test.t-1.js.map