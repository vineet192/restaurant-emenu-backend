const router = require('express').Router();
const User = require('../models/user.model');
const { Menu } = require('../models/menu.model');

//Get all menus of a user, or query for a single menu of that user (use query parameter menuID)
router.route('/').get(async (req, res, next) => {
  const userID = req.query.uid;
  const menuID = req.query.menuID;
  let user;
  let menu;

  if(menuID){
    try {
      menu = await Menu.findById(menuID).orFail();
    } catch (err) {
      err.type = 'menu_not_found';
      next(err);
      return;
    }

    res.status(201).send({menu: menu})
    return;
  }

  try {
    user = await User.findOne({ userID: userID }).orFail();
  } catch (err) {
    err.type = 'user_not_found';
    next(err);
    return;
  }

  //If there is no particular menuID specified, return all the menus of the user.
  if (!menuID) {
    let menus = await Menu.find().where('_id').in(user.menus).exec();
    res.status(201).send({ menus: menus });
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
    menu = await Menu.create(newMenu);
  } catch (err) {
    err.type = 'bad_menu';
    next(err);
  }

  try {
    user.menus.push(menu._id);
    await user.save();
  } catch (err) {
    next(err);
  }
  res.status(201).end();
});

//delete the menu by its ID.
router.route('/').delete(async (req, res, next) => {
  const menuID = req.body.id;

  try {
    await Menu.deleteOne({ _id: menuID }).orFail();
  } catch (err) {
    next(err);
    return;
  }

  res.sendStatus(200);
});

//Update a menu
router.route('/').patch(async (req, res, next) => {
  const menuID = req.body.menuID;
  const newMenu = req.body.newMenu;
  let menu;

  try {
    menu = await Menu.findById(menuID).orFail();
  } catch (err) {
    err.type = 'menu_not_found';
    next(err);
    return;
  }

  try {
    await menu.set(newMenu);
  } catch (err) {
    err.type = 'bad_menu';
    next(err);
    return;
  }

  menu.save();

  res.sendStatus(204);
});

module.exports = router;
