const ApiError = require("../exseptions/api-error");
const userService = require("../service/user-service");
const {validationResult} = require('express-validator')

class UserController{
    async registration(req, res, next){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const {name, email, password} = req.body;
            const userData  = await userService.registration(name, email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true})
            return res.json(userData);
        } catch (error) {
            next(error);
        }
     
    }

    async login(req, res, next){
        try {
            const {email, password } = req.body;
            const userData  = await userService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true})
            return res.json(userData);
        } catch (error) {
            next(error);
        }
     
    }

    async logout(req, res, next){
        try {
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (error) {
            next(error);
        }
     
    }

    async activate(req, res, next){
        try {
            const activationLink = req.params.link;
            await userService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL)
        } catch (error) {
            next(error);
        }
     
    }

    async refresh(req, res, next){
        try {
            const {refreshToken} =req.cookies;
            const userData  = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnle: true})
            return res.json(userData);
        } catch (error) {
            next(error);
        }
     
    }

    async checkPwd(req, res, next){
        try {
           
            const {email, password} = req.body;
            console.log({email, password})
            const isCheck = await userService.checkPwd(email, password)
            return res.json(isCheck)
        } catch (error) {
             next(error)
        }
    }

    async changePwd(req, res, next){
        try {
            const {email, password} = req.body;
            console.log({email, password})
            const userData = await userService.changePwd(email, password)
            return res.json(userData)
        } catch (error) {
             next(error)
        }
    }
}

module.exports = new UserController();