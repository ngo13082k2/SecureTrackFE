import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";
const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = localStorage.getItem("token");

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

      {orders.length === 0 ? (
        <p className="text-gray-500">Không có đơn hàng nào.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li
              key={order.id}
              className="border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition duration-300"
            >
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

              {/* Nút Xem Chi Tiết */}
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
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
            >
              ❌
            </button>
            <h3 className="text-xl font-semibold text-gray-800">📝 Chi Tiết Đơn Hàng: {selectedOrder.id}</h3>
            <p className="text-gray-600">📦 Tổng sản phẩm: {selectedOrder.totalProducts}</p>
            <p className="text-gray-600">📞 SĐT khách hàng: {selectedOrder.customerPhoneNumber}</p>
            <p className="text-gray-600">👤 Tên khách hàng: {selectedOrder.customerName}</p>

            <h4 className="text-lg font-semibold mt-4">📜 Danh sách QR Code:</h4>
            <ul className="mt-2 space-y-2">
              {selectedOrder.qrDetails.map((qr) => (
                <li key={qr.id} className="border p-3 rounded-lg bg-gray-100">
                  <p className="text-gray-700">🔢 Mã QR: <span className="font-semibold">{qr.qrCode}</span></p>
                  <p className="text-gray-600">📆 Ngày tạo: {new Date(qr.orderCreationDate).toLocaleString()}</p>
                  <p className="text-gray-600">🏷️ Sản phẩm: {qr.bottleInfo.masterDataName}</p>
                  <p className="text-gray-600">🆔 Mã sản phẩm: {qr.bottleInfo.masterDataId}</p>
                  <p className="text-gray-600">📅 Ngày sản xuất: {qr.bottleInfo.manufacturingDate}</p>
                  <p className="text-gray-600">⏳ Hạn sử dụng: {qr.bottleInfo.expirationDate}</p>
                  <p className="text-gray-600">🔢 Lô sản xuất: {qr.bottleInfo.batch}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;
