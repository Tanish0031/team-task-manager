const router = require('express').Router();
const { register, login, getMe, findUser } = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getMe);
router.get('/find', auth, findUser);

module.exports = router;