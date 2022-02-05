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

  user = await User.findOne({ userID: userID });
  res.status(400).send({ success: false });

  user.menus.push(newMenu);

  await user.save();
  res.send({ success: true });
});

router.route('/:id').delete((req, res) => {
  const menuID = req.params.id;
  const userID = req.body.userID;
});

router.route('/:id').patch((req, res) => {
  //To be implemented.
  res.send();
});

module.exports = router;
