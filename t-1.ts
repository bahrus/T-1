///<reference path='Scripts/typings/lodash/lodash.d.ts'/>
module t_1{

    export interface IParseOptions {
        ignoreCase?: boolean;
        ignoreWhitespace?: boolean;
    }

    export interface IPatternToObjectGenerator<TObj> {
        parse: (s: string, parseOptions?: IParseOptions) => TObj | TObj[];
    }

    

    export class PatternToObjectGenerator<TObj> implements IPatternToObjectGenerator<TObj>{
        private _stringMatcher: StringMatch;
        private _stringToParse: string;
        constructor(public strings: string[], public values: string[]) {

        }
        public parse(s: string, parseOptions?: IParseOptions) : TObj {
            this._stringMatcher = new StringMatch(this.strings, s);
            this._stringToParse = s;
            return this.process();
        }
        private process(): TObj {
            var iPosOfPointer = 0;
            var sequenceOfPositionsOfStaticsInStringToParse = this._stringMatcher.posSequence();
            var genericObj = {};
            var returnObj = <TObj> genericObj;
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
                    } else {
                        debugger;
                    }
                    //#endregion
                } else {
                    iPosOfPointer += this.strings[i].length;
                }
            }

            if (iValCounter < this.values.length) {
                //#region there's an extra trailing dynamic token to account for
                var dynamicToken: string | PatternToObjectGenerator<TObj> =  this.values[iValCounter++];
                if (typeof dynamicToken === 'string') {
                    throw 'not Implemented';
                } else {
                    var pog = <PatternToObjectGenerator<TObj>> dynamicToken;
                    debugger;
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
        constructor(public stringSeq: string[], public value: string) {
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
        next(): number{
            if (this.posOfHead === -1) return -1;
            var nextTest = this.tail.next();
            if (nextTest > -1) return this.posOfHead;
            this.posOfHead = this.value.indexOf(this.stringSeq[0], this.posOfHead + this.stringSeq[0].length);
            if (this.posOfHead > -1) {
                var restOfString = this.value.substr(this.posOfHead + this.stringSeq[0].length);
                this.tail = new StringMatch(_.tail(this.stringSeq), restOfString);
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