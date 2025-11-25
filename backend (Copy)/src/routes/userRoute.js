// import express from "express";
// import * as userController from "../controllers/userController.js";
// import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// // TẤT CẢ các route dưới đây đều cần phải đăng nhập trước
// router.use(verifyToken);

// // GET /api/users -> Chỉ Admin xem được danh sách
// router.get("/", isAdmin, userController.getAllUsers);

// // POST /api/users -> Chỉ Admin mới được tạo user thủ công (kèm role tùy ý)
// router.post("/", isAdmin, userController.createUser);

// // GET /api/users/:id -> Admin xem được hết, User chỉ xem được mình (đã xử lý trong controller)
// router.get("/:id", userController.getUserById);

// // PUT /api/users/:id -> Admin sửa được hết, User chỉ sửa được mình (đã xử lý trong controller)
// router.put("/:id", userController.updateUser);

// // DELETE /api/users/:id -> Chỉ Admin mới được xóa
// router.delete("/:id", isAdmin, userController.deleteUser);

export default router;
