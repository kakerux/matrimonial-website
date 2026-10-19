const express = require('express');
const { createProfile , ProfileLatest, getMyProfile, updateProfile , getProfileById, searchProfiles } = require('../Controller/Profile');
const { SignUp  , Login , UserProfile , AdminProfile} = require('../Controller/UserSign');
const upload = require('../Middleware/upload');
const authMiddleware = require('../Middleware/Authmiddleware');
const adminMiddleware = require('../Middleware/AdminMiddleware')
const {
    getStats, getUserGrowth, getAllUsers, deleteUser, getPendingProfiles, verifyProfile,
} = require('../Controller/AdminController')
const { createHeart, getHeartStatus, getMatches, getReceivedHearts, acceptHeart, declineHeart } = require('../Controller/Heart');
const { getSettings, updateSettings } = require('../Controller/SettingsController');
const { getConversations, getConversation, sendMessage } = require('../Controller/Messagecontroller');


const router = express.Router();

router.post('/profiles', authMiddleware , upload.single('profileImage'), createProfile);
router.get('/profiles/me', authMiddleware, getMyProfile)
router.put('/profiles/me', authMiddleware, upload.single('profileImage'), updateProfile);
router.post('/signup' , SignUp);
router.post('/login' , Login);
// router.get('/profile' , UserProfile);

router.get('/profiles/latest' , ProfileLatest)
router.get('/profiles/search', searchProfiles)
router.get('/profiles/:id', getProfileById);

router.post('/hearts/:toUserId', authMiddleware, createHeart);
router.get('/hearts/status/:toUserId', authMiddleware, getHeartStatus);
router.get('/hearts/received', authMiddleware, getReceivedHearts)
router.put('/hearts/:heartId/accept', authMiddleware, acceptHeart)
router.put('/hearts/:heartId/decline', authMiddleware, declineHeart)
router.get('/matches', authMiddleware, getMatches);

router.get('/messages/conversations', authMiddleware, getConversations)
router.get('/messages/:otherUserId', authMiddleware, getConversation)
router.post('/messages/:toUserId', authMiddleware, sendMessage)


router.get('/admin' , AdminProfile);
router.get('/admin/stats', authMiddleware, adminMiddleware, getStats)
router.get('/admin/user-growth', authMiddleware, adminMiddleware, getUserGrowth)
router.get('/admin/users', authMiddleware, adminMiddleware, getAllUsers)
router.delete('/admin/users/:id', authMiddleware, adminMiddleware, deleteUser)
router.get('/admin/profiles/pending', authMiddleware, adminMiddleware, getPendingProfiles)
router.put('/admin/profiles/:id/verify', authMiddleware, adminMiddleware, verifyProfile)

router.get('/admin/settings', authMiddleware, adminMiddleware, getSettings);
router.put('/admin/settings', authMiddleware, adminMiddleware, updateSettings);

module.exports = router;
