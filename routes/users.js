const router = require('express').Router();
const {
  getUsers, getUser, updateUser, updateAvatar, currentUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUser);
router.get('/me', currentUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
