class Calculator {
    add(a, b) {
      this.validate(a, b);
      return a + b;
    }
  
    subtract(a, b) {
      this.validat(a, b);
      return a - b;
    }
  
    validate(a, b) {
      if (typeof a !== 'number' || typeof b !== 'number') {
        throw new Error('Los dos parametros deben ser numericos');
      }
    }
  }
  
  // Uso de la calculadora
  const calculator = new Calculator();
  
  // Uso correcto
  const result1 = calculator.add(5, 10);
  console.log('Resultado de la suma:', result1);
  
  const result2 = calculator.subtract(10, 3);
  console.log('Resultado de la resta:', result2);
  
  // Intentando usar valores no numéricos
  calculator.add('5', 10); // Esto lanzará una excepción Error()
  