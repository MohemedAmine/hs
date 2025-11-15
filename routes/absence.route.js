const express = require('express');
const router = express.Router();
const Absence = require('../models/absence.model');
const bodyParser = require('body-parser');
router.use(bodyParser.json());

router.get('/' ,(req, res) => {
    res.render('absenceForm')
   });
// Get all absences
router.get('/', async (req, res) => {
  try {
    const absences = await Absence.find();
    res.json(absences);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get absences by teacher ID
router.get('/:enseignantId', async (req, res) => {
  try {
    const absences = await Absence.find({ enseignantId: req.params.enseignantId });
    if (!absences.length) {
      return res.status(404).json({ message: 'No absences found for the given teacher ID.' });
    }
    res.json(absences);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new absence
router.post('/', Absence.createAbsence);

// Update an absence
router.put('/:id', async (req, res) => {
  const { date, typeSeance, tempsSeance, reason } = req.body;

  try {
    const absence = await Absence.findById(req.params.id);
    if (!absence) {
      return res.status(404).json({ message: 'Absence not found.' });
    }

    if (date) absence.date = new Date(date);
    if (typeSeance) absence.typeSeance = typeSeance;
    if (tempsSeance) absence.tempsSeance = tempsSeance;
    if (reason) absence.reason = reason;

    const updatedAbsence = await absence.save();
    res.json(updatedAbsence);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete an absence
router.delete('/:id', async (req, res) => {
  try {
    const absence = await Absence.findById(req.params.id);
    if (!absence) {
      return res.status(404).json({ message: 'Absence not found.' });
    }

    await absence.remove();
    res.json({ message: 'Absence deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
