///<reference path='Scripts/typings/mocha/mocha.d.ts'/>
///<reference path='Scripts/typings/chai/chai.d.ts'/>
describe('t_1.StringMatch', function () {
    var sm = new t_1.StringMatch(['doesNotExist'], 'I am here');
    it('should find no matches', function () {
        chai.expect(sm.posOfHead).to.equal(-1);
    });
});
//# sourceMappingURL=test.t-1.js.map