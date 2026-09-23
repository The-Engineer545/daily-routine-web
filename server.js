const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Headers de seguridad básicos
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
});

// Sirve archivos estáticos de la carpeta public
app.use(express.static(path.join(__dirname, 'public'), { extensions: ['html'] }));

// 404 para rutas no encontradas
app.use((req, res) => {
    res.status(404).send(`
        <!DOCTYPE html>
        <html lang="es">
        <head><meta charset="UTF-8"><title>404 - Daily Routine</title>
        <style>body{font-family:'Lexend',sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#f1f5f9;margin:0}
        .box{text-align:center}.emoji{font-size:5rem;margin-bottom:1rem}h1{color:#334155;font-size:2rem}p{color:#94a3b8}
        a{display:inline-block;margin-top:1.5rem;padding:.75rem 2rem;background:#1CB0F6;color:#fff;border-radius:1rem;text-decoration:none;font-weight:700}</style></head>
        <body><div class="box"><div class="emoji">🔍</div><h1>Página no encontrada</h1><p>La ruta que buscas no existe.</p><a href="/">Volver al inicio</a></div></body>
        </html>
    `);
});

// Manejo de errores no capturados
process.on('uncaughtException', (err) => {
    console.error('Error no capturado:', err);
});

process.on('unhandledRejection', (reason) => {
    console.error('Promesa rechazada sin manejar:', reason);
});

app.listen(port, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${port}`);
});
