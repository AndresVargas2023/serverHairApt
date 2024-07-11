require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;

require('./config/mongoose.config');

app.use(cookieParser());

app.use(
    cors({
        credentials: true,
        origin: ["http://localhost:3000"]
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

const sessionRoutes = require('./routes/session.routes');
app.use("/api/session", sessionRoutes);

const userRoutes = require('./routes/user.routes');
app.use("/api/user", userRoutes);

const adminRoutes = require('./routes/admin.routes'); // Importa las rutas de administrador
app.use("/api/admin", adminRoutes); // Usa las rutas de administrador en la ruta "/api/admin"
const serviceRoutes = require('./routes/service.routes'); 
app.use("/api/service", serviceRoutes);
const horarioRoutes = require('./routes/horario.routes'); 
app.use("/api/horario", horarioRoutes);
const citaRoutes = require('./routes/cita.routes'); 
app.use("/api/cita", citaRoutes);

app.listen(port, () => console.log(`Listening on port: ${port}`));
