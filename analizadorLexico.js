
function lexer(input) {
    const tokens = [];
    //const regexIdentifier = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
    //const regexNumber = /^[0-9]+$/;
    //const regexSpace = /\s/;

    let linetracker = 0;
    let index = 0;
    while (index < input.length) {
        let char = input[index];
        

        // Ignorar espacios en blanco
        if (char == ' ') {
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
            let identifier = '';
            while (char && ((char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91) || (char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123) || (char.charCodeAt(0) > 47 && char.charCodeAt(0) < 58))) {
                identifier += char;
                char = input[++index];
            }
            tokens.push({ type: 'Identifier', value: identifier });
            continue;
        }

        /* Número entero
        if ((char.charCodeat(0) > 47 && char.charCodeat(0) < 58)) {
            let number = '';
            while ((char.charCodeat(0) > 47 && char.charCodeat(0) < 58)) {
                number += char;
                char = input[++index];
            }
            tokens.push({ type: 'Number', value: number });
            continue;
        }*/

        // Numero Flotante y Entero
        if (char.charCodeAt(0) > 47 && char.charCodeAt(0) < 58) {
            let wordStart = index;
            let number = '';
            while (char.charCodeAt(0) > 47 && char.charCodeAt(0) < 58) {
                number += char;
                char = input[++index];
            }
            if(char.charCodeAt(0) == 46){
                number += char;
                char = input[++index];
                if(char.charCodeAt(0) > 47 && char.charCodeAt(0) < 58){
                    while (char.charCodeAt(0) > 47 && char.charCodeAt(0) < 58) {
                        number += char;
                        char = input[++index];
                    }
                }else{
                    //tokens.push({ type: 'Error', value: number});
                    printError("Error in line " + linetracker + ": '" + number +"'.");
                    continue
                }

            }
            tokens.push({ type: 'Number', value: number });
            continue;
        }
       

        index++;
    }

    return tokens;
}

function printError(message) {
    console.log("%c" + message, "color: red");
}


function execution() {
    var userInput = window.prompt("Ingrese una linea de codigo:");
    console.log(userInput);
    const tokens = lexer(userInput);
    console.log(tokens);
}

execution();