const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const IPR = require('../../models/IPR');
const checkObjectId = require('../../middleware/checkObjectId');

// @route    GET api/iprs
// @desc     Get all iprs
// @access   Public
router.get('/', async (req, res) => {
  try {
    const iprs = await IPR.find()
      .populate('requestedBy')
      .populate('programme')
      .populate('output')
      .populate('budgetline');
    res.json(iprs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get(
  '/:id',
  checkObjectId('id'),
  async ({ params: { id } }, res) => {
    try {
      const ipr = await IPR.findOne({
        _id: id
      }).populate('requestedBy')
        .populate('programme')
        .populate('output')
        .populate('budgetline');
      if (!ipr) return res.status(400).json({ msg: 'IPR not found' });

      return res.json(ipr);
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ msg: 'Server error' });
    }
  }
);

router.post(
  '/',
  check('date', 'Date is required').notEmpty(),
  check('iprNo', 'IPR No is required').notEmpty(),
  check('dueDate', 'Due Date is required').notEmpty(),
  check('programme', 'Programme is required').notEmpty(),
  check('output', 'Output is required').notEmpty(),
  check('activity', 'Activity is required').notEmpty(),
  check('budgetline', 'Budgetline is required').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { date, iprNo, dueDate, requestedBy, programme, output, activity, budgetline, content, notes } = req.body;

    try {
      ipr = new IPR({
        registerDate: date,
        iprNo,
        dueDate,
        requestedBy,
        programme,
        output,
        activity,
        budgetline,
        content,
        notes,
        approvalStage: 0,
        approvalState: 0
      });
      await ipr.save();
      res.json(ipr);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

router.post(
  '/update',
  async (req, res) => {
    const { programme, output, activity, budgetline, content, notes, iprid } = req.body;

    try {
      const ipr = await IPR.findOneAndUpdate(
        { _id: iprid },
        {
          programme: programme,
          output: output,
          activity: activity,
          budgetline: budgetline,
          content: content,
          notes: notes
        })
        .populate('requestedBy')
        .populate('programme')
        .populate('output')
        .populate('budgetline');
      res.json(ipr);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

router.post('/updateApprovalById', async (req, res) => {
  const { id, checked } = req.body;
  const stage = checked ? 2 : 1;
  try {
    await IPR.findOneAndUpdate({ _id: id }, { approvalStage: stage, approvalState: stage, approvalDate: new Date() });
    const iprs = await IPR.find()
      .populate('requestedBy')
      .populate('programme')
      .populate('output')
      .populate('budgetline');
    res.json(iprs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post('/updateAllocateById', async (req, res) => {
  const { id } = req.body;
  try {
    await IPR.findOneAndUpdate({ _id: id }, { approvalStage: 1, allocationDate: new Date() });
    const iprs = await IPR.find()
      .populate('requestedBy')
      .populate('programme')
      .populate('output')
      .populate('budgetline');
    res.json(iprs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post('/updateIssuedRFQById', async (req, res) => {
  const { id } = req.body;
  try {
    await IPR.findOneAndUpdate({ _id: id }, { approvalStage: 3, RFQIssuanceDate: new Date() });
    const iprs = await IPR.find()
      .populate('requestedBy')
      .populate('programme')
      .populate('output')
      .populate('budgetline');
    res.json(iprs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post('/updateFinalApproveById', async (req, res) => {
  const { id, checked } = req.body;
  const stage = checked ? 4 : 3;
  try {
    await IPR.findOneAndUpdate({ _id: id }, { approvalStage: stage, approvalCEODate: new Date() });
    const iprs = await IPR.find()
      .populate('requestedBy')
      .populate('programme')
      .populate('output')
      .populate('budgetline');
    res.json(iprs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post('/updateNewById', async (req, res) => {
  const { id } = req.body;
  try {
    await IPR.findOneAndUpdate({ _id: id }, { isNewIPR: false });
    const iprs = await IPR.find()
      .populate('requestedBy')
      .populate('programme')
      .populate('output')
      .populate('budgetline');
    res.json(iprs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
