///<reference path='Scripts/typings/lodash/lodash.d.ts'/>
module t_1{
    
    export interface IParseOptions {
        normalizeFunction?: (s: string) => string;
        debug?: string;
        
    }

    export interface IPatternToObjectGenerator<TObj> {
        parse: (s: string, parseOptions?: IParseOptions) => TObj | TObj[];
    }

    export function removeWhitespace(s: string) {
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

    var chrCodeFora = 'a'.charCodeAt(0);
    var chrCodeForZ = 'z'.charCodeAt(0);
    var chrCodeFor$ = '$'.charCodeAt(0);
    var chrCodeFor_ = '_'.charCodeAt(0);
    var chrCodeFor0 = '0'.charCodeAt(0);
    var chrCodeFor9 = '9'.charCodeAt(9);


    function isAlpha(c: string) {
        var chrCode = c.charCodeAt(0);
        if (chrCode >= chrCodeFora && chrCode <= chrCodeForZ) return true;
        switch (chrCode) {
            case chrCodeFor_:
            case chrCodeFor$:
                return true;
            default:
                return false;
        }
    }

    function isAlphaNumeric(c: string) {
        return isAlpha(c) || isNumeric(c);
    }

    function isNumeric(c: string) {
        var chrCode = c.charCodeAt(0);
        return chrCode >= chrCodeFor0 && chrCode <= chrCodeFor9;
    }
    
    export function removeWhitespaceInJS(s: string) {
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

    export function normalizeXML(s: string) {
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

    export class PatternToObjectGenerator<TObj> implements IPatternToObjectGenerator<TObj>{
        private _stringMatcher: StringMatch;
        private _stringToParse: string;
        private _normalizedStrings: string[];
        constructor(public strings: string[], public values: string[]) {

        }

        public parse(s: string, obj?: TObj, parseOptions?: IParseOptions): TObj {
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
                        .map(str => parseOptions.normalizeFunction(str))
                        .filter(str => str.length > 0)
                    ;
                    
                }
                stringToParse = parseOptions.normalizeFunction(stringToParse);
            }
            var stringsToConsider = this._normalizedStrings;
            if (!stringsToConsider) stringsToConsider = this.strings;
             
            this._stringMatcher = new StringMatch(stringsToConsider, stringToParse, parseOptions);
            this._stringToParse = stringToParse;
            return this.process(obj, parseOptions);
        }
        private process(obj: TObj, parseOptions: IParseOptions): TObj {
            var iPosOfPointer = 0;
            var sequenceOfPositionsOfStaticsInStringToParse = this._stringMatcher.posSequence();
            var returnObj = obj;
            if (!returnObj) returnObj = <TObj> {};
            var iValCounter = 0;
            var stringsToConsider = this._normalizedStrings;
            if (!stringsToConsider) stringsToConsider = this.strings;

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
                    } else {
                        debugger;
                    }
                    //#endregion
                } else {
                    iPosOfPointer += stringsToConsider[i].length;
                }
            }

            if (iValCounter < this.values.length) {
                //#region there's an extra trailing dynamic token to account for
                var dynamicToken: string | PatternToObjectGenerator<TObj> =  this.values[iValCounter++];
                if (typeof dynamicToken === 'string') {
                    var propNameArr = dynamicToken.split('.');
                    var dynamicValue = this._stringToParse.substring(iPosOfPointer);
                    returnObj[propNameArr[1]] = dynamicValue;
                } else {
                    var pog = <PatternToObjectGenerator<TObj>> dynamicToken;
                    var stringToParse = this._stringToParse.substr(iPosOfPointer);
                    pog.parse(stringToParse, returnObj, parseOptions);
                }
                
                //#endregion
            }
            return returnObj;
        }
    }

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

    export function compile<TObj>(strings : string[], ...values : string[]): PatternToObjectGenerator<TObj> {
        return new PatternToObjectGenerator<TObj>(strings, values);
    }

    //export function compile2<TObj>(strings: string[], ...values: Symbol[]): PatternToObjectGenerator2<TObj> {
    //    debugger;
    //    return new PatternToObjectGenerator2<TObj>(strings, values);
    //}

    export class TemplateCompiler<TObj>{
        constructor(public obj: TObj) {
        }

        // public compile(strings: string[], ...values: Symbol[]) {
        // }
    }

    export function opt<TObj>(strings: string[], ...values: string[]){
        var returnObj = new PatternToObjectGenerator<TObj>(strings, values);
        return <string> <any> returnObj;
    }

    export class StringMatch {
        posOfHead: number;
        constructor(public stringSeq: string[], public value: string, public parseOptions?: IParseOptions) {
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
            } else {
                if (parseOptions && parseOptions.normalizeFunction) {
                    this.posOfHead = value.indexOf(parseOptions.normalizeFunction(stringSeq[0]));
                } else {
                    this.posOfHead = value.indexOf(stringSeq[0]);
                }
            }
            if (this.posOfHead > -1) {
                var restOfString = value.substr(this.posOfHead + stringSeq[0].length);
                this.tail = new StringMatch(stringSeq.slice(1), restOfString, parseOptions);
            }
        }
        next(): number{
            if (this.posOfHead === -1) return -1;
            var nextTest = this.tail.next();
            if (nextTest > -1) return this.posOfHead;
            this.posOfHead = this.value.indexOf(this.stringSeq[0], this.posOfHead + this.stringSeq[0].length);
            if (this.posOfHead > -1) {
                var restOfString = this.value.substr(this.posOfHead + this.stringSeq[0].length);
                this.tail = new StringMatch(this.stringSeq.slice(1), restOfString, this.parseOptions);
            }
            return this.posOfHead;
        }
        tail: StringMatch;
        posSequence(offset?: number): number[]{
            if (this.posOfHead === -1) return [];
            var newOffset = this.posOfHead + (offset === undefined ? 0 : offset);
            var tailSeq = this.tail.posSequence(newOffset + this.stringSeq[0].length);
            tailSeq.unshift(newOffset);
            return tailSeq;
        }
    }
}