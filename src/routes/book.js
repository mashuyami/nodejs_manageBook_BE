import * as controllers from '../controllers'
import express  from 'express'
import verifyToken from '../middlewares/verify_token'
import { isAdmin,isModeratorOrAdmin } from '../middlewares/verify_roles'
const router = express.Router()
import uploadCloud from '../middlewares/uploader'
router.get('/',controllers.getBooks)
//ham check
router.use(verifyToken)
// phan quyen admin moi vao dc
// router .use(isModeratorOrAdmin)

//search dung Associantions
//c2
// router.get('/',[verifyToken,isModeratorOrAdmin],controllers.getCurrent)
// 1 anh dung singed,nhieu anh (nhieu key ) ,moi key 1 anh : filler,array dung khi 1 key nhieu anh
router.post('/',uploadCloud.single('image'),controllers.createNewBook)
router.put('/',uploadCloud.single('image'),controllers.updateBook)
router.delete('/',controllers.deleteBook)

module.exports = router