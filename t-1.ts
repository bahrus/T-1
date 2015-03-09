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
        _seqOfTokens: string[];
        constructor(public strings: string[], public values: string[]) {

        }
        parse(s: string, parseOptions?: IParseOptions) {
            
            return null;
        }
    }

    export function compile<TObj>(strings : string[], ...values : string[]): IPatternToObjectGenerator<TObj> {
        return new PatternToObjectGenerator(strings, values);
    }

    class StringMatch {
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
    }
}