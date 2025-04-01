import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";
import Sidebar from "../component/sidebar";
const CustomerPage = () => {
  const [customers, setCustomers] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/customers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCustomers(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách khách hàng:", error);
      }
    };

    fetchCustomers();
  }, [token]);

  return (
    <div className="flex h-screen">
    {/* Sidebar bên trái */}
    <Sidebar/>
    <div className="flex-1  mt-8 p-6 bg-white shadow-lg rounded-lg overflow-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">📋 Danh Sách Khách Hàng</h2>

      {customers.length === 0 ? (
        <p className="text-gray-500">Bạn chưa có khách hàng nào.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">📞 Số Điện Thoại</th>
                <th className="py-3 px-6 text-left">👤 Tên Khách Hàng</th>
                <th className="py-3 px-6 text-left">🏡 Tỉnh/Thành phố</th>
                <th className="py-3 px-6 text-left">🏙️ Quận/Huyện</th>
                <th className="py-3 px-6 text-left">🏘️ Phường/Xã</th>
                <th className="py-3 px-6 text-left">📍 Đường</th>
                <th className="py-3 px-6 text-left">📌 Địa Chỉ Chi Tiết</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6 text-left">{customer.phoneNumber}</td>
                  <td className="py-3 px-6 text-left font-semibold">{customer.customerName}</td>
                  <td className="py-3 px-6 text-left">{customer.province}</td>
                  <td className="py-3 px-6 text-left">{customer.district}</td>
                  <td className="py-3 px-6 text-left">{customer.ward}</td>
                  <td className="py-3 px-6 text-left">{customer.street}</td>
                  <td className="py-3 px-6 text-left">{customer.detailAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </div>
  );
};

export default CustomerPage;
