const router = require('express').Router();
const ctrl = require('../controllers/calendarController');

router.get('/:area', ctrl.listForArea);
router.post('/', ctrl.toggle);

module.exports = router;