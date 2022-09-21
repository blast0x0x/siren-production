const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Programme = require('../../models/Programme');
const checkObjectId = require('../../middleware/checkObjectId');

router.get('/:id',
  checkObjectId('id'),
  async ({ params: { id } }, res) => {
  try {
    const programme = await Programme.findOne({ _id: id });
    res.json(programme);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});


router.get('/', async (req, res) => {
  try {
    const programmes = await Programme.find();
    res.json(programmes);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});


router.post(
  '/',
  check('name', 'Name is required').notEmpty(),
  check('acronym', 'Acronym is required').notEmpty(),
  check('donor', 'Donor is required').notEmpty(),
  check('totalBudget', 'Total Budget is required').notEmpty(),
  check('currency', 'Currency is required').notEmpty(),
  check('startDate', 'Start Date is required').notEmpty(),
  check('duration', 'Duration is required').notEmpty(),
  check('manager', 'Programme Manager is required').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, acronym, donor, totalBudget, currency, startDate, duration, manager } = req.body;

    try {
      let programme = await Programme.findOne({ name });

      if (programme) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Programme already exists' }] });
      }

      programme = new Programme({
        name,
        acronym,
        donor,
        total_budget: totalBudget,
        currency,
        start_date: startDate,
        duration,
        manager
      });

      await programme.save();
      res.send(programme);
    } catch (err) {
      res.status(500).send('Server error');
    }
  }
);

router.post(
  '/update',
  check('name', 'Name is required').notEmpty(),
  check('acronym', 'Acronym is required').notEmpty(),
  check('donor', 'Donor is required').notEmpty(),
  check('totalBudget', 'Total Budget is required').notEmpty(),
  check('currency', 'Currency is required').notEmpty(),
  check('startDate', 'Start Date is required').notEmpty(),
  check('duration', 'Duration is required').notEmpty(),
  check('manager', 'Programme Manager is required').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id, name, acronym, donor, totalBudget, currency, startDate, duration, manager } = req.body;

    try {
      let programme = await Programme.findOne({ _id: id });

      if (!programme) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Programme not exist' }] });
      }

      programme.name = name;
      programme.acronym = acronym;
      programme.donor = donor;
      programme.total_budget = totalBudget;
      programme.currency = currency;
      programme.start_date = startDate;
      programme.duration = duration;
      programme.manager = manager;
      await programme.save();
      res.json({ programme });
    } catch (err) {
      res.status(500).send('Server error');
    }
  }
);

router.post(
  '/delete/:id',
  async (req, res) => {
    try {
      await Programme.findOneAndRemove({ _id: req.params.id });
      const programmes = await Programme.find();
      res.json(programmes);
    } catch (err) {
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
