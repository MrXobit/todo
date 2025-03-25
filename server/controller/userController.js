const ApiError = require('../error/ApiError')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const generateJwt = (id, email, role, tasks) => {
    return jwt.sign(
        {id, email, role, tasks},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class UserController {
    async registration(req, res, next) {
        try {
            const {email, password} = req.body
            if(!email || !password) {
                return next(ApiError.badRequest('Некорректный email или password'))
            }
            const candidate = await User.findOne({ email }) 
            if (candidate) {
                return next(ApiError.badRequest('Пользователь с таким email уже существует'))
            }
            const hashPassword = await bcrypt.hash(password, 5)
            const user = await User.create({email, password: hashPassword})
            const token = generateJwt(user.id, user.email, user.role, user.tasks)
            return res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role
                }
            })
        } catch (error) {
            console.log(error)
            return next(ApiError.internal('Что-то пошло не так'))
        }
    }

    async login(req, res, next) {
        const {email, password} = req.body
        try {
            const user = await User.findOne({ email })
            if (!user) {
                return next(ApiError.internal('Пользователь не найден'))
            }
            const comparePassword = await bcrypt.compare(password, user.password)
            if (!comparePassword) {
                return next(ApiError.internal('Указан неверный пароль'))
            }
            const token = generateJwt(user._id, user.email, user.role, user.tasks)
            return res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role
                }
            })
        } catch (error) {
            return next(ApiError.internal('Что-то пошло не так'))
        }
    }
    

    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.email, req.user.role, req.user.tasks)
        return res.json({
            token,
            user: {
                id: req.user.id,
                email: req.user.email,
                role: req.user.role
            }
        });
    }
}

module.exports = new UserController()