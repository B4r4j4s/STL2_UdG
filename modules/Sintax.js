const fs = require('fs');

class ElementoPila{
  constructor(){
    this.elemento; 
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



class AnalizadorLR1 {
  constructor(simbolos) {
    this.pila = [0];
    this.estadoActual = null;
    this.simboloEntrada = null;
    this.simbolos = simbolos;
    this.reglas = []
    this.matrizLR1 = []; 
    this.procesarArchivoLR1('../data/compilador.lr');
  }

  procesarArchivoLR1(rutaArchivo) {
    fs.readFile(rutaArchivo, 'utf8', (err, data) => {
      if (err) {
        console.error(`Error al leer el archivo: ${err}`);
        return;
      }
  
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
  
      
      console.log('Reglas procesadas');
      console.log('Matriz LR1');
    });
  }

  iteracion(token) {
    this.simboloEntrada = token.type//this.obtenerTipoSimbolo(token.type);
    this.estadoActual = this.pila[this.pila.length - 1];


    let accion = this.obtenerAccion();

    // Realizar acción
    if (accion.tipo === 'desplazamiento') {
      this.pila.push(accion.num);
    } else if (accion.tipo === 'reduccion') {
      // Realizar reducción
      // ...
    } else if (accion.tipo === 'aceptacion') {
      console.log('Cadena aceptada');
    } else {
      console.error('Error de análisis');
    }
  }

  obtenerAccion() {
    const estado = this.estadoActual;
    const simbolo = this.simboloEntrada;

    const numero = this.matrizLR1[estado][simbolo];
    if (numero > 0) {
      return {num: String(simbolo.type) + numero , tipo: 'desplazamiento'};
    } else if(numero < 0) {

      for(n in this.reglas){
        if(reglas[0] == estado && reglas[1] == simbolo.type){

        }
      }
      return {
        num: String(parseInt(estado) +  parseInt(numero)),
        tipo: 'reduccion',
        regla: n[2]
                };
    }
    else if (this.estadoActua + num == 0 ){
      return{tipo: 'aceptacion'}
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

const analizador = new AnalizadorLR1(simbolos);




// Exportar la clase
//export default AnalizadorLR1;