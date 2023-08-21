// import { response } from 'express'
import db from '../models'
import bcrypt from 'bcryptjs'
import Jwt, { decode } from 'jsonwebtoken'
import { notAuth } from '../middlewares/handle_error'
const hashPassword = password => bcrypt.hashSync(password, bcrypt.genSaltSync(8))
//const hashPassword = password => bcrypt.hashSync(password,bcrypt.genSaltSync(8)) //tra ve password dc bam ra luu trong db 
//dang ki
export const register = ({ email, password }) => new Promise(async (resolve, reject) => {
    try {
        //search sequelize findorreate :tra ve 1 mang
        const response = await db.User.findOrCreate({
            where: { email },
            defaults: {
                email,
                password: hashPassword(password)
            }
        })
        //ma hoa token  : sign(doi tuong ma hoa bo vao object ,can 1 cai set dekey,expri : ngayf heets han,neu dang nhap tao moi thi no se tao token con khong co thi tra ve null
        const accessToken = response[1] ? Jwt.sign({ id: response[0].id, email: response[0].email, role_code: response[0].role_code }, process.env.JWT_SECRET, { expiresIn: '5s' }) : null
        //JWT_SECRET_REFRESH_TOKEN:lay token moi 
        const refreshToken = response[1] ? Jwt.sign({ id: response[0].id }, process.env.JWT_SECRET_REFRESH_TOKEN, { expiresIn: '15d' }) : null

        resolve({
            err: response[1] ? 0 : 1,
            mes: response[1] ? 'Register is succuess' : 'Email is used',
            /* sau khi chay 1 gmail moi cái đoạn trong token đã được mã hóa ra từ cái ID và email và roll code thì sau này sử dụng những cái ID 
            lấy tai Nguyên nào mà cần xác thực thì gọi Cái token này lên thì cái server mình sẽ là từ lúc cần này nó biết được thằngnào gửi lên  
            và roll của thằng đó là gì thì mình có thể là phân quyền được thằng đó  có thể là cho phép nó hay 
            không lấy được cái tài nguyên của mình tức là sẽ lấy được cái data trong db của mình 
            */
            'access_token': accessToken ? `Bearer ${accessToken}` : accessToken,
            'refresh_token': refreshToken
        })
        if (refreshToken) {
            await db.User.update({
                refresh_token: refreshToken
            }, {
                where: { id: response[0].id }
            })
        }
    } catch (error) {
        reject(error)
    }
})
//dang nhap
export const login = ({ email, password }) => new Promise(async (resolve, reject) => {
    try {

        const response = await db.User.findOne({
            where: { email },
            raw: true
        })
        //check password dung
        //neu respon null thi ischecked cung null ,repon = object  --isChecked se nhan true hay false
        const isChecked = response && bcrypt.compareSync(password, response.password)
        //neu dung
        const accessToken = isChecked ? Jwt.sign({ id: response.id, email: response.email, role_code: response.role_code }, process.env.JWT_SECRET, { expiresIn: '5s' }) : null
        const refreshToken = isChecked ? Jwt.sign({ id: response.id }, process.env.JWT_SECRET_REFRESH_TOKEN, { expiresIn: '15d' }) : null
        resolve({
            err: accessToken ? 0 : 1,
            mes: accessToken ? 'Login is succuess' : response ? 'Pass is wrong ' : 'Email is not ton tai',
            //truoc baker thuong 1 dau cach
            'access_token': accessToken ? `Bearer ${accessToken}` : accessToken,
            'refresh_token': refreshToken
        })
        if (refreshToken) {
            await db.User.update({
                refresh_token: refreshToken
            }, {
                where: { id: response.id }
            })
        }
    } catch (error) {
        reject(error)
    }
})


//refresh token
export const refreshToken = (refresh_token) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.User.findOne({
            where: { refresh_token }
        })
        if (response) {
            Jwt.verify(refresh_token, process.env.JWT_SECRET_REFRESH_TOKEN, (err) => {
                if (err) {
                    resolve({
                        err: 1,
                        mes: 'Refresh token expired,login again'
                    })
                }
                else {
                    const accessToken = Jwt.sign({ id: response.id, email: response.email, role_code: response.role_code }, process.env.JWT_SECRET, { expiresIn: '2d' })
                    resolve({
                        err: accessToken ? 0 : 1,
                        mes: accessToken ? 'OK' : 'Fail to generate new access token.let try more time',
                        'access_token': accessToken ? `Bearer ${accessToken}` : accessToken,
                        'refresh_token': refresh_token
                    })

                }
            })


        }

    } catch (error) {
        reject(error)
    }
})


