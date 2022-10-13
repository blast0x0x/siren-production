const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtSecret = 'secret';
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');
const auth = require('../../middleware/auth');
const checkObjectId = require('../../middleware/checkObjectId');

router.get('/:id',
  checkObjectId('id'),
  async ({ params: { id } }, res) => {
  try {
    const user = await User.findOne({ _id: id });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/users
// @desc     Get all users
// @access   Public
router.get('/', async (req, res) => {
  try {
    const users = await User.find({ isRemoved: false });
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/users
// @desc     Register user
// @access   Public
router.post(
  '/',
  check('firstName', 'First name is required').notEmpty(),
  check('lastName', 'Last name is required').notEmpty(),
  check('birth', 'Date of Birth is required').notEmpty(),
  check('address', 'Address is required').notEmpty(),
  check('phone', 'Phone number is required').notEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('job', 'Job title is required').notEmpty(),
  check(
    'password',
    'Please enter a password with 6 or more characters'
  ).isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, birth, address, phone, email, job, programme, contractNo, password } = req.body;

    try {
      let user = await User.findOne({ email:email, isRemoved: false });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      // if (!captchaToken) {
      //   return res
      //     .status(400)
      //     .json({ errors: [{ msg: 'Failed reCAPTCHA check' }] });
      // }

      let programmeId;
      if (programme == "")
        programmeId = new mongoose.Types.ObjectId(0);
      else
        programmeId = new mongoose.Types.ObjectId(programme);
      
      user = new User({
        firstName: firstName,
        lastName: lastName,
        birth: birth,
        address: address,
        phone: phone,
        email: email,
        job: job,
        programme: programmeId,
        password: password,
        contractNo: contractNo,
        approvalState: 0,
        isFirstLogin: true
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        jwtSecret,
        { expiresIn: '8h' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

router.post(
  '/update',
  check('firstName', 'First name is required').notEmpty(),
  check('lastName', 'Last name is required').notEmpty(),
  check('birth', 'Date of Birth is required').notEmpty(),
  check('address', 'Address is required').notEmpty(),
  check('phone', 'Phone number is required').notEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('job', 'Job title is required').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { id, firstName, lastName, birth, address, phone, email, job, programme, contractNo } = req.body;
    try {
      let user = await User.findOne({ _id:id });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User not exist' }] });
      }

      user = await User.findOne({ email: email, isRemoved: false });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }
      user.firstName = firstName;
      user.lastName = lastName;
      user.birth = birth;
      user.address = address;
      user.phone = phone;
      user.email = email;
      user.job = job;
      user.programme = programme;
      user.contractNo = contractNo;
      await user.save();
      res.json({ user });
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
      let user = await User.findOne({ _id: req.params.id });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User not exist '}]});
      }

      user.isRemoved = true;
      await user.save();
      const users = await User.find({ isRemoved: false });
      res.json(users);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

router.post(
  '/changePassword',
  check('email', 'Please include a valid email').isEmail(),
  check(
    'oldpassword',
    'Please enter a password with 6 or more characters'
  ).isLength({ min: 6 }),
  check(
    'newpassword',
    'Please enter a password with 6 or more characters'
  ).isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, oldpassword, newpassword } = req.body;

    try {
      let user = await User.findOne({ email:email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User not exist' }] });
      }

      const isMatch = await bcrypt.compare(oldpassword, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newpassword, salt);
      await user.save();
      res.json(user);
      // await User.findOneAndUpdate({ email: email }, { password: new_password });
      // const users = await User.find();
      // res.json(users);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

router.post('/updateApprovalById', async (req, res) => {
  const { userid, checked } = req.body;
    try {
      const user = await User.findOne({ _id: userid });
      user.approvalState = checked ? 2 : 1;
      await user.save();
      const users = await User.find();
      res.json(users);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

router.post('/checkFirst', auth, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id });
    if (user.isFirstLogin) {
      user.isFirstLogin = false;
      await user.save();
      res.json(user);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}
);

module.exports = router;
