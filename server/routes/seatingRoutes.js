const express = require('express');
const router = express.Router();
const seatingController = require('../controllers/seatingController');

router.post('/generate', seatingController.generateSeating);
router.get('/', seatingController.getSeatingPlans);
router.get('/:id', seatingController.getSeatingPlanById);
router.delete('/:id', seatingController.deleteSeatingPlan);
router.get('/:id/export-csv', seatingController.exportCSV);

module.exports = router;
