const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Output = require('../../models/Output');

router.get('/', async (req, res) => {
  try {
    const outputs = await Output.find().populate('connectedBudgetlines');
    res.json(outputs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post(
  '/',
  check('programme', 'Programme is required').notEmpty(),
  check('name', 'Name is required').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { programme, connectedBudgetlines, name } = req.body;

    try {
      let output = await Output.findOne({ name });

      if (output) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Output already exists' }] });
      }

      output = new Output({
        programme,
        connectedBudgetlines,
        name,
        activities: []
      });

      await output.save();
      const outputs = await Output.find().populate('connectedBudgetlines');
      res.send(outputs);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

router.post(
  '/activity',
  check('activity', 'Activity is required').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id, activity } = req.body;

    try {
      let output = await Output.findOne({ _id: id });

      if (!output) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Output no exist' }] });
      }

      if (output.activities.some((activity) => activity.activityName.toString() === activity)) {
        return res.status(400).json({ msg: 'Activity already existed' });
      }

      output.activities.push({ activityName: activity });

      await output.save();
      const outputs = await Output.find().populate('connectedBudgetlines');
      res.send(outputs);
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
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id, programme, connectedBudgetlines, name } = req.body;

    try {
      let output = await Output.findOne({ _id: id });

      if (!output) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Output not exist' }] });
      }

      output.programme = programme;
      output.connectedBudgetlines = connectedBudgetlines;
      output.name = name;
      await output.save();
      const outputs = await Output.find().populate('connectedBudgetlines');
      res.json(outputs);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

router.post(
  '/activity/update',
  check('activity', 'Activity Name is required').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { outputid, activityid, activity } = req.body;

    try {
      let output = await Output.findOne({ _id: outputid });

      if (!output) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Output not exist' }] });
      }

      let activities = output.activities;
      for (let i = 0; i < activities.length; i++) {
        if (activities[i]._id.toString() === activityid.toString())
          activities[i].activityName = activity;
      }
      output.activities = activities;
      await output.save();
      const outputs = await Output.find().populate('connectedBudgetlines');
      res.json(outputs);
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
      await Output.findOneAndRemove({ _id: req.params.id });
      const outputs = await Output.find().populate('connectedBudgetlines');
      res.json(outputs);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

router.post(
  '/delete/:outputid/:activityid',
  async (req, res) => {
    try {
      let output = await Output.findOne({ _id: req.params.outputid });

      if (!output) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Output not exist' }] });
      }

      output.activities = output.activities.filter(
        (activity) => activity._id.toString() !== req.params.activityid.toString()
      );
      await output.save();
      const outputs = await Output.find().populate('connectedBudgetlines');
      res.json(outputs);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
