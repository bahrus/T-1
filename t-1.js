///<reference path='Scripts/typings/lodash/lodash.d.ts'/>
var t_1;
(function (t_1) {
    function removeWhitespace(s) {
        var result = '';
        for (var i = 0, n = s.length; i < n; i++) {
            var chr = s[i];
            switch (chr) {
                case '\n':
                case '\r':
                case ' ':
                    break;
                default:
                    result += chr;
            }
        }
        return result;
    }
    t_1.removeWhitespace = removeWhitespace;
    var chrCodeFora = 'a'.charCodeAt(0);
    var chrCodeForZ = 'z'.charCodeAt(0);
    var chrCodeFor$ = '$'.charCodeAt(0);
    var chrCodeFor_ = '_'.charCodeAt(0);
    var chrCodeFor0 = '0'.charCodeAt(0);
    var chrCodeFor9 = '9'.charCodeAt(9);
    function isAlpha(c) {
        var chrCode = c.charCodeAt(0);
        if (chrCode >= chrCodeFora && chrCode <= chrCodeForZ)
            return true;
        switch (chrCode) {
            case chrCodeFor_:
            case chrCodeFor$:
                return true;
            default:
                return false;
        }
    }
    function isAlphaNumeric(c) {
        return isAlpha(c) || isNumeric(c);
    }
    function isNumeric(c) {
        var chrCode = c.charCodeAt(0);
        return chrCode >= chrCodeFor0 && chrCode <= chrCodeFor9;
    }
    function removeWhitespaceInJS(s) {
        console.log('removeWhitespaceInJs for s = ' + s);
        var result = '';
        var bInsideComment = false;
        //var bFirstSpaceEncountered = false;
        var lastChrAlphaNumeric = false;
        for (var i = 0, n = s.length; i < n; i++) {
            var chr = s[i];
            if (bInsideComment) {
                result += chr;
                continue;
            }
            switch (chr) {
                case ' ':
                    //if (lastChrAlphaNumeric) {
                    //    //next non space must be non alpha
                    //}
                    //if (!bFirstSpaceEncountered) {
                    //    result += chr;
                    //    bFirstSpaceEncountered = true;
                    //}
                    break;
                case '/':
                    if ((i < n - 1) && s[i + 1] === '/') {
                        bInsideComment = true;
                        result += chr;
                    }
                    break;
                default:
                    result += chr;
                    lastChrAlphaNumeric = isAlpha(chr) || (lastChrAlphaNumeric && isNumeric(chr));
            }
        }
        //var finalResult = '';
        //for (var i = 0, n = result.length; i < n; i++) {
        //    var chr = result[i];
        //    switch (chr) {
        //        case ' ':
        //    }
        //}
        console.log('result: ' + result);
        return result;
    }
    t_1.removeWhitespaceInJS = removeWhitespaceInJS;
    function normalizeXML(s) {
        var result = '';
        var lastNonSpaceChar = '';
        var bFirstSpace = true;
        for (var i = 0, n = s.length; i < n; i++) {
            var chr = s[i];
            switch (chr) {
                case '\n':
                case '\r':
                case ' ':
                    if (bFirstSpace && lastNonSpaceChar !== '>') {
                        result += ' ';
                        bFirstSpace = false;
                    }
                    break;
                default:
                    result += chr;
                    lastNonSpaceChar = chr;
                    bFirstSpace = true;
            }
        }
        result = result.trim();
        //console.log('result = ' + result);
        return result;
    }
    t_1.normalizeXML = normalizeXML;
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
            var stringToParse = s;
            if (parseOptions && parseOptions.normalizeFunction) {
                if (!this._normalizedStrings) {
                    this._normalizedStrings = this.strings
                        .map(function (str) { return parseOptions.normalizeFunction(str); })
                        .filter(function (str) { return str.length > 0; });
                }
                stringToParse = parseOptions.normalizeFunction(stringToParse);
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
            var iValCounter = 0;
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
                        returnObj[propNameArr[1]] = dynamicValue;
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
                    returnObj[propNameArr[1]] = dynamicValue;
                }
                else {
                    var pog = dynamicToken;
                    var stringToParse = this._stringToParse.substr(iPosOfPointer);
                    pog.parse(stringToParse, returnObj, parseOptions);
                }
            }
            return returnObj;
        };
        return PatternToObjectGenerator;
    })();
    t_1.PatternToObjectGenerator = PatternToObjectGenerator;
    //export class PatternToObjectGenerator2<TObj> implements IPatternToObjectGenerator<TObj>{
    //    private _patternToObjectGenerator : PatternToObjectGenerator<TObj>;
    //    constructor(public strings: string[], public values: Symbol[]) {
    //        var sValues = values.map(sym => {
    //            for(var key in 
    //        });
    //    }
    //    public parse(s: string, obj?: TObj, parseOptions?: IParseOptions): TObj {
    //        return null;
    //    }
    //}
    function compile(strings) {
        var values = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            values[_i - 1] = arguments[_i];
        }
        return new PatternToObjectGenerator(strings, values);
    }
    t_1.compile = compile;
    //export function compile2<TObj>(strings: string[], ...values: Symbol[]): PatternToObjectGenerator2<TObj> {
    //    debugger;
    //    return new PatternToObjectGenerator2<TObj>(strings, values);
    //}
    var TemplateCompiler = (function () {
        function TemplateCompiler(obj) {
            this.obj = obj;
        }
        return TemplateCompiler;
    })();
    t_1.TemplateCompiler = TemplateCompiler;
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
                if (parseOptions && parseOptions.normalizeFunction) {
                    this.posOfHead = value.indexOf(parseOptions.normalizeFunction(stringSeq[0]));
                }
                else {
                    this.posOfHead = value.indexOf(stringSeq[0]);
                }
            }
            if (this.posOfHead > -1) {
                var restOfString = value.substr(this.posOfHead + stringSeq[0].length);
                this.tail = new StringMatch(stringSeq.slice(1), restOfString, parseOptions);
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
                this.tail = new StringMatch(this.stringSeq.slice(1), restOfString, this.parseOptions);
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