import generateToken from '../libs/generateToken.js';
import User from '../models/User.js';

// @desc    Đăng ký tài khoản mới
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { fullName, email, password } = req.body;

  // Check xem email đã tồn tại chưa
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'Email đã được sử dụng' });
  }

  // Tạo user mới (mặc định role là student do Model setup)
  const user = await User.create({
    fullName,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Dữ liệu không hợp lệ' });
  }
};

// @desc    Đăng nhập & lấy Token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Tìm user theo email
  const user = await User.findOne({ email });

  // Check password (dùng hàm matchPassword đã viết trong Model)
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
  }
};

// @desc    Lấy thông tin User hiện tại
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  // req.user đã có sẵn nhờ middleware 'protect'
  const user = {
    _id: req.user._id,
    fullName: req.user.fullName,
    email: req.user.email,
    role: req.user.role,
    avatar: req.user.avatar
  };
  res.status(200).json(user);
};

export { registerUser, loginUser, getMe };