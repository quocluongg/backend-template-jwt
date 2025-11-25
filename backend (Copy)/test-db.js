// Giả sử đường dẫn này là đúng
import db from "./src/libs/db.js";

export default async function testDBConnection() {
  try {
    // SỬA LỖI: Chúng ta phải gọi hàm authenticate()
    // chứ không phải 'await db'
    await db.sequelize.authenticate();

    console.log("✅ (Test) Kết nối database thành công!");
  } catch (error) {
    console.error("❌ (Test) Kết nối thất bại:", error.message);
  }
}
