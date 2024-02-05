function ejemplo1(){
    let pila = []

    pila.push(2)
    pila.push(3)
    pila.push(4)
    pila.push(5)

    console.log(pila)

    console.log(pila.pop())

    console.log(pila.pop())

    console.log(pila.pop())

    console.log(pila.pop())
} 

class Pila {
    constructor() {
      this.pila = [];
    }
  
    /*push(elemento) {
      this.pila.push(elemento);
    }
  
    pop() {
      return this.pila.pop();
    }*/
  
    top() {
      return this.pila[this.pila.length - 1];
    }
  
    muestra() {
      console.log(this.pila);
    }
  }



class Lexico {
    constructor(entrada) {
        
        this.index = 0
        this.simbolo = entrada[this.index];
        this.tipo = this.obtenerTipoSimbolo(this.simbolo);
    }
  
    sigSimbolo() {
      return this.simbolo[++index]
    }
  
    obtenerTipoSimbolo(char) {
      // Identificadores
        if ( (char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91) || (char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123)) {
            return 0;
        }
        //a
        if(char == '+' || char == '-'){
            return 1;
        }
        
    }
  }
  
function ejercicio1(){
    const tablaLR=[
        //   id    +    $     E
            'd2', ''  , ''  ,'1',
            ''  , ''  , 'r0','' ,
            ''  , 'd3', ''  ,'' ,
            'd4', ''  , ''  ,'' ,
            ''  , ''  ,'r1' ,'' ,
        ]
    
    fila = pila.top(); // 0
    columna = lexico.tipo; // Obtener el tipo del primer símbolo 'a'
    accion = tablaLR[fila][columna]; // 'd2'
    
    pila.push(lexico.tipo); // Tipo de 'a' (id)
    pila.push(2); // Estado '2' según la acción 'd2'
    lexico.sigSimbolo(); // Avanzamos al siguiente símbolo
    
    // Nueva configuración:
    // Pila: ['$', 0, 'id', 2]
    // Entrada: 'b'

    fila = pila.top(); // 2
    columna = lexico.tipo; // Obtener el tipo del siguiente símbolo 'b'
    accion = tablaLR[fila][columna]; // 'r0'

    // Realizar reducción según 'r0' implica sacar 4 elementos de la pila
    for (let i = 0; i < 4; i++) {
    pila.pop();
    }

    // Calcular la transición después de la reducción
    fila = pila.top(); // 0
    columna = 2; // No terminal 'E'
    accion = tablaLR[fila][columna]; // 'd3'

    // Realizar la transición
    pila.push(2); // No terminal 'E'
    pila.push(accion); // Nuevo estado según la acción 'd3'
    lexico.sigSimbolo(); // Avanzamos al siguiente símbolo

    // Nueva configuración:
    // Pila: ['$', 0, 'E', 3]
    // Entrada: 'b'

    fila = pila.top(); // 3
    columna = lexico.tipo; // Obtener el tipo del siguiente símbolo 'b'
    accion = tablaLR[fila][columna]; // 'd4'

    pila.push(lexico.tipo); // Tipo de 'b' (id)
    pila.push(4); // Nuevo estado según la acción 'd4'
    lexico.sigSimbolo(); // Avanzamos al siguiente símbolo

    // Nueva configuración:
    // Pila: ['$', 0, 'E', 3, 'id', 4]
    // Entrada: ''

    fila = pila.top(); // 4
    columna = lexico.tipo; // Obtener el tipo del siguiente símbolo (nulo en este punto)
    accion = tablaLR[fila][columna]; // ''

    //  estado de aceptación.
    aceptacion = accion == -1;
    if (aceptacion) console.log("aceptación");

}

function ejercicio2(){
    const tablaLR=[
        //   id    +    $     E
            'd2', ''  , ''  ,'1',
            ''  , ''  , 'r0','' ,
            ''  , 'd3', 'r2','' ,
            'd2', ''  , ''  ,'4',
            ''  , ''  ,'r1' ,'' ,
        ]
        while (true) {
            fila = pila.top();
            columna = lexico.tipo;
            accion = tablaLR[fila][columna];
        
            if (accion > 0) {
                // Desplazamiento
                pila.push(lexico.tipo);
                pila.push(accion);
                lexico.sigSimbolo();
            } else if (accion < 0) {
                // Reducción
                var regla = -accion - 1;  // Convertir a número positivo y ajustar a índice de arreglo
                var idNoTerminal = idReglas[regla];
                var longitud = lonReglas[regla];
        
                // Realizar la reducción eliminando elementos de la pila
                for ( i = 0; i < 2 * longitud; i++) {
                    pila.pop();
                }
        
                // Calcular la transición 
                fila = pila.top();
                columna = idNoTerminal;
                accion = tablaLR[fila][columna];
        
                // Realizar la transición
                pila.push(idNoTerminal);
                pila.push(accion);
            } else {
                // Entrada inválida, romper el ciclo
                break;
            }
        
            // estado actual 
            pila.muestra();
            cout << "entrada: " << lexico.simbolo << endl;
            cout << "accion: " << accion << endl;
        }
        
        if (aceptacion) {
            cout << "Aceptación" << endl;
        } else {
            cout << "Entrada inválida" << endl;
        }
        
}
/*
class TipoSimbolo{
    public:
     static const int ERROR= -1;       
     static const int IDENTIFICADOR= 0;
     static const int OPADIC= 1;
     static const int OPMULT= 2;
     static const int PESOS= 1;       
     static const int ENTERO= 4;
    };
    
    
    class Lexico{
          private:
           string fuente;
                  
           int ind;       
           bool continua;
           char c;
           int estado;
    
           char sigCaracter();       
           void sigEstado(int estado);
           void aceptacion(int estado);
           bool esLetra(char c);
           bool esDigito(char c);
           bool esEspacio(char c);
           void retroceso();
           
           bool esSimboloFinalCadena(char c);
                  
          public:
           string simbolo;
           int tipo;
                 
           Lexico(string fuente);             
           Lexico();
           
           void entrada(string fuente);              
           string tipoAcad(int tipo);
    
           int sigSimbolo();
           bool terminado();
           
    };*/