const { headerauth } = require("../midelware/headerauth");
const { varifay } = require("../midelware/varifay");
const {superadminanduponly}=require('../midelware/IssuperAdmin')
const {Owneronly}=require("../midelware/IsOwner");
const { adminanduponly } = require("../midelware/IsAdmin");
const usercouponController=require("../controller/user_couponController")



const router=express.Router();
router.get('/allusercoupons',varifay,adminanduponly,usercouponController.getAll);
router.get('/usercoupon',varifay,adminanduponly,usercouponController.getBycouponAUserId);
router.get('/userIdcoupon',varifay,headerauth,usercouponController.usercouponController.getByUserId);
router.get('/usercouponId',varifay,adminanduponly,usercouponController.getBycouponcode);
router.post('/usercoupon',varifay,headerauth,usercouponController.create);
router.patch('/usercoupon',varifay,superadminanduponly,usercouponController.update);
router.delete('/usercoupon',varifay,superadminanduponly,usercouponController.delete)
router.delete('/usercouponId',varifay,superadminanduponly,usercouponController.deletecouponcode);
router.delete('/userIdcoupon',varifay,superadminanduponly,usercouponController.deleteuserId
)
exports.model=router;