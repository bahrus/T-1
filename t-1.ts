///<reference path='Scripts/typings/lodash/lodash.d.ts'/>
module t_1{
    
    export interface IParseOptions {
        ignoreCase?: boolean;
        ignoreWhitespace?: boolean;
        debug?: string;
        
    }

    export interface IPatternToObjectGenerator<TObj> {
        parse: (s: string, parseOptions?: IParseOptions) => TObj | TObj[];
    }

    export function normalizeString(s: string) {
        var result = '';
        var bSpace = false;
        for (var i = 0, n = s.length; i < n; i++) {
            var chr = s[i];
            if (chr === ' ') {
                if (!bSpace) {
                    result += chr;
                    bSpace = true;
                }
            } else {
                result += chr;
                bSpace = false;
            }
        }
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
            //var stringsToSearch = this.strings;
            var stringToParse = s;
            if (parseOptions && parseOptions.ignoreWhitespace) {
                if (!this._normalizedStrings) {
                    this._normalizedStrings = _.map(this.strings, str => {
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
            //var returnObj = <TObj> genericObj;
            var iValCounter = 0;
            //console.log(this.values);
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
                        if (parseOptions && parseOptions.ignoreWhitespace) {
                            returnObj[propNameArr[1]] = dynamicValue.trim();
                        } else {
                            returnObj[propNameArr[1]] = dynamicValue;
                        }
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
                    if (parseOptions && parseOptions.ignoreWhitespace) {
                        returnObj[propNameArr[1]] = dynamicValue.trim();
                    } else {
                        returnObj[propNameArr[1]] = dynamicValue;
                    }
                } else {
                    var pog = <PatternToObjectGenerator<TObj>> dynamicToken;
                    var stringToParse = this._stringToParse.substr(iPosOfPointer);
                    if (parseOptions && parseOptions.ignoreWhitespace) {
                        stringToParse = stringToParse.trim();
                    }
                    pog.parse(stringToParse, returnObj, parseOptions);
                    //debugger;
                }
                
                //#endregion
            }
            return returnObj;
        }
    }

    export function compile<TObj>(strings : string[], ...values : string[]): PatternToObjectGenerator<TObj> {
        return new PatternToObjectGenerator<TObj>(strings, values);
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
                if (parseOptions && parseOptions.ignoreWhitespace) {
                    this.posOfHead = value.indexOf(normalizeString(stringSeq[0]));
                } else {
                    this.posOfHead = value.indexOf(stringSeq[0]);
                }
            }
            if (this.posOfHead > -1) {
                var restOfString = value.substr(this.posOfHead + stringSeq[0].length);
                this.tail = new StringMatch(_.tail(stringSeq), restOfString, parseOptions);
            }
        }
        next(): number{
            if (this.posOfHead === -1) return -1;
            var nextTest = this.tail.next();
            if (nextTest > -1) return this.posOfHead;
            this.posOfHead = this.value.indexOf(this.stringSeq[0], this.posOfHead + this.stringSeq[0].length);
            if (this.posOfHead > -1) {
                var restOfString = this.value.substr(this.posOfHead + this.stringSeq[0].length);
                this.tail = new StringMatch(_.tail(this.stringSeq), restOfString, this.parseOptions);
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