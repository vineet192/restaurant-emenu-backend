const router = require('express').Router();
const User = require('../models/user.model');

router.route('/:id').get((req, res) => {
  console.log(`get menu ${req.params.id}`);
  res.status(200).send(`get menu ${req.params.id}`);
});

//TODO: modify routes based on new user schema.

//Add a new menu for the user
router.route('/').post(async (req, res) => {
  const newMenu = req.body.menu;
  const userID = req.body.userID;
  let user;

  try {
    user = await User.findOne({ userID: userID });
  } catch (err) {
    console.log('Error finding the user : ', err);
    res.status(400).send({ success: false });
  }

  user.menus.push(newMenu);

  try {
    await user.save();
  } catch (err) {
    console.log('Error saving the user : ', err);
    res.status(400).send({ success: false });
  }
  res.send({ success: true });
});

router.route('/:id').delete((req, res) => {});

router.route('/:id').patch((req, res) => {
  //To be implemented.
  res.send();
});

module.exports = router;
