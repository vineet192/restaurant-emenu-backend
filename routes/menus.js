const router = require('express').Router();
const User = require('../models/user.model');

//Get all menus of a user, or query for a single menu of that user (use query parameter menuID)
router.route('/:uid').get(async (req, res, next) => {
  const userID = req.params.uid;
  const menuID = req.query.menuID;
  let user;

  try {
    user = await User.findOne({ userID: userID }).orFail();
  } catch (err) {
    res.status(404).send({ msg: `Cannot find user with userID=${userID}` });
    return;
  }

  if (menuID) {
    let menu = user.menus.id(menuID);

    if (!menu) {
      res.status(404).send({
        msg: `User ${userID} does not have a menu with menuID = ${menuID}`,
      });
      return;
    }

    res.status(201).send({ menu: menu });
  }

  let menus = user.menus;

  res.send({ menus: menus });
});

//Add a new menu for the user
router.route('/').post(async (req, res, next) => {
  const newMenu = req.body.menu;
  const userID = req.body.userID;
  let user;

  try {
    user = await User.findOne({ userID: userID });
  } catch (err) {
    next(err);
  }

  if (!user) {
    res.status(400).send({ msg: `User ${userID} not found!` });
  }
  user.menus.push(newMenu);

  try {
    await user.save();
  } catch (err) {
    next(err);
  }
  res.send({ success: true });
});

router.route('/:id').delete(async (req, res) => {
  const menuID = req.params.id;
  const userID = req.body.userID;
  let user;

  user = await User.findOne({ userID: userID });

  user.menus.id(menuID).remove();
  user.save();
  res.send({ success: true });
});

//Get a particular menu of a user
router.route('/:uid/:menuid').get(async (req, res) => {
  const menuID = req.params.menuid;
  const userID = req.body.uid;

  let user = await User.findOne({ userID: userID });

  const menu = user.menus.id(menuID);
  res.send({ menu: menu });
});

router.route('/:id').patch((req, res) => {
  //To be implemented.
  res.send();
});

module.exports = router;
