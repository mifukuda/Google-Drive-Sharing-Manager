// import { stringify } from "querystring"

let regexp = /(-?\(*(?:(?:drive|owner|creator|from|to|readable|writable|sharable|name|inFolder|folder|path|sharing):(?:(?:["][^"]+["])|(?:(?:['z][^']+[']))|\S+))\)*|(?:or|and))/g 

const conjunctions = ["or", "and"];
const keywords = ["drive", "owner", "creator", "from", "to", "readable", "writable", "sharable", 
                    "name", "inFolder", "folder", "path", "sharing"];

export const parseQuery = (queryString : string) => {
    
    let tokens = queryString.split(regexp)
    if(tokens.reduce((length, token) => token.length + length, 0) != queryString.length){
        //ill-formed query string
    }

    // remove the whitespace tokens
    tokens = tokens.filter((token) => {return token.replace(/\s/g, '').length})
    for(let i = 1; i < tokens.length; i += 2){
        if(!conjunctions.includes(tokens[i])){
            // ill-formed query string because all the conjunctions are not between two queries
        }
    }   
    
    // tokenize parentheses
    for(let i = 0; i < tokens.length; i++){
        let parens: string[] = []
        while(tokens[i].charAt(0) == '(' && tokens[i].length > 1){
            parens.push('(')
            tokens[i] = tokens[i].substring(1)
        }
        if(i == 0){
            tokens = parens.concat(tokens)
        }else{
            tokens.splice(i, 0, ...parens)
        }
        parens = []
        while(tokens[i].charAt(tokens[i].length - 1) == ')' && tokens[i].length > 1){
            parens.push(')')
            tokens[i] = tokens[i].substring(0,tokens[i].length - 1)
        }
        if(i == tokens.length - 1){
            tokens = tokens.concat(parens)
        }else{
            tokens.splice(i + 1, 0, ...parens)
        }
    }
    
    return tokens
}