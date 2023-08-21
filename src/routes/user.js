import * as controllers from '../controllers'
import express  from 'express'
import verifyToken from '../middlewares/verify_token'
import { isAdmin,isModeratorOrAdmin } from '../middlewares/verify_roles'
const router = express.Router()

//ham check
router.use(verifyToken)
// phan quyen admin moi vao dc
// router .use(isModeratorOrAdmin)

//search dung Associantions
//c2
// router.get('/',[verifyToken,isModeratorOrAdmin],controllers.getCurrent)
router.get('/',controllers.getCurrent)
module.exports = router