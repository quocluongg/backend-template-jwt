import db from "../libs/db.js";
import bcrypt from "bcryptjs";

const User = db.users;
const Role = db.roles;

/**
 * GET /api/users
 * Lấy danh sách users. Chỉ Admin mới được xem toàn bộ.
 */
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role_id, search } = req.query;
    const offset = (page - 1) * limit;

    // Tạo where clause động
    let whereClause = {};
    if (role_id) whereClause.role_id = role_id;
    if (search) {
      whereClause.email = { [db.Sequelize.Op.like]: `%${search}%` };
    }

    const { count, rows } = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ["password"] }, // Không bao giờ trả về password
      include: [
        {
          model: Role,
          attributes: ["id", "name"],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["created_at", "DESC"]],
    });

    res.json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      users: rows,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/users/:id
 * Xem chi tiết user. Admin xem được tất cả. User thường chỉ xem được chính mình.
 */
export const getUserById = async (req, res) => {
  try {
    const reqUserId = req.userId;
    const targetUserId = parseInt(req.params.id);
    const userRole = req.roleId;

    // Nếu không phải Admin VÀ không phải xem chính mình -> Chặn
    if (userRole !== 1 && reqUserId !== targetUserId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await User.findByPk(targetUserId, {
      attributes: { exclude: ["password"] },
      include: [{ model: Role, attributes: ["id", "name"] }],
    });

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * POST /api/users
 * Tạo user mới bởi Admin (có thể set luôn role Admin/Editor/User)
 */
export const createUser = async (req, res) => {
  try {
    const { full_name, email, password, role_id } = req.body;

    // Validate
    if (!email || !password || !full_name) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 8);

    const newUser = await User.create({
      full_name,
      email,
      password: hashedPassword,
      // Nếu admin không truyền role_id thì mặc định là User (ID 2)
      role_id: role_id || 2,
      avatar_url: req.body.avatar_url || null,
    });

    res
      .status(201)
      .json({ message: "User created successfully", userId: newUser.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * PUT /api/users/:id
 * Cập nhật thông tin user.
 */
export const updateUser = async (req, res) => {
  try {
    const reqUserId = req.userId;
    const targetUserId = parseInt(req.params.id);
    const userRole = req.roleId;

    // Chỉ Admin hoặc Chính chủ mới được sửa
    if (userRole !== 1 && reqUserId !== targetUserId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { full_name, avatar_url, password, role_id } = req.body;
    let updateData = { full_name, avatar_url };

    // Chỉ Admin mới được quyền đổi role của người khác
    if (userRole === 1 && role_id) {
      updateData.role_id = role_id;
    }

    // Nếu có đổi password
    if (password) {
      updateData.password = await bcrypt.hash(password, 8);
    }

    await User.update(updateData, { where: { id: targetUserId } });
    res.json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE /api/users/:id
 * Chỉ Admin mới được xóa user.
 */
export const deleteUser = async (req, res) => {
  try {
    const targetUserId = parseInt(req.params.id);

    // Không cho phép tự xóa chính mình để tránh lỗi hệ thống không còn admin
    if (req.userId === targetUserId) {
      return res.status(400).json({ message: "Cannot delete yourself" });
    }

    const deleted = await User.destroy({ where: { id: targetUserId } });
    if (!deleted) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
