const { promisify } = require('util');
const fs = require('fs');

const readFileAsync = promisify(fs.readFile);
class ElementoPila{
  constructor(_elemento, _tipo){
    this.elemento = _elemento;
    this.type =  _tipo;
  }
  convertirATerminal() {
    return new Terminal(this.elemento);
  }

  convertirANoTerminal() {
    return new NoTerminal(this.elemento);
  }

  convertirAEstado() {
    return new Estado(this.elemento);
  }
}

class Terminal extends ElementoPila {
  constructor(elementoTerminal) {
    super(elementoTerminal);
    this.tipo = 'Terminal';
  }
}

class NoTerminal extends ElementoPila {
  constructor(elementoNoTerminal) {
    super(elementoNoTerminal);
    this.tipo = 'NoTerminal';
  }
}

class Estado extends ElementoPila {
  constructor(elementoEstado) {
    super(elementoEstado);
    this.tipo = 'Estado';
  }
}

class NodoArbol {
  constructor(simbolo, hijos = []) {
    this.simbolo = simbolo;
    this.hijos = hijos;
  }

  agregarHijo(nodoHijo) {
    this.hijos.push(nodoHijo);
  }

  imprimir() {
    return this.imprimirRecursivo(this, 0);
  }

  imprimirRecursivo(nodo, nivel) {
    let resultado = `${' '.repeat(nivel * 2)}${nodo.simbolo}\n`;

    for (const hijo of nodo.hijos) {
      resultado += this.imprimirRecursivo(hijo, nivel + 1);
    }

    return resultado;
  }
}

// Ejemplo de uso:
const raizDelArbol = new NodoArbol('NoTerminalX', [
  new NodoArbol('TerminalA'),
  new NodoArbol('NoTerminalY', [
    new NodoArbol('TerminalB'),
    new NodoArbol('TerminalC'),
  ]),
]);

function extraerNumero(cadena) {
  // Definir la expresión regular para encontrar números al final de la cadena
  const regex = /\d+$/;

  // Encontrar el número al final de la cadena usando la expresión regular
  const resultado = cadena.match(regex);

  // Verificar si se encontró un número al final de la cadena
  if (resultado) {
      // Convertir el número encontrado a entero y devolverlo
      return parseInt(resultado[0]);
  } else {
      // Devolver null si no se encontró ningún número al final de la cadena
      return null;
  }
}

const reglasInfo = [
  { regla: "R1", expresion: "<programa>", genera: "<Definiciones>" },
  { regla: "R2", expresion: "<Definiciones>", genera: "\\e" },
  { regla: "R3", expresion: "<Definiciones>", genera: "<Definicion> <Definiciones>" },
  { regla: "R4", expresion: "<Definicion>", genera: "<DefVar>" },
  { regla: "R5", expresion: "<Definicion>", genera: "<DefFunc>" },
  { regla: "R6", expresion: "<DefVar>", genera: "tipo identificador <ListaVar> ;" },
  { regla: "R7", expresion: "<ListaVar>", genera: "\\e" },
  { regla: "R8", expresion: "<ListaVar>", genera: ", identificador <ListaVar>" },
  { regla: "R9", expresion: "<DefFunc>", genera: "tipo identificador ( <Parametros> ) <BloqFunc>" },
  { regla: "R10", expresion: "<Parametros>", genera: "\\e" },
  { regla: "R11", expresion: "<Parametros>", genera: "tipo identificador <ListaParam>" },
  { regla: "R12", expresion: "<ListaParam>", genera: "\\e" },
  { regla: "R13", expresion: "<ListaParam>", genera: ", tipo identificador <ListaParam>" },
  { regla: "R14", expresion: "<BloqFunc>", genera: "{ <DefLocales> }" },
  { regla: "R15", expresion: "<DefLocales>", genera: "\\e" },
  { regla: "R16", expresion: "<DefLocales>", genera: "<DefLocal> <DefLocales>" },
  { regla: "R17", expresion: "<DefLocal>", genera: "<DefVar>" },
  { regla: "R18", expresion: "<DefLocal>", genera: "<Sentencia>" },
  { regla: "R19", expresion: "<Sentencias>", genera: "\\e" },
  { regla: "R20", expresion: "<Sentencias>", genera: "<Sentencia> <Sentencias>" },
  { regla: "R21", expresion: "<Sentencia>", genera: "identificador = <Expresion> ;" },
  { regla: "R22", expresion: "<Sentencia>", genera: "if ( <Expresion> ) <SentenciaBloque> <Otro>" },
  { regla: "R23", expresion: "<Sentencia>", genera: "while ( <Expresion> ) <Bloque>" },
  { regla: "R24", expresion: "<Sentencia>", genera: "return <ValorRegresa> ;" },
  { regla: "R25", expresion: "<Sentencia>", genera: "<LlamadaFunc> ;" },
  { regla: "R26", expresion: "<Otro>", genera: "\\e" },
  { regla: "R27", expresion: "<Otro>", genera: "else <SentenciaBloque>" },
  { regla: "R28", expresion: "<Bloque>", genera: "{ <Sentencias> }" },
  { regla: "R29", expresion: "<ValorRegresa>", genera: "\\e" },
  { regla: "R30", expresion: "<ValorRegresa>", genera: "<Expresion>" },
  { regla: "R31", expresion: "<Argumentos>", genera: "\\e" },
  { regla: "R32", expresion: "<Argumentos>", genera: "<Expresion> <ListaArgumentos>" },
  { regla: "R33", expresion: "<ListaArgumentos>", genera: "\\e" },
  { regla: "R34", expresion: "<ListaArgumentos>", genera: ", <Expresion> <ListaArgumentos>" },
  { regla: "R35", expresion: "<Termino>", genera: "<LlamadaFunc>" },
  { regla: "R36", expresion: "<Termino>", genera: "identificador" },
  { regla: "R37", expresion: "<Termino>", genera: "entero" },
  { regla: "R38", expresion: "<Termino>", genera: "real" },
  { regla: "R39", expresion: "<Termino>", genera: "cadena" },
  { regla: "R40", expresion: "<LlamadaFunc>", genera: "identificador ( <Argumentos> )" },
  { regla: "R41", expresion: "<SentenciaBloque>", genera: "<Sentencia>" },
  { regla: "R42", expresion: "<SentenciaBloque>", genera: "<Bloque>" },
  { regla: "R43", expresion: "<Expresion>", genera: "( <Expresion> )" },
  { regla: "R44", expresion: "<Expresion>", genera: "opSuma <Expresion>" },
  { regla: "R45", expresion: "<Expresion>", genera: "opNot <Expresion>" },
  { regla: "R46", expresion: "<Expresion>", genera: "<Expresion> opMul <Expresion>" },
  { regla: "R47", expresion: "<Expresion>", genera: "<Expresion> opSuma <Expresion>" },
  { regla: "R48", expresion: "<Expresion>", genera: "<Expresion> opRelac <Expresion>" },
  { regla: "R49", expresion: "<Expresion>", genera: "<Expresion> opIgualdad <Expresion>" },
  { regla: "R50", expresion: "<Expresion>", genera: "<Expresion> opAnd <Expresion>" },
  { regla: "R51", expresion: "<Expresion>", genera: "<Expresion> opOr <Expresion>" },
  { regla: "R52", expresion: "<Expresion>", genera: "<Termino>" },
  
  
]
class AnalizadorLR1 {
  constructor(simbolos) {
    this.pila = [];
    this.pila.push(new ElementoPila('$0','TOPE'))
    this.estadoActual = 0;
    this.simboloEntrada = 0;
    //this.simbolos = simbolos;
    this.info = reglasInfo;
    this.reglas = []
    this.matrizLR1 = []; 
    //this.procesarArchivoLR1();
    
  }

