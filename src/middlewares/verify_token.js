import jwt, { TokenExpiredError } from 'jsonwebtoken'
import { notAuth } from './handle_error'
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization
    //check khong co token
    if (!token) return notAuth('Require authorization', res)
    const accessToken = token.split(' ')[1]
    //check token khong hop le 
    jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
        if(err){
            const isChecked = err instanceof TokenExpiredError
            if(!isChecked) return notAuth('Access token invalid',res,isChecked)
            if (isChecked) return notAuth('Acess token exprired',res,isChecked)
        }
     
        req.user = user
        next()
    })
}
export default verifyToken