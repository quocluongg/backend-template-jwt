import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// 1. Middleware xác thực Token
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Lấy token từ header: "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // Giải mã token để lấy ID
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Tìm user từ ID, loại bỏ trường password
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Cho phép đi tiếp
    } catch (error) {
      res.status(401).json({ message: 'Token không hợp lệ, vui lòng đăng nhập lại' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Không có token, quyền truy cập bị từ chối' });
  }
};

// 2. Middleware check Admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Yêu cầu quyền Admin' });
  }
};

// 3. Middleware check Giảng viên
const isInstructor = (req, res, next) => {
  // Admin cũng có quyền của Instructor
  if (req.user && (req.user.role === 'instructor' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Yêu cầu quyền Giảng viên' });
  }
};

export { protect, isAdmin, isInstructor };