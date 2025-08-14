const router = require('express').Router();
const ctrl = require('../controllers/tasksController');

// strictly YYYY-MM-DD
router.get('/:date(\\d{4}-\\d{2}-\\d{2})', ctrl.listByDate);
router.post('/', ctrl.add);
router.delete('/', ctrl.remove);

module.exports = router;