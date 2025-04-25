import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";
import { jwtDecode } from "jwt-decode"; // Sử dụng cú pháp đúng để nhập khẩu jwtDecode
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, formData);
      const { token } = response.data;
  
      localStorage.setItem("token", token);
      const decodedToken = jwtDecode(token);
      const userRole = response.data.role;
  
      localStorage.setItem("loginSuccess", "true"); // ✅ Lưu trạng thái đăng nhập thành công
  
      // 👉 Điều hướng theo vai trò
      if (userRole === "MEMBER") {
        navigate("/masterData");
      } else if (userRole === "BOSS") {
        navigate("/InventorySummarry");
      } else {
        navigate("/dashboard"); 
      }
    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      setError("❌ Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin.");
      toast.error("❌ Đăng nhập thất bại!");
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          {/* Logo và tiêu đề */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-500">Vui lòng đăng nhập để tiếp tục</p>
          </div>

          {/* Hiển thị lỗi nếu có */}
          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

          {/* Form đăng nhập */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium">Tên đăng nhập</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Mật khẩu</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all duration-300"
            >
              Đăng Nhập
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-gray-500 text-sm mt-4">
            © 2025 Admin Dashboard. All rights reserved.
          </p>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

    </div>
    
  );
};

export default Login;
