const jwt = require('jsonwebtoken')
const User = require('../Model/UserModel')

const requireAuth = async (req, res, next) => {
    const { authorization } = req.headers
    if (!authorization){
        return res.status(401).json({error: 'token error'})
    }

    const token = authorization.split(' ')[1]
    try{
        const {_id} = jwt.verify(token, process.env.SECRET) 

        req.user = await User.findOne({_id}).select('_id')
        next()
    }catch(error){
        console.log(error)
        res.status(401).json({error: 'cere fara pachet'})
    }
}

module.exports = requireAuth