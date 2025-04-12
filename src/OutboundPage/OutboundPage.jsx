import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";
import Sidebar from "../component/sidebar";
const OutboundPage = () => {
  const [outbounds, setOutbounds] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [details, setDetails] = useState([]);
  const [detailPage, setDetailPage] = useState(0);
  const [detailTotalPages, setDetailTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const pageSize = 10;
  const token = localStorage.getItem("token");
  const [detailIsLastPage, setDetailIsLastPage] = useState(false);

  const fetchOutbounds = async (page = 0) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/outbounds/summaryItem`, {
        params: { page, size: pageSize, startDate, endDate },
        headers: { Authorization: `Bearer ${token}` },
      });

      setOutbounds(response.data.data);
      setTotalItems(response.data.totalItems);
      setGrandTotal(response.data.grandTotal)
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tổng sản phẩm xuất kho:", error);
    }
  };

  const fetchOutboundDetails = async (page = 0) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/outbounds/paged`, {
        params: {
          page,
          size: 10,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      const fetchedData = response.data.data;
      setDetails(fetchedData);
      setCurrentPage(response.data.currentPage);

      // Nếu số lượng data ít hơn pageSize => trang cuối
      const isLastPage = fetchedData.length < 10;
      setDetailIsLastPage(isLastPage);

      setIsModalOpen(true);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết xuất kho:", error);
    }
  };
  const downloadOutboundExcel = async (startDate, endDate) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`${API_BASE_URL}/api/outbounds/export`, {
        params: { startDate, endDate },
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });

      // Format tên file
      const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toISOString().split("T")[0]; // YYYY-MM-DD
      };

      const formattedStart = startDate ? formatDate(startDate) : "all";
      const formattedEnd = endDate ? formatDate(endDate) : "all";
      const filename = `outbound-${formattedStart}_to_${formattedEnd}.xlsx`;

      // Tải file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("❌ Lỗi khi tải file Outbound Excel:", error);
      alert("Không thể tải file Excel Outbound.");
    }
  };





  useEffect(() => {
    fetchOutbounds();
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar bên trái */}
      <Sidebar />
      <div className="flex-1 mt-8 p-6 bg-white shadow-lg rounded-lg overflow-auto relative">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">📦 Tổng hợp sản phẩm xuất kho</h2>
        <div className="flex gap-4 mb-4">
          <label className="text-gray-700 font-medium">
            Từ ngày:
            <input type="date" className="ml-2 p-2 border rounded" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </label>
          <label className="text-gray-700 font-medium">
            Đến ngày:
            <input type="date" className="ml-2 p-2 border rounded" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </label>
          <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={() => fetchOutbounds()}>🔍 Lọc</button>
        </div>
        <p className="text-lg font-medium text-gray-700 mb-2">📊 Tổng sản phẩm: <span className="font-bold text-blue-600">{grandTotal}</span></p>

        {outbounds.length === 0 ? (
          <p className="text-gray-500">Không có sản phẩm nào.</p>
        ) : (
          <div >
            {/* Nút Chi tiết và Tải Excel nằm ở góc phải trên của bảng */}
            {outbounds.length > 0 && (
              <div className="absolute top-0 right-0 flex gap-2">
                <button
                  onClick={() => fetchOutboundDetails(0)}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  📄 Chi tiết
                </button>

                <button
                  onClick={() => downloadOutboundExcel(startDate, endDate)}
                  className="bg-purple-500 text-white px-4 py-2 rounded"
                >
                  📥 Tải Excel
                </button>
              </div>
            )}

            <table className="w-full border-collapse border border-gray-200 mt-8">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-3">📦 Mã sản phẩm (Item)</th>
                  <th className="border p-3">🏷️ Tên sản phẩm</th>
                  <th className="border p-3">📊 Tổng số lượng</th>
                </tr>
              </thead>
              <tbody>
                {outbounds.map((outbound, index) => (
                  <tr key={index} className="border">
                    <td className="border p-3">{outbound.item}</td>
                    <td className="border p-3">{outbound.itemName}</td>
                    <td className="border p-3 font-bold text-blue-600">{outbound.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* Popup Details */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-3/4">
              <h3 className="text-lg font-semibold mb-4">📜 Chi tiết xuất kho</h3>
              {details.length === 0 ? (
                <p className="text-gray-500">Không có dữ liệu.</p>
              ) : (
                <table className="w-full border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      
                      <th className="border p-3">Mã đơn</th>
                      <th className="border p-3">Khách hàng</th>
                      <th className="border p-3">item</th>
                      <th className="border p-3">itemName</th>

                      <th className="border p-3">QR Code</th>
                      <th className="border p-3">Ngày bán</th>
                      <th className="border p-3">NSX</th>
                      <th className="border p-3">HSD</th>
                      <th className="border p-3">Lô hàng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details.map((detail, index) => (
                      <tr key={index} className="border">
                        <td className="border p-3">{detail.orderId}</td>
                        <td className="border p-3">{detail.customerName}</td>
                        <td className="border p-3">{detail.item}</td>
                        <td className="border p-3">{detail.itemName}</td>

                        <td className="border p-3">{detail.qrCode}</td>
                        <td className="border p-3">{new Date(detail.saleDate).toLocaleDateString()}</td>
                        <td className="border p-3">{new Date(detail.manufacturingDate).toLocaleDateString()}</td>
                        <td className="border p-3">{new Date(detail.expirationDate).toLocaleDateString()}</td>
                        <td className="border p-3">{detail.batch}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

          
              {/* Pagination in Popup */}
              <div className="flex justify-between items-center mt-4 flex-wrap gap-2">
                {/* Nút Trang đầu */}
                <button
                  onClick={() => fetchOutboundDetails(0)}
                  disabled={currentPage === 0}
                  className={`px-4 py-2 rounded ${currentPage === 0 ? "bg-gray-300" : "bg-blue-500 text-white"}`}
                >
                  ⏮ Trang đầu
                </button>

                {/* Nút Trang trước */}
                <button
                  onClick={() => fetchOutboundDetails(currentPage - 1)}
                  disabled={currentPage === 0}
                  className={`px-4 py-2 rounded ${currentPage === 0 ? "bg-gray-300" : "bg-blue-500 text-white"}`}
                >
                  ⬅ Trang trước
                </button>

                {/* Hiển thị trang hiện tại */}
                <span className="text-lg font-medium">
                  Trang {currentPage + 1} / {totalPages}
                </span>

                {/* Nút Trang sau */}
                <button
                  onClick={() => fetchOutboundDetails(currentPage + 1)}
                  disabled={detailIsLastPage}
                  className={`px-4 py-2 rounded ${detailIsLastPage ? "bg-gray-300" : "bg-blue-500 text-white"}`}
                >
                  Trang sau ➡
                </button>

                {/* Nút Trang cuối */}
                <button
                  onClick={() => fetchOutboundDetails(totalPages - 1)}
                  disabled={detailIsLastPage}
                  className={`px-4 py-2 rounded ${detailIsLastPage ? "bg-gray-300" : "bg-blue-500 text-white"}`}
                >
                  Trang cuối ⏭
                </button>
              </div>

              {/* Nút Đóng */}
              <button
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
                onClick={() => setIsModalOpen(false)}
              >
                ✖ Đóng
              </button>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default OutboundPage;
