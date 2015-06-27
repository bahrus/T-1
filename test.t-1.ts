///<reference path='Scripts/typings/mocha/mocha.d.ts'/>
///<reference path='Scripts/typings/chai/chai.d.ts'/>



describe('t_1.StringMatch',() => {
    it('Test 1.  No matches',() => {
        const test1 = new t_1.StringMatch(['doesNotExist'], 'I am here');
        chai.expect(test1.posOfHead).to.equal(-1);
    });
    it('Test 2.  A match',() => {
        const test2 = new t_1.StringMatch(['th', 'th'], 'Is this the face that launched a thousand ships?');
        chai.expect(test2.posOfHead).to.equal(3);
    });
    it('Test 3. get sequence',() => {
        const test3 = new t_1.StringMatch(['th', 'th'], 'Is this the face that launched a thousand ships?');
        const seq = test3.posSequence();
        chai.expect(seq).to.deep.equal([3, 8]);
    });
    it('Test 4.  generate object',() => {
        const obj = {
            prop1: 'obj.prop1',
            prop2: 'obj.prop2'
        };
        //var test4 = new t_1.StringMatch(['th', 'th'], 'Is this the face that launched a thousand ships?');
        const test4 = t_1.compile
            `Hello, ${obj.prop1} : ${obj.prop2} can you`;
        const resultObj = test4.parse('Hello, monsieur : how can you');
        chai.expect(resultObj).to.deep.equal({
            prop1: 'monsieur',
            prop2: 'how',
        });
    });
    it ('Test 5.  parse InactiveScript', () => {
        const obj = {
            varName: 'obj.varName',
            varVal: 'obj.varVal',
            comment: 'obj.comment'
        };
        const test5 = t_1.compile
            `const ${obj.varName} = ${obj.varVal}; ${t_1.opt`//${obj.comment}`}`
        const resultObj = test5.parse('const test = "hello"; //some comment');
        //debugger;
        chai.expect(resultObj).to.deep.equal({
            varName: 'test',
            varVal: '"hello"',
            comment: 'some comment'
        });
    });
    it ('Test 6.  Parse InactiveScript, ignore whitespace', () => {
        const obj = {
            varName: 'obj.varName',
            varVal: 'obj.varVal',
            comment: 'obj.comment'
        };
        const test6 = t_1.compile
            `const    ${obj.varName}=${obj.varVal};${t_1.opt`//${obj.comment}`}`;
        const parseOpts: t_1.IParseOptions = {
            //ignoreWhitespace: true,
            normalizeFunction: t_1.removeWhitespaceInJS,
            //debug: 'true',
        };
        //debugger;
        const resultObj = test6.parse('const test   =   "hello";      //another     comment', null, parseOpts);
        //debugger;
        chai.expect(resultObj).to.deep.equal({
            varName: 'test',
            varVal: '"hello"',
            comment: 'another     comment'
        });
    });
    it(`Test 7.  Parse xml where order doesn't matter ignore whitespace`,() => {
        const obj = {
            beforeText: 'obj.beforeText',
            option1: 'obj.option1',
            option2: 'obj.option2',
            afterText: 'obj.afterText'
        };
        const test7 = t_1.compile
            `
                ${obj.beforeText}
                <select>
                    <option>${obj.option1}</option>
                    <option>${obj.option2}</option>
                </select>
                ${obj.afterText }
            `;
        const parseOpts: t_1.IParseOptions = {
            normalizeFunction: t_1.normalizeXML,
            //debug: 'true',
        };
        //debugger;
        const resultObj = test7.parse(`
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

    it(`Test 8.  Use of Symbols`,() => {
        const obj = {
            varName:    Symbol(),
            varVal:     Symbol(),
            comment:    Symbol(),
        };
        const compiler = new t_1.TemplateCompiler(obj);
        console.log(obj);
        const test8 = compiler.compile
            `const    ${obj.varName}=${obj.varVal};${t_1.opt`//${<string>obj.comment}`}`;
        const parseOpts: t_1.IParseOptions = {
            //ignoreWhitespace: true,
            normalizeFunction: t_1.removeWhitespaceInJS,
            //debug: 'true',
        };
        //var resultObj = test8.parse('const test   =   "hello";      //another     comment', null, parseOpts);
    });
    it(`Test 9.  Use of reflection with metadata`, () => {
        const obj = {
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
        const test9 = t_1.compile
            `const    ${obj.properties.varName.path}=${obj.properties.varVal.path};${t_1.opt`//${obj.properties.comment.path}`}`;
        const parseOpts: t_1.IParseOptions = {
            //ignoreWhitespace: true,
            normalizeFunction: t_1.removeWhitespaceInJS,
            //debug: 'true',
        };
        const resultObj = test9.parse('const test   =   "hello";      //another     comment', null, parseOpts);
        console.log('test9 =>');
        console.log(resultObj);
    });
});
