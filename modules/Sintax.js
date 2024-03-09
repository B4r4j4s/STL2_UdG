const fs = require('fs');
const csv = require('csv-parser');

const results = [];

const tokens = {

}

fs.createReadStream('../data/reglas.csv')
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    console.log(results);
    // Aquí puedes trabajar con los datos del CSV
  });
  // Supongamos que results es un array de objetos con información sobre conjuntos de ítems LR(1)

// Implementación simplificada del analizador LR(1)
function analizadorLR1(cadena) {
  let pila = [0];
  let entrada = cadena.split(' '); 

  while (true) {
    let estadoActual = pila[pila.length - 1];
    let simboloEntrada = entrada[0];

    
    let accion = obtenerAccion(estadoActual, simboloEntrada);

    // Realizar acción
    if (accion.tipo === 'desplazar') {
      pila.push(accion.valor);
      entrada.shift();
    } else if (accion.tipo === 'reducir') {
      // Realizar reducción
      // ...
    } else if (accion.tipo === 'aceptar') {
      console.log('Cadena aceptada');
      break;
    } else {
      console.error('Error de análisis');
      break;
    }
  }
}

// Función para obtener acción desde la tabla LR(1)
function obtenerAccion(estado, simbolo) {
  // Implementar lógica para obtener la acción desde la tabla LR(1)
  // Puede ser una acción de desplazar, reducir o aceptar
  // ...
}


  /*module.exports = {
    results
  };*/