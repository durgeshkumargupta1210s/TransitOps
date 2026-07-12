const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');
const { body } = require('express-validator');
const uc = require('../controllers/userController');

router.get('/', auth, roles(['Fleet Manager']), uc.listUsers);
router.get('/:id', auth, roles(['Fleet Manager']), uc.getUser);
router.put('/:id', auth, roles(['Fleet Manager']),
  body('email').optional().isEmail(),
  uc.updateUser);
router.delete('/:id', auth, roles(['Fleet Manager']), uc.deleteUser);

module.exports = router;
