 
const sintax = require('./Sintax.js');


const simbolos = [
    'identificador', // 0
    'entero', // 1
    'real', // 2
    'cadena', // 3
    'tipo',  // 4
    'opSuma', //5
    'opMul', //6
    'opRelac', //7
    'opOr', //8
    'opAnd', //9
    'opNot', //10
    'opIgualdad', //11
    ';', //12
    ',', //13
    '(', //14
    ')', //15
    '{', //16
    '}', //17
    '=', //18
    'if', //19
    'while', //20
    'return', //21
    'else', //22
    '$' //23
  ];

function lexer(input) {
    const tokens = [];
    //const regexIdentifier = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
    //const regexNumber = /^[0-9]+$/;
    //const regexSpace = /\s/;

    let linetracker = 0;
    var ParentesisFlag = 0;
    var LlavesFlag = 0;
    let index = 0;
    let char = '';
    while (index < input.length) {
        char = input[index];
        

        // Ignorar espacios en blanco
        if (char == ' ' || char == '\t') {
            index++;
            continue;
        }
        // Contar los saltos de linea
        if (char == '\n') {
            index++;
            linetracker++;
            continue;
        }
        // Identificadores
        if ( (char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91) || (char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123)) {
            let word = '';
            while (char && ((char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91) || (char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123) || (char.charCodeAt(0) > 47 && char.charCodeAt(0) < 58))) {
                word += char;
                char = input[++index];
            }
            if(word == 'if'){
                tokens.push({ type: 19, value: word, symbol: simbolos[19]});
                continue;
            }else if(word == 'while'){
                tokens.push({ type: 20, value: word, symbol: simbolos[20] });
                continue;
            }else if(word == 'return'){
                tokens.push({ type: 21, value: word,  symbol: simbolos[21] });
                continue;
            }else if(word == 'else'){
                //marcar error si no hay if antes
                tokens.push({ type: 22, value: word, symbol: simbolos[22] });
                continue;
            }else if(word == 'int'){
                //marcar error si no hay if antes
                tokens.push({ type: 4, value: word, symbol: simbolos[4] });
                continue;
            }else if(word == 'void'){
                //marcar error si no hay if antes
                tokens.push({ type: 4, value: word, symbol: simbolos[4] });
                continue;
            }else if(word == 'float'){
                //marcar error si no hay if antes
                tokens.push({ type: 4, value: word, symbol: simbolos[4] });
                continue;
            }

            tokens.push({ type: 0, value: word, symbol: simbolos[0] });
            continue;
        }
        // Cadena
        if(char == "\""){
            let word = input[index++];
            while( input[index] != ("\"" || "\n") ){
                word += input[index++];
            }if(input[index] == "\"") {
                tokens.push({ type: 3, value: word + input[index++], symbol: simbolos[3] });
                continue;
            }else{
                console.log('error de lexico')
            }
            
        }
        // Numero Flotante y Entero
        if (char.charCodeAt(0) > 47 && char.charCodeAt(0) < 58) {
            //let wordStart = index;
            let number = '';
            while (!isNaN(input[index])) {
                number += input[index++];
            }
            if(input[index] == '.'){
                number += input[index++];
                if(!isNaN(input[index])){
                    while (!isNaN(input[index])) {
                        number += input[index++];       
                    }
                    tokens.push({ type: 2, value: number, symbol: simbolos[2] });   
                    continue; 
                }else{
                    //tokens.push({ type: 'Error', value: number});
                    printError("Error in line " + linetracker + ": '" + number +"'.");
                    continue
                }

            }
            tokens.push({ type: 1, value: number, symbol: simbolos[1] });
            continue;
        }
        // operador + | -
        if(char == '+' || char == '-'){
            tokens.push({ type: 5, value: char, symbol: simbolos[5] });
            index++;
            continue;
        }
        // operador * | /
        if(char == '*' || char == '/'){
            tokens.push({ type: 6, value: char, symbol: simbolos[6] });
            index++;
            continue;
        }
        // asignacion
        if(char == '='){
            if(input[index + 1] == '='){
                tokens.push({ type: 11, value: char +  input[++index], symbol: simbolos[11] });
                index++;
                continue;
            }
            tokens.push({ type: 18, value: char });
            index++;
            continue;
        }
        // Relacional
        if(char == '<' || char == '>'){
            let rel = char;
            if(input[index + 1] == '='){
                rel += input[++index];
            }
            tokens.push({ type: 7, value: rel, symbol: simbolos[7] });
            index++;
            continue;
        }
        if(char == '!' ){
            if(input[index + 1] == '='){
                tokens.push({ type: 11, value: char + input[++index], symbol: simbolos[11] });
                index++;
                continue;
            }
            tokens.push({ type: 10, value: char});
            index++;
            continue;
        }
        // And
        if(char + input[index + 1] == '&&'){
            tokens.push({ type: 9, value: char + input[++index], symbol: simbolos[9]});
            index++;
            continue;
        }
        // Or
        if(char == '|' && input[index + 1] == '|'){
            tokens.push({ type: 8, value: char + input[++index], symbol: simbolos[8] });
            index++;
            continue;
        }
        // Punto y coma
        if(char == ';'){
            tokens.push({ type: 12, value: char, symbol: simbolos[12] });
            index++;
            continue;
        }
        //Parentesis
        if(char == '('){
            ParentesisFlag++;
            tokens.push({ type: 14, value: char, symbol: simbolos[14] });
            index++;
            continue;
        }
        if(char == ')'){
            ParentesisFlag--;
            tokens.push({ type: 15, value: char, symbol: simbolos[15] });
            index++;
            continue;
        }
        //Llaves
        if(char == '{'){
            LlavesFlag++;
            tokens.push({ type: 16, value: char, symbol: simbolos[16] });
            index++;
            continue;
        }
        if(char == '}'){
            LlavesFlag--;
            tokens.push({ type: 17, value: char, symbol: simbolos[17] });
            index++;
            continue;
        }
        //Simbolo de varo
        if(char == '$'){
            tokens.push({ type: 23, value: char, symbol: simbolos[23] });
            index++;
            continue;
        }

        index++;
    }

    return tokens;
}

/*module.exports = {
    lexer,
    simbolos,
  };*/

  async function procesarTokens(tokens) {
    for (var token of tokens) {
        var error = sintax.iteracion(token);
        if (error){break}
    }
    console.log(sintax.pila)
}



async function InitProgramo() {
    await sintax.procesarArchivoLR1();
    
    console.log(sintax.reglas)
    const tokens = lexer('int var1 = 12;');

   // await procesarTokens(tokens);

}

InitProgramo();



