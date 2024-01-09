const router = require('express').Router();
const User = require('../models/user.model');
const { Menu } = require('../models/menu.model');
const mongoose = require('mongoose')

//Get all menus of a user, or query for a single menu of that user (use query parameter menuID)
router.route('/').get(async (req, res, next) => {
  const userID = req.query.uid;
  const menuID = req.query.menuID;
  let user;
  let menu;

  try {
    user = await User.findOne({ userID: userID }).orFail();
  } catch (err) {
    console.log(err)
    err.type = 'user_not_found';
    next(err);
    return;
  }

  if (menuID) {

    menu = user.menus.id(menuID)

    if (!menu) {
      err = new Error("Invalid menu ID")
      err.type = "menu_not_found"
      next(err)
      return
    }

    res.status(201).send({ menu: menu });
    return;
  }

  //If there is no particular menuID specified, return all the menus of the user.
  if (!menuID) {
    res.status(201).send({ menus: user.menus });
    return;
  }

  res.status(201).send({ menu: menu });
});

//Add a new menu for the user
router.route('/').post(async (req, res, next) => {
  const userID = req.body.uid;
  const menuName = req.body.menuName;
  const currency = req.body.currency;

  let user;
  let menu;

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

  try {
    await user.menus.push(newMenu);
    await user.save();
  } catch (err) {
    next(err);
  }
  res.status(201).end();
});

//delete the menu by its ID.
router.route('/').delete(async (req, res, next) => {
  const menuID = req.body.menuID;
  const userID = req.body.uid

  let user

  try {
    user = await User.findOne({ userID: userID }).orFail();
  } catch (err) {
    err.type = 'user_not_found';
    next(err);
    return;
  }

  try {
    user.menus.remove({ _id: menuID })
    await user.save()
  } catch (err) {
    next(err);
    return;
  }

  res.sendStatus(200);
});

//Update a menu
router.route('/').patch(async (req, res, next) => {
  const menuID = req.body.menuID;
  const userID = req.body.uid
  const newMenu = req.body.newMenu;
  let user;

  try {
    user = await User.findOne({ userID: userID }).orFail();
  } catch (err) {
    err.type = 'menu_not_found';
    next(err);
    return;
  }

  try {
    let menu = user.menus.id(menuID)

    Object.keys(newMenu).forEach((key) => {
      menu[key] = newMenu[key]
    })

    await user.save()

  } catch (err) {
    err.type = 'bad_menu';
    next(err);
    return;
  }

  res.sendStatus(204);
});

module.exports = router;
