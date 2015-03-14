///<reference path='Scripts/typings/mocha/mocha.d.ts'/>
///<reference path='Scripts/typings/chai/chai.d.ts'/>
describe('t_1.StringMatch',() => {
    it('Test 1.  No matches',() => {
        var test1 = new t_1.StringMatch(['doesNotExist'], 'I am here');
        chai.expect(test1.posOfHead).to.equal(-1);
    });
    it('Test 2.  A match',() => {
        var test2 = new t_1.StringMatch(['th', 'th'], 'Is this the face that launched a thousand ships?');
        chai.expect(test2.posOfHead).to.equal(3);
    });
    it('Test 3. get sequence',() => {
        var test3 = new t_1.StringMatch(['th', 'th'], 'Is this the face that launched a thousand ships?');
        var seq = test3.posSequence();
        chai.expect(seq).to.deep.equal([3, 8]);
    });
    it('Test 4.  generate object',() => {
        var obj = {
            prop1: 'obj.prop1',
            prop2: 'obj.prop2'
        };
        //var test4 = new t_1.StringMatch(['th', 'th'], 'Is this the face that launched a thousand ships?');
        var test4 = t_1.compile`Hello, ${obj.prop1} : ${obj.prop2} can you`;
        var resultObj = test4.parse('Hello, monsieur : how can you');
        chai.expect(resultObj).to.deep.equal({
            prop1: 'monsieur',
            prop2: 'how',
        });
    });
});
