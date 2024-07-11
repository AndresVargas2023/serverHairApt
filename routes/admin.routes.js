const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin.controller');
const { authenticate } = require('../config/jwt.config');

// /* Recuperacion Password */
// router.get("/passwordReset", adminController.passwordResetToken);
// router.patch("/passwordReset", adminController.passwordReset);

/* Rutas de session */
router.post("/login", adminController.loginAdmin); // Ruta para iniciar sesión
router.delete("/logout", adminController.logoutAdmin); // Ruta para cerrar sesión




/* Rutas Basicas del CRUD */
router.post("/register", adminController.createAdmin);
router.get("", authenticate, adminController.findAllAdmins);
router.get("/:id", authenticate, adminController.findAdmin);
router.put("/:id", authenticate, adminController.updateAdmin);
router.delete("/:id", authenticate, adminController.deleteAdmin);



module.exports = router;