const router = require('express').Router();
const Menu = require('../models/menu.model');

router.route('/:id').get((req, res) => {
  console.log(`get menu ${req.params.id}`);
  res.status(200).send(`get menu ${req.params.id}`);
});

router.route('/').post((req, res) => {
  console.log(req.ip);
  console.log(req.body);
  const newMenu = Menu(req.body);

  newMenu
    .save()
    .then((menu) => {
      res.json({
        success: true,
        id: menu._id,
      });
    })
    .catch((err) => res.status(400).json({ success: false }));
});

router.route('/:id').delete((req, res) => {
  Menu.deleteOne({ _id: req.params.id })
    .then((deletedMenu) => {
      res.json({
        success: true,
        id: deletedMenu._id,
      });
    })
    .catch((err) => {
      res.status(400).json({
        success: false,
      });
    });
});

router.route('/:id').patch((req, res) => {
  //To be implemented.
  res.send();
});

module.exports = router;
