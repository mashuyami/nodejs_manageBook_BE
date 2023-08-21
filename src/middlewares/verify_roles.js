
import {notAuth} from "./handle_error"
//check admin
export const isAdmin = (req,res,next)=>{
const {role_code} = req.user
if(role_code !=='R1') return notAuth('Require role Admin',res)
next()
}
//
export const isModeratorOrAdmin = (req,res,next)=>{
const {role_code} = req.user
if(role_code !=='R1' && role_code !== 'R2') return notAuth('Require role Moderator/Admin',res)
next()
}
//
// export const isUser = (req,res,next)=>{
// const {role_code} = req.user
// if(role_code !=='R1' && role_code !== 'R3') return notAuth('Require role Moderator/Admin',res)
// next()
// }