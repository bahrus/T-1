///<reference path='Scripts/typings/lodash/lodash.d.ts'/>
var t_1;
(function (t_1) {
    var PatternToObjectGenerator = (function () {
        function PatternToObjectGenerator(strings, values) {
            this.strings = strings;
            this.values = values;
        }
        PatternToObjectGenerator.prototype.parse = function (s, parseOptions) {
            return null;
        };
        return PatternToObjectGenerator;
    })();
    t_1.PatternToObjectGenerator = PatternToObjectGenerator;
    function compile(strings) {
        var values = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            values[_i - 1] = arguments[_i];
        }
        return new PatternToObjectGenerator(strings, values);
    }
    t_1.compile = compile;
    var StringMatch = (function () {
        function StringMatch(stringSeq, value) {
            this.stringSeq = stringSeq;
            this.value = value;
            if (!stringSeq || stringSeq.length === 0) {
                this.posOfHead = -1;
                return;
            }
            if (!value || value.length === 0) {
                this.posOfHead = -1;
                return;
            }
            this.posOfHead = value.indexOf(stringSeq[0]);
            if (this.posOfHead > -1) {
                var restOfString = value.substr(this.posOfHead + stringSeq[0].length);
                this.tail = new StringMatch(_.tail(stringSeq), restOfString);
            }
        }
        StringMatch.prototype.next = function () {
            if (this.posOfHead === -1)
                return -1;
            var nextTest = this.tail.next();
            if (nextTest > -1)
                return this.posOfHead;
            this.posOfHead = this.value.indexOf(this.stringSeq[0], this.posOfHead + this.stringSeq[0].length);
            if (this.posOfHead > -1) {
                var restOfString = this.value.substr(this.posOfHead + this.stringSeq[0].length);
                this.tail = new StringMatch(_.tail(this.stringSeq), restOfString);
            }
            return this.posOfHead;
        };
        StringMatch.prototype.posSequence = function (offset) {
            if (this.posOfHead === -1)
                return [];
            var newOffset = this.posOfHead + (offset === undefined ? 0 : offset);
            var tailSeq = this.tail.posSequence(newOffset);
            tailSeq.unshift(newOffset);
            return tailSeq;
        };
        return StringMatch;
    })();
    t_1.StringMatch = StringMatch;
})(t_1 || (t_1 = {}));
//# sourceMappingURL=t-1.js.map