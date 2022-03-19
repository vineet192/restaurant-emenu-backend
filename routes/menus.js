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
    err.type = 'user_not_found';
    next(err);
    return;
  }

  if (!menuID) {
    let menus = user.menus;
    res.send({ menus: menus });
    return;
  }

  let menu = user.menus.id(menuID);

  if (!menu) {
    next({ type: 'menu_not_found' });
    return;
  }

  res.status(201).send({ menu: menu });
});

//Add a new menu for the user
router.route('/:uid').post(async (req, res, next) => {
  const userID = req.params.uid;
  const menuName = req.body.menuName;
  const currency = req.body.currency;
  let user;

  try {
    user = await User.findOne({ userID: userID }).orFail();
  } catch (err) {
    err.type = 'user_not_found';
    next(err);
    return;
  }

  let newMenu = {
    name: menuName,
    categories: [],
    isPublic: false,
    currency: currency,
  };

  user.menus.push(newMenu);

  try {
    await user.save();
  } catch (err) {
    next(err);
  }
  res.status(201).end();
});

router.route('/:id').delete(async (req, res, next) => {
  const menuID = req.params.id;
  const userID = req.body.userID;
  let user;

  try {
    user = await User.findOne({ userID: userID }).orFail();
  } catch (err) {
    err.type = 'user_not_found';
    next(err);
    return;
  }

  user.menus.id(menuID).remove();
  user.save();
  res.status(200).end();
});

//Get a particular menu of a user
router.route('/:uid/:menuid').get(async (req, res) => {
  const menuID = req.params.menuid;
  const userID = req.body.uid;
  let user;

  try {
    user = await User.findOne({ userID: userID });
  } catch (err) {
    err.type = 'user_not_found';
    next(err);
    return;
  }
  const menu = user.menus.id(menuID);
  res.status(200).send({ menu: menu });
});

router.route('/:uid/:menuid').patch(async (req, res) => {
  const menuID = req.params.menuid;
  const userID = req.params.uid;
  const newMenu = req.body;
  let user;

  try {
    user = await User.findOne({ userID: userID });
  } catch (err) {
    err.type = 'user_not_found';
    next(err);
    return;
  }

  try {
    await user.menus.id(menuID).set(newMenu);
  } catch (err) {
    err.type = 'menu_not_found';
    next(err);
    return;
  }
  user.save();
  res.status(200).send();
});

module.exports = router;
