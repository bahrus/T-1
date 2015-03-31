///<reference path='Scripts/typings/lodash/lodash.d.ts'/>
var t_1;
(function (t_1) {
    function normalizeString(s) {
        var result = '';
        var bSpace = false;
        for (var i = 0, n = s.length; i < n; i++) {
            var chr = s[i];
            if (chr === ' ') {
                if (!bSpace) {
                    result += chr;
                    bSpace = true;
                }
            }
            else {
                result += chr;
                bSpace = false;
            }
        }
        return result;
    }
    t_1.normalizeString = normalizeString;
    var PatternToObjectGenerator = (function () {
        function PatternToObjectGenerator(strings, values) {
            this.strings = strings;
            this.values = values;
        }
        PatternToObjectGenerator.prototype.parse = function (s, obj, parseOptions) {
            if (parseOptions) {
                switch (parseOptions.debug) {
                    case 'true':
                        debugger;
                }
            }
            //var stringsToSearch = this.strings;
            var stringToParse = s;
            if (parseOptions && parseOptions.ignoreWhitespace) {
                if (!this._normalizedStrings) {
                    this._normalizedStrings = _.map(this.strings, function (str) {
                        //var trimmed = str.trim();
                        //if (trimmed.indexOf('  ') > -1) {
                        //    throw 'not implemented';
                        //}
                        var trimmed = normalizeString(str);
                        return trimmed;
                    });
                }
                //stringsToSearch = this._normalizedStrings;
                stringToParse = normalizeString(stringToParse);
            }
            var stringsToConsider = this._normalizedStrings;
            if (!stringsToConsider)
                stringsToConsider = this.strings;
            this._stringMatcher = new StringMatch(stringsToConsider, stringToParse, parseOptions);
            this._stringToParse = stringToParse;
            return this.process(obj, parseOptions);
        };
        PatternToObjectGenerator.prototype.process = function (obj, parseOptions) {
            var iPosOfPointer = 0;
            var sequenceOfPositionsOfStaticsInStringToParse = this._stringMatcher.posSequence();
            var returnObj = obj;
            if (!returnObj)
                returnObj = {};
            //var returnObj = <TObj> genericObj;
            var iValCounter = 0;
            //console.log(this.values);
            var stringsToConsider = this._normalizedStrings;
            if (!stringsToConsider)
                stringsToConsider = this.strings;
            for (var i = 0, n = sequenceOfPositionsOfStaticsInStringToParse.length; i < n; i++) {
                var iPosOfNextStaticStringToken = sequenceOfPositionsOfStaticsInStringToParse[i];
                if (iPosOfNextStaticStringToken > iPosOfPointer) {
                    //#region there's some dynamic content
                    var propertyPath = this.values[iValCounter++];
                    if (typeof (propertyPath) === 'string') {
                        var propNameArr = propertyPath.split('.');
                        var dynamicValue = this._stringToParse.substring(iPosOfPointer, iPosOfNextStaticStringToken);
                        if (parseOptions && parseOptions.ignoreWhitespace) {
                            returnObj[propNameArr[1]] = dynamicValue.trim();
                        }
                        else {
                            returnObj[propNameArr[1]] = dynamicValue;
                        }
                        iPosOfPointer = iPosOfNextStaticStringToken + stringsToConsider[i].length;
                    }
                    else {
                        debugger;
                    }
                }
                else {
                    iPosOfPointer += stringsToConsider[i].length;
                }
            }
            if (iValCounter < this.values.length) {
                //#region there's an extra trailing dynamic token to account for
                var dynamicToken = this.values[iValCounter++];
                if (typeof dynamicToken === 'string') {
                    var propNameArr = dynamicToken.split('.');
                    var dynamicValue = this._stringToParse.substring(iPosOfPointer);
                    if (parseOptions && parseOptions.ignoreWhitespace) {
                        returnObj[propNameArr[1]] = dynamicValue.trim();
                    }
                    else {
                        returnObj[propNameArr[1]] = dynamicValue;
                    }
                }
                else {
                    var pog = dynamicToken;
                    var stringToParse = this._stringToParse.substr(iPosOfPointer);
                    if (parseOptions && parseOptions.ignoreWhitespace) {
                        stringToParse = stringToParse.trim();
                    }
                    pog.parse(stringToParse, returnObj, parseOptions);
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
        function StringMatch(stringSeq, value, parseOptions) {
            this.stringSeq = stringSeq;
            this.value = value;
            this.parseOptions = parseOptions;
            if (!stringSeq || stringSeq.length === 0) {
                this.posOfHead = -1;
                return;
            }
            if (!value || value.length === 0) {
                this.posOfHead = -1;
                return;
            }
            if (stringSeq[0].length === 0) {
                this.posOfHead = -1;
            }
            else {
                if (parseOptions && parseOptions.ignoreWhitespace) {
                    this.posOfHead = value.indexOf(normalizeString(stringSeq[0]));
                }
                else {
                    this.posOfHead = value.indexOf(stringSeq[0]);
                }
            }
            if (this.posOfHead > -1) {
                var restOfString = value.substr(this.posOfHead + stringSeq[0].length);
                this.tail = new StringMatch(_.tail(stringSeq), restOfString, parseOptions);
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
                this.tail = new StringMatch(_.tail(this.stringSeq), restOfString, this.parseOptions);
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