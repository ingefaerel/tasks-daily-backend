const router = require('express').Router();
const ctrl = require('../controllers/notesController');

router.get('/:date/:task', ctrl.get);
router.post('/', ctrl.save);

module.exports = router;