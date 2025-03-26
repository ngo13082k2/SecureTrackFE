import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = localStorage.getItem("token");

  const [searchPhone, setSearchPhone] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSearch = async () => {
    try {
      const params = {};
      if (searchPhone) params.phoneNumber = searchPhone;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await axios.get(`${API_BASE_URL}/api/orders/search`, {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(response.data);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm đơn hàng:", error);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/orders/my-orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách đơn hàng:", error);
      }
    };

    fetchOrders();
  }, [token]);

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedOrder(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">📦 Danh sách đơn hàng</h2>

      {/* Form tìm kiếm */}
      <div className="flex space-x-4 mb-4 items-center">
        <label className="font-medium text-gray-700"> Từ ngày:</label>
        <input
          type="date"
          className="border p-2 rounded"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <label className="font-medium text-gray-700"> Đến ngày:</label>
        <input
          type="date"
          className="border p-2 rounded"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <input
          type="text"
          className="border p-2 rounded"
          placeholder="📞 Nhập SĐT khách hàng"
          value={searchPhone}
          onChange={(e) => setSearchPhone(e.target.value)}
        />

        <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded">
          🔍 Tìm kiếm
        </button>
      </div>


      {orders.length === 0 ? (
        <p className="text-gray-500">Không có đơn hàng nào.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order.id} className="border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition duration-300">
              <p className="text-lg font-medium text-gray-700">
                🆔 Mã đơn hàng: <span className="font-bold text-blue-600">{order.id}</span>
              </p>
              <p className="text-gray-600">
                📦 Tổng sản phẩm: <span className="font-semibold">{order.totalProducts}</span>
              </p>
              <p className="text-gray-600">
                📞 SĐT khách hàng: <span className="font-semibold">{order.customerPhoneNumber}</span>
              </p>
              <p className="text-gray-600">
                👤 Tên khách hàng: <span className="font-semibold">{order.customerName}</span>
              </p>
              <p className="text-gray-600">
                📅 Ngày tạo đơn: <span className="font-semibold">{new Date(order.orderDate).toLocaleDateString()}</span>
              </p>

              <button
                onClick={() => fetchOrderDetails(order.id)}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Xem Chi Tiết
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Modal Chi Tiết Đơn Hàng */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full relative">
            <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl">
              ❌
            </button>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">📝 Chi Tiết Đơn Hàng: {selectedOrder.id}</h3>
            <p className="text-gray-600">📦 Tổng sản phẩm: {selectedOrder.totalProducts}</p>
            <p className="text-gray-600">📞 SĐT khách hàng: {selectedOrder.customerPhoneNumber}</p>
            <p className="text-gray-600">👤 Tên khách hàng: {selectedOrder.customerName}</p>

            <h4 className="text-lg font-semibold mt-4">📜 Danh sách QR Code:</h4>
            <table className="w-full border-collapse border border-gray-200 mt-2">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-3 text-left">🔢 Mã QR</th>
                  <th className="border p-3 text-left">🏷️ Sản phẩm</th>
                  <th className="border p-3 text-left">📅 NSX</th>
                  <th className="border p-3 text-left">⏳ HSD</th>
                  <th className="border p-3 text-left">🔢 Lô sản xuất</th>
                  <th className="border p-3 text-left">👤 Chủ sở hữu</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.qrDetails.map((qr) => (
                  <tr key={qr.id} className="border">
                    <td className="border p-3">{qr.qrCode}</td>
                    <td className="border p-3">{qr.bottleInfo.masterDataName}</td>
                    <td className="border p-3">{qr.bottleInfo.manufacturingDate}</td>
                    <td className="border p-3">{qr.bottleInfo.expirationDate}</td>
                    <td className="border p-3">{qr.bottleInfo.batch}</td>
                    <td className="border p-3">{qr.bottleInfo.owner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}


      {/* Modal Chi Tiết Đơn Hàng */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
            >
              ❌
            </button>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              📝 Chi Tiết Đơn Hàng: {selectedOrder.id}
            </h3>
            <p className="text-gray-600">📦 Tổng sản phẩm: {selectedOrder.totalProducts}</p>
            <p className="text-gray-600">📞 SĐT khách hàng: {selectedOrder.customerPhoneNumber}</p>
            <p className="text-gray-600">👤 Tên khách hàng: {selectedOrder.customerName}</p>

            <h4 className="text-lg font-semibold mt-4">📜 Danh sách QR Code:</h4>
            <table className="w-full border-collapse border border-gray-200 mt-2">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-3 text-left">🔢 Mã QR</th>
                  <th className="border p-3 text-left">🏷️ Sản phẩm</th>
                  <th className="border p-3 text-left">📅 NSX</th>
                  <th className="border p-3 text-left">⏳ HSD</th>
                  <th className="border p-3 text-left">🔢 Lô sản xuất</th>
                  <th className="border p-3 text-left">👤 Chủ sở hữu</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.qrDetails.map((qr) => (
                  <tr key={qr.id} className="border">
                    <td className="border p-3">{qr.qrCode}</td>
                    <td className="border p-3">{qr.bottleInfo.masterDataName}</td>
                    <td className="border p-3">{qr.bottleInfo.manufacturingDate}</td>
                    <td className="border p-3">{qr.bottleInfo.expirationDate}</td>
                    <td className="border p-3">{qr.bottleInfo.batch}</td>
                    <td className="border p-3">{qr.bottleInfo.owner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;
