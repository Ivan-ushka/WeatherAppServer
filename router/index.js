const Router = require('express').Router;
const userController = require('../controllers/user-controller');

const router = new Router();
const {body} = require('express-validator')



router.post('/registration',
    body('name').isLength({min:4, max: 32}),
    body('email').isEmail(),
    body('password').isLength({min:4, max: 32}),
    userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.post('/checkPwd', userController.checkPwd);
router.post('/changePwd', userController.changePwd);


module.exports = router;


