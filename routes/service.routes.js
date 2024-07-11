const express = require('express');
const router = express.Router();

const serviceController = require('../controllers/service.controller');

// Create
router.post("/", serviceController.createService);

// Find all
router.get("/", serviceController.getServices);

// Find One
router.get("/:id", serviceController.getServiceById);

// Update One
router.put("/:id", serviceController.updateService);

// Delete One
router.delete("/:id", serviceController.deleteService);

module.exports = router;
