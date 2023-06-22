const router = require('express').Router();
const {
  getUsers, getUser, updateUser, updateAvatar, currentUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', currentUser);
router.get('/:userId', getUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
