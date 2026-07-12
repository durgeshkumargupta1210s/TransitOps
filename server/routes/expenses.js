const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');
const ec = require('../controllers/expenseController');

router.post('/', auth, roles(['Financial Analyst','Fleet Manager']), ec.createExpense);
router.get('/', auth, ec.listExpenses);
router.get('/:id', auth, ec.getExpense);
router.delete('/:id', auth, roles(['Financial Analyst','Fleet Manager']), ec.deleteExpense);

module.exports = router;
