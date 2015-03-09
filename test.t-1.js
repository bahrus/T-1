///<reference path='Scripts/typings/mocha/mocha.d.ts'/>
///<reference path='Scripts/typings/chai/chai.d.ts'/>
describe('t_1.StringMatch', function () {
    var test1 = new t_1.StringMatch(['doesNotExist'], 'I am here');
    it('new t_1.StringMatch(["doesNotExist"], "I am here") should find no matches', function () {
        chai.expect(test1.posOfHead).to.equal(-1);
    });
    var test2 = new t_1.StringMatch(['th', 'th'], 'Is this the face that launched a thousand ships?');
    debugger;
    it("new t_1.StringMatch(['th', 'th'], 'Is this the face that launched a thousand ships? ') should find a match", function () {
        chai.expect(test2.posOfHead).to.equal(3);
    });
});
//describe('t_1.StringMatch2',() => {
//}); 
//# sourceMappingURL=test.t-1.js.map