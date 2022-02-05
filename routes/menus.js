const router = require('express').Router();
const User = require('../models/user.model');

router.route('/:id').get((req, res) => {
  console.log(`get menu ${req.params.id}`);
  res.status(200).send(`get menu ${req.params.id}`);
});

//Add a new menu for the user
router.route('/').post(async (req, res) => {
  const newMenu = req.body.menu;
  const userID = req.body.userID;
  let user;

  user = await User.findOne({ userID: userID });

  user.menus.push(newMenu);

  await user.save();
  res.send({ success: true });
});

router.route('/:id').delete((req, res) => {
  const menuID = req.params.id;
  const userID = req.body.userID;
  let user;

  user = await User.findOne({ userID: userID });

  user.menus.id(menuID).remove();
  user.save();
  res.send({ success: true });
});

router.route('/:id').get(async (req, res) => {
  const menuID = req.params.id;
  const userID = req.body.userID;

  user = await User.findOne({ userID: userID });

  const menu = user.menus.id(menuID);
  res.send({ success: true, menu: menu });
});

router.route('/:id').patch((req, res) => {
  //To be implemented.
  res.send();
});

module.exports = router;
