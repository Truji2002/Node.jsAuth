const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const axios = require('axios'); // Para realizar llamadas HTTP al microservicio Django

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const SECRET_KEY = 'secreto123'; // Cambiar en producción

// Endpoint de Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Hacer una petición al microservicio de Django para verificar las credenciales
        const response = await axios.post('http://localhost:8000/api/login/', {
            email,
            password
        });

        if (response.status === 200) {
            // Generar el token JWT si las credenciales son válidas
            const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });
            return res.json({ token });
        }
    } catch (error) {
        return res.status(401).json({ message: 'Credenciales inválidas o usuario no encontrado' });
    }
});

app.post('/validate-token', (req, res) => {
    console.log("Headers recibidos:", req.headers);  // Log para ver TODOS los headers

    const authHeader = req.headers['authorization']; // Extrae el header Authorization

    if (!authHeader) {
        console.log("Authorization header no encontrado");
        return res.status(403).json({ message: 'Token requerido en el header Authorization' });
    }

    console.log("Authorization Header Recibido:", authHeader);

    const token = authHeader.split(' ')[1];

    if (!token) {
        console.log("Token no encontrado en el header Authorization");
        return res.status(403).json({ message: 'Formato de token inválido, debe ser Bearer <token>' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        console.log("Token decodificado correctamente:", decoded);
        return res.json({ valid: true, decoded });
    } catch (error) {
        console.log("Error al verificar token:", error.message);
        return res.status(401).json({ message: 'Token inválido', error: error.message });
    }
});


app.listen(PORT, () => {
    console.log(`Microservicio de autenticación escuchando en http://localhost:${PORT}`);
});
