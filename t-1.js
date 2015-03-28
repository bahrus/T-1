///<reference path='Scripts/typings/lodash/lodash.d.ts'/>
var t_1;
(function (t_1) {
    var PatternToObjectGenerator = (function () {
        function PatternToObjectGenerator(strings, values) {
            this.strings = strings;
            this.values = values;
        }
        PatternToObjectGenerator.prototype.parse = function (s, parseOptions) {
            this._stringMatcher = new StringMatch(this.strings, s);
            this._stringToParse = s;
            return this.process();
        };
        PatternToObjectGenerator.prototype.process = function () {
            var iPosOfPointer = 0;
            var sequenceOfPositionsOfStaticsInStringToParse = this._stringMatcher.posSequence();
            var genericObj = {};
            var returnObj = genericObj;
            var iValCounter = 0;
            console.log(this.values);
            for (var i = 0, n = sequenceOfPositionsOfStaticsInStringToParse.length; i < n; i++) {
                var iPosOfNextStaticStringToken = sequenceOfPositionsOfStaticsInStringToParse[i];
                if (iPosOfNextStaticStringToken > iPosOfPointer) {
                    //#region there's some dynamic content
                    var propertyPath = this.values[iValCounter++];
                    if (typeof (propertyPath) === 'string') {
                        var propNameArr = propertyPath.split('.');
                        var dynamicValue = this._stringToParse.substring(iPosOfPointer, iPosOfNextStaticStringToken);
                        returnObj[propNameArr[1]] = dynamicValue;
                        iPosOfPointer = iPosOfNextStaticStringToken + this.strings[i].length;
                    }
                    else {
                        debugger;
                    }
                }
                else {
                    iPosOfPointer += this.strings[i].length;
                }
            }
            if (iValCounter < this.values.length) {
                //#region there's an extra trailing dynamic token to account for
                var dynamicToken = this.values[iValCounter++];
                if (typeof dynamicToken === 'string') {
                    throw 'not Implemented';
                }
                else {
                    var pog = dynamicToken;
                    debugger;
                }
            }
            return returnObj;
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
    function opt(strings) {
        var values = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            values[_i - 1] = arguments[_i];
        }
        var returnObj = new PatternToObjectGenerator(strings, values);
        return returnObj;
    }
    t_1.opt = opt;
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
            var tailSeq = this.tail.posSequence(newOffset + this.stringSeq[0].length);
            tailSeq.unshift(newOffset);
            return tailSeq;
        };
        return StringMatch;
    })();
    t_1.StringMatch = StringMatch;
})(t_1 || (t_1 = {}));
//# sourceMappingURL=t-1.js.map