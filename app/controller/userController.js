const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateJwt = (id, name, email) => {
    return jwt.sign(
        {id, name, email}, 
        process.env.JWT_SECRET,
        {expiresIn: '24h'}
        )

}

class UserController {
    async registration(req, res, next) {
        const {name, email, password} = req.body
        if(!name || !email || !password) {
            return next(ApiError.badRequest('Некорректный email, имя или пароль'))
        }
        const candidate = await prisma.Users.findFirst({where: { OR: [{email }, {name}] },
        });
        if (candidate) {
            return next(ApiError.badRequest('Пользователь с таким именем или email уже существует'))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await prisma.Users.create({ data: { name, email, password: hashPassword } });
        const token = generateJwt(user.id, user.name, user.email)
            return res.json({token})
        }

    async login(req, res, next) {
        const {name, email, password} = req.body
        const user = await prisma.Users.findFirst({where: { OR: [{email }, {name}] },})
        if (!user) {
            return next(ApiError.internal('Пользователь не найден'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if(!comparePassword) {
            return next(ApiError.internal('Указан неверный пароль'))
        }
        const token = generateJwt(user.id, user.name, user.email)
            return res.json({token})
    }

    async check(req, res, next) {
       const token = generateJwt(req.user.id, req.user.name, req.user.email)
       return res.json({token})        
    }
}

module.exports = new UserController()