const router = require('express').Router();
const User = require('../models/user.model');

router.route('/init').post(async (req, res) => {
  const userID = req.body.userID;

  let user = await User.findOne({ userID: userID });
  if (user) {
    res.status(200).send({
      success: true,
      msg: 'User has already been initialized',
    });
    res.end();
    return;
  }

  newUser = await User.create({
    userID: userID,
    menus: [],
  });

  await newUser.save();

  res.status(201).send({
    success: true,
    msg: 'User initialized!',
  });
});

module.exports = router;
