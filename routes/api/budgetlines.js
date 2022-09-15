const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const BudgetLine = require('../../models/BudgetLine');
const checkObjectId = require('../../middleware/checkObjectId');

router.get('/:id',
  checkObjectId('id'),
  async ({ params: { id } }, res) => {
  try {
    const budgetline = await BudgetLine.findOne({ _id: id });
    res.json(budgetline);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


router.get('/', async (req, res) => {
  try {
    const budgetlines = await BudgetLine.find();
    res.json(budgetlines);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


router.post(
  '/',
  check('programme', 'Programme is required').notEmpty(),
  check('name', 'Name is required').notEmpty(),
  check('currency', 'Currency is required').notEmpty(),
  check('initialAmount', 'Initial Amount is required').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { programme, name, currency, initialAmount } = req.body;

    try {
      let budgetline = await BudgetLine.findOne({ name });

      if (budgetline) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'BudgetLine already exists' }] });
      }

      budgetline = new BudgetLine({
        programme,
        name,
        currency,
        initialAmount,
      });

      await budgetline.save();
      res.send(budgetline);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

router.post(
  '/update',
  check('programme', 'Programme is required').notEmpty(),
  check('name', 'Name is required').notEmpty(),
  check('currency', 'Currency is required').notEmpty(),
  check('initialAmount', 'Initial Amount is required').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { programme, name, currency, initialAmount } = req.body;

    try {
      let budgetline = await BudgetLine.findOne({ name });

      if (!budgetline) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'BudgetLine not exist' }] });
      }

      budgetline.programme = programme;
      budgetline.name = name;
      budgetline.currency = currency;
      budgetline.initialAmount = initialAmount;
      await budgetline.save();
      res.json({ budgetline });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

router.post(
  '/delete/:id',
  async (req, res) => {
    try {
      await BudgetLine.findOneAndRemove({ _id: req.params.id });
      const budgetlines = await BudgetLine.find();
      res.json(budgetlines);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
