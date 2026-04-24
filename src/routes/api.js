'use strict';
const router          = require('express').Router();
const itemsController = require('../controllers/itemsController');

router.get('/items',     itemsController.list);
router.post('/items',    itemsController.create);
router.get('/items/:id', itemsController.getById);

module.exports = router;

