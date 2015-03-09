///<reference path='Scripts/typings/mocha/mocha.d.ts'/>
///<reference path='Scripts/typings/chai/chai.d.ts'/>
describe('t_1.StringMatch',() => {
    var sm = new t_1.StringMatch(['doesNotExist'], 'I am here');
    it('should find no matches', () => {
        chai.expect(sm.posOfHead).to.equal(-1);
    });
});