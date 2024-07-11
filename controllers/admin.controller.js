const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const Admin = require("../models/admin.model");
const { sendConfirmationEmail, sendPasswordToken } = require("../config/email.config");
const PasswordToken = require("../models/passwordToken.model");
const { generateTempToken } = require("../util/generateToken");

const secretKey = process.env.JWT_SECRET_KEY;

/* Controladores Basicos CRUD */
module.exports.createAdmin = async (req, res) => {
    try {
        const newAdmin = await Admin.create(req.body);
        const emailResponse = await sendConfirmationEmail(req.body);
        console.log(emailResponse);
        res.status(200);
        res.json(newAdmin);
    } catch (error) {
        res.status(500);
        res.json(error);
    }
};

module.exports.findAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find();
        res.status(200);
        res.json(admins);
    } catch (error) {
        res.status(500);
        res.json({ error: error });
    }
};

module.exports.findAdmin = async (req, res) => {
    try {
        const admin = await Admin.findOne({ _id: req.params.id });
        if (admin) {
            res.status(200);
            res.json(admin);
            return;
        }
        res.status(404);
        res.json({ error: "Admin not found" });
    } catch (error) {
        res.status(500);
        res.json({ error: error });
    }
};

module.exports.updateAdmin = async (req, res) => {
    try {
        const updatedAdmin = await Admin.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true });
        res.status(200);
        res.json(updatedAdmin);
    } catch (error) {
        res.status(500);
        res.json(error);
    }
};

module.exports.deleteAdmin = async (req, res) => {
    try {
        const deletedAdmin = await Admin.deleteOne({ _id: req.params.id });
        res.status(200);
        res.json(deletedAdmin);
    } catch (error) {
        res.status(500);
        res.json({ error: error });
    }
};

/* METODOS DE SESSION */

module.exports.loginAdmin = async (req, res) => {
    try {
        /* Buscar el administrador */
        const admin = await Admin.findOne({ email: req.body.email });
        /* Si no existe, finaliza y retorna resultado */
        if (!admin) {
            res.status(404);
            res.json({
                errors: {
                    email: {
                        message: "Admin not found"
                    }
                }
            });
            return;
        }
        /* Si existe, revisamos contraseñas */
        const validatePassword = await bcrypt.compare(req.body.password, admin.password);
        /* Si la contraseña no coincide, finaliza y retorna resultado */
        if (!validatePassword) {
            res.status(400);
            res.json({
                errors: {
                    password: {
                        message: "Wrong Password"
                    }
                }
            });
            return;
        }
        /* Si la contraseña es correcta, generar token JWT y establecer cookie */
        const newJWT = jwt.sign({
            _id: admin._id,
            level: admin.level
        }, secretKey, { expiresIn: '10m' });

        res.cookie("adminToken", newJWT, { httpOnly: true });
        res.status(200);
        res.json({ msg: "logged in successfully" });
    } catch (error) {
        res.status(500);
        res.json({
            errors: {
                server: {
                    message: error
                }
            }
        });
    }
};

module.exports.logoutAdmin = async (req, res) => {
    try {
        res.clearCookie('adminToken');
        res.status(200);
        res.json({ msg: 'Logout successful.' });
    } catch (error) {
        res.status(500);
        res.json({
            errors: {
                server: {
                    message: error
                }
            }
        });
    }
};

/* RESET PASSWORD */

module.exports.passwordResetTokenAdmin = async (req, res) => {
    const { email } = req.query;
    console.log(email);
    try {
        /* Buscamos si existe un administrador con el email proporcionado */
        const admin = await Admin.findOne({ email: email });
        if (!admin) {
            res.status(404);
            res.json({ error: "Admin not found" });
            return;
        }
        /* Buscamos si ese administrador ya tiene un token */
        const token = await PasswordToken.findOne({ user: admin._id });
        /* Si existe un token, lo eliminamos */
        if (token) {
            await PasswordToken.deleteOne({ _id: token._id });
        }
        /* Generamos un nuevo token */
        const rawToken = generateTempToken(6);
        const newToken = await PasswordToken.create({ token: rawToken, user: admin._id, valid: true });
        /* Enviamos el token por correo electrónico */
        const emailToken = await sendPasswordToken({ admin: admin, token: rawToken });
        res.status(200);
        res.json(newToken);
    } catch (error) {
        res.status(500);
        res.json({
            errors: {
                server: {
                    message: error
                }
            }
        });
    }
}

module.exports.passwordResetAdmin = async (req, res) => {
    const { email, password, confirmPassword, token } = req.body;
    const data = {
        password, confirmPassword
    }
    console.log(email, password, confirmPassword, token);
    try {
        /* Buscamos el administrador por email */
        const admin = await Admin.findOne({ email: email });
        /* Si no existe, finalizamos */
        if (!admin) {
            res.status(404);
            res.json({ error: "Admin not found" });
            return;
        }
        /* Buscamos si el administrador tiene un token activo */
        const activeToken = await PasswordToken.findOne({ user: admin._id });
        /* Si no hay token o el token ya no es válido, finalizamos */
        if (!activeToken || !activeToken.valid) {
            res.status(401);
            res.json({ error: "Token Expired" });
            return;
        }
        /* Validamos el token ingresado con el hash de la base de datos */
        const validate = await bcrypt.compare(token, activeToken.token);
        /* Si no concuerdan, finalizamos */
        if (!validate) {
            res.status(401);
            res.json({ error: "Invalid Token" });
            return;
        }
        /* Encriptamos la nueva contraseña */
        const hashedPassword = await bcrypt.hash(password, 10);
        /* Actualizamos la contraseña del administrador */
        const adminPatch = await Admin.findOneAndUpdate(
            { email: email }, 
            { password: hashedPassword }, 
            { new: true, runValidators: true }
        );
        /* Invalidamos el token */
        const tokenPatch = await PasswordToken.findOneAndUpdate({ user: admin._id }, { valid: false }, { new: true, runValidators: true });
        console.log(tokenPatch);
        res.status(200);
        res.json(adminPatch);
    } catch (error) {
        res.status(500);
        res.json({
            errors: {
                server: {
                    message: error
                }
            }
        });
    }
}