  async procesarArchivoLR1() {
    try {
        // Leer el archivo de forma asíncrona y esperar a que se complete
        const data = await readFileAsync('../data/compilador.lr', 'utf8');

        // Separar las líneas del archivo
        const lineas = data.trim().split('\n');
        const numReglas = parseInt(lineas[0]);

        // Procesar reglas
        for (let i = 1; i < numReglas + 1 && i < lineas.length; i++) {
            const palabras = lineas[i].split(/\s+/);
            const vector = [palabras[0], palabras[1], palabras[2]];
            this.reglas.push(vector);
        }

        // Procesar matriz LR1
        for (let i = numReglas + 2; i < lineas.length; i++) {
            const palabras = lineas[i].split(/\s+/);
            const fila = palabras.slice(0, -1).map(palabra => palabra);
            this.matrizLR1.push(fila);
        }

        console.log('______________________________');
        console.log('Reglas procesadas | Matriz LR1');
    } catch (error) {
        console.error(`Error al leer el archivo: ${error}`);
    }
}

  iteracion(token) {
    console.log('_________________');
    console.log(token.value);
    this.simboloEntrada = token.type;
    let accion = this.obtenerAccion();

    // Realizar acción
    if (accion.tipo === 'd') {
      console.log('Desplazando');
      this.estadoActual = parseInt(accion.num);
      console.log(accion);
      this.pila.push(new ElementoPila(token.value + accion.num, 'Terminal'));
      return false;
    } else if (accion.tipo === 'r') {
      console.log('Reduciendo');
      console.log(accion);
      while(true){
        if(this.pila[this.pila.length - 1].type == 'Terminal'){
          this.pila.pop()
        }else{
          break
        }
      }
      this.pila.push(new ElementoPila('Una regla'+ accion.num, 'NoTerminal'));
      return false;
    } else if (accion.tipo === 'a') {
      console.log('Cadena aceptada');
      return false;
    } else if (accion.tipo === 'S') {
      console.log('Sin cambio de estado');
      console.log(accion);
      this.estadoActual += parseInt(accion.num);
      this.pila.push(new ElementoPila(accion.regla[2] + String(this.estadoActual)),'Terminal');
      return false;
    } else {
      console.error('Error de análisis');
      return true;
    }
  }

  obtenerAccion() {
    const estado = this.estadoActual;
    const simbolo = this.simboloEntrada;

    const numero = this.matrizLR1[estado][simbolo];
    if (numero > 0){
      return {num: numero , tipo: 'd'};
    } else if(numero < 0) {
      var regla
      for(var r of this.reglas){
        if(this.matrizLR1[r[1]][r[0]] == numero){
          regla = r;
          break
        }
      }
      return {
        num: numero,
        regla: regla,
        tipo: 'r',
                };
    }else if (numero == 0 ){
      return {tipo: 'S'};
    }
    else
    { 
      return { tipo: 'error' };
    }
  }

  obtenerTipoSimbolo(simbolo) {
    const indice = this.simbolos.indexOf(simbolo);
    return indice !== -1 ? indice : -1; // Devuelve -1 si no se encuentra el símbolo
  }
}

const simbolos = [
  'identificador', 'entero', 'real', 'cadena', 'tipo',
  'opSuma', 'opMul', 'opRelac', 'opOr', 'opAnd',
  'opNot', 'opIgualdad', ';', ',', '(', ')', '{', '}',
  '=', 'if', 'while', 'return', 'else', '$'
];

const SintaxAnalizer = new AnalizadorLR1();
module.exports = SintaxAnalizer;