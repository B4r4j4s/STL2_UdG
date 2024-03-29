
const simbolos = [
    'identificador',
    'entero',
    'real',
    'cadena',
    'tipo', // int, float, void
    'opSuma', // +, -
    'opMul', // *, /
    'opRelac', // <, <=, >, >=
    'opOr', // ||
    'opAnd', // &&
    'opNot', // !
    'opIgualdad', // ==, !=
    ';',
    ',',
    '(',
    ')',
    '{',
    '}',
    '=',
    'if',
    'while',
    'return',
    'else',
    '$'
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
                tokens.push({ type: 19, value: word });
                continue;
            }else if(word == 'while'){
                tokens.push({ type: 20, value: word });
                continue;
            }else if(word == 'return'){
                tokens.push({ type: 21, value: word });
                continue;
            }else if(word == 'else'){
                //marcar error si no hay if antes
                tokens.push({ type: 22, value: word });
                continue;
            }

            tokens.push({ type: 0, value: word });
            continue;
        }

        // Cadena
        if(char == "\""){
            let word = input[index++];
            while( input[index] != ("\"" || "\n") ){
                word += input[index++];
            }if(input[index] == "\"") {
                tokens.push({ type: 3, value: word + input[index++] });
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
                    tokens.push({ type: 2, value: number });   
                    continue; 
                }else{
                    //tokens.push({ type: 'Error', value: number});
                    printError("Error in line " + linetracker + ": '" + number +"'.");
                    continue
                }

            }
            tokens.push({ type: 1, value: number });
            continue;
        }

        // operador + | -
        if(char == '+' || char == '-'){
            tokens.push({ type: 5, value: char });
            index++;
            continue;
        }

        // operador * | /
        if(char == '*' || char == '/'){
            tokens.push({ type: 6, value: char });
            index++;
            continue;
        }

        // asignacion
        if(char == '='){
            if(input[index + 1] == '='){
                tokens.push({ type: 11, value: char +  input[++index]});
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
            tokens.push({ type: 7, value: rel });
            index++;
            continue;
        }
        if(char == '!' ){
            if(input[index + 1] == '='){
                tokens.push({ type: 11, value: char + input[++index]});
                index++;
                continue;
            }
            tokens.push({ type: 10, value: char});
            index++;
            continue;
        }

        // And
        if(char + input[index + 1] == '&&'){
            tokens.push({ type: 9, value: char + input[++index]});
            index++;
            continue;
        }

        // Or
        if(char == '|' && input[index + 1] == '|'){
            tokens.push({ type: 8, value: char + input[++index]});
            index++;
            continue;
        }

        // Punto y coma
        if(char == ';'){
            tokens.push({ type: 12, value: char });
            index++;
            continue;
        }

        //Parentesis
        if(char == '('){
            ParentesisFlag++;
            tokens.push({ type: 14, value: char });
            index++;
            continue;
        }
        if(char == ')'){
            ParentesisFlag--;
            tokens.push({ type: 15, value: char });
            index++;
            continue;
        }

        //Llaves
        if(char == '{'){
            LlavesFlag++;
            tokens.push({ type: 16, value: char });
            index++;
            continue;
        }
        if(char == '}'){
            LlavesFlag--;
            tokens.push({ type: 17, value: char });
            index++;
            continue;
        }

        //Llaves
        if(char == '$'){
            tokens.push({ type: 23, value: char });
            index++;
            continue;
        }

        index++;
    }

    return tokens;
}

function printError(message) {
    console.log("%c" + message, "color: red");
}


function execution(userInput) {
    console.log(userInput);
    
    console.log(tokens);
}

function actualizarTabla(tokens){
    var tbody = document.getElementById('TablaBody');
    //console.log(tokens.length)
    // Vaciar el contenido del tbody
    tbody.innerHTML = '';
    var indice = 1;
    for (var token in tokens) {
        console.log(token);
        if (tokens.hasOwnProperty(token)) {
            // Crea una fila
            var fila = tbody.insertRow();

            // Crea celdas y asigna valores
            var celdaNumero = fila.insertCell(0);
            var celdaToken = fila.insertCell(1);
            var celdaTipo = fila.insertCell(2)
            var celdaValor = fila.insertCell(3);

            // Asigna valores a las celdas
            celdaNumero.textContent = indice++;
            celdaToken.textContent = simbolos[tokens[token]['type']];
            celdaTipo.textContent = tokens[token]['type'];
            celdaValor.textContent = tokens[token]['value'];
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // Obtén referencias a los elementos HTML
    var textarea = document.getElementById('codigo');
    var btnCompilar = document.getElementById('btnCompilar');
    // Evento click al botón
    btnCompilar.addEventListener('click', function () {
        var codigoF = textarea.value;
        var tokens = lexer(codigoF);
        console.log(tokens);
        actualizarTabla(tokens);

    });
});


