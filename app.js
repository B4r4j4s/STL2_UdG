const express = require("express");
const path = require("path");
const app = express()

// Sirve archivos estáticos desde el directorio actual
app.use(express.static(__dirname));

app.post('/enviar', (req, res) => {
    const cadenaRecibida = req.body.cadena;
    console.log('Cadena recibida:', cadenaRecibida);

    // Responder con un objeto JSON de confirmación
    res.json({ mensaje: 'Cadena recibida correctamente' });
});


app.get("/", (req,res)=>{
    res.sendFile(path.join(__dirname + "/index.html"));
})

// Nueva ruta para pruebas.html
app.get("/pruebas", (req, res) => {
    res.sendFile(path.join(__dirname + "/pruebas.html"));
});

app.listen(3000, ()=>{
    console.log("server running")
});