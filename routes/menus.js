const router = require('express').Router();
const User = require('../models/user.model');
const { Menu } = require('../models/menu.model');
const mongoose = require('mongoose')

//Get all menus of a user, or query for a single menu of that user (use query parameter menuID)
router.route('/').get(async (req, res, next) => {
  const userID = req.query.uid;
  const menuID = req.query.menuID;
  const query = req.query.query;
  const isPreview = req.query.isPreview && req.query.isPreview.trim().toLowerCase() === "true"

  if (query) {
    try {
      let qmenus = await queryUserForMenus(userID, query)
      res.status(200).send(qmenus)
      return
    } catch (err) {
      next(err)
      return
    }
  }

  //If there is no particular menuID specified, return all the menus of the user.
  if (!menuID) {
    let menus;
    try {
      menus = await getAllMenusOfUser(userID)
      res.status(201).send({ menus: menus });
      return
    } catch (err) {
      next(err)
      return
    }
  }

  try {
    let menu = await getMenuFromUser(userID, menuID, isPreview)
    res.status(201).send({ menu: menu });
    return;
  } catch (err) {
    next(err)
    return
  }

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

async function queryUserForMenus(userID, query) {
  let user
  try {
    user = await User.findOne({ userID: userID }).orFail();
  } catch (err) {
    err.type = 'user_not_found';
    throw err
  }

  let qmenus = user.menus.filter(menu => menu.name.toLowerCase().includes(query.toLowerCase()))
  return qmenus
}

async function getAllMenusOfUser(userID) {
  let user
  try {
    user = await User.findOne({ userID: userID }).orFail();
  } catch (err) {
    err.type = 'user_not_found';
    throw err
  }

  return user.menus
}

async function getMenuFromUser(userID, menuID, isPreview) {

  let menu

  try {

    let menuFilter = { "menus._id": mongoose.Types.ObjectId(menuID) }

    //If this data is not for preview, enforce user auth
    if (!isPreview) menuFilter["userID"] = userID

    menu = (await User.findOne(menuFilter, { "menus.$": 1 }).orFail())["menus"][0]

  } catch (err) {
    err.type = "menu_not_allowed"
    throw err
  }

  if (!menu) {
    err = new Error("Invalid menu ID")
    err.type = "menu_not_found"
    throw err
  }
  return menu
}

module.exports = router;
