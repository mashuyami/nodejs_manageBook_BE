import createError from 'http-errors'
export const badRequest = (err, res) =>{
    const error = createError.BadRequest(err)
    return res.status(error.status).json({
        err:1,
        mess:error.message
    })
}
// check loi khong dung duong danh,sercel bi loi
export const interalServerError = (res) =>{
    const error = createError.InternalServerError()
    return res.status(error.status).json({
        err:1,
        mess:error.message
    })
}
//
export const notFound = (req, res) =>{
    const error = createError.NotFound('this router is not define ')
    return res.status(error.status).json({
        err:1,
        mess:error.message
    })
}
//
export const notAuth = (err,res,isExpired) =>{
    const error = createError.Unauthorized(err)
    return res.status(error.status).json({
        // 2 : token het han , 1 : token khonh hop le
        err:isExpired ?2:1,
        mess:error.message
    })
}
