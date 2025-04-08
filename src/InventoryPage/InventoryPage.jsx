import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";
import Sidebar from "../component/sidebar";
const InventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [details, setDetails] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [detailItem, setDetailItem] = useState(null);
  const [detailPage, setDetailPage] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [detailTotalPages, setDetailTotalPages] = useState(1);
  const pageSize = 15;
  const token = localStorage.getItem("token");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [qrItem, setQrItem] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const fetchInventory = async (page = 0) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/inbounds/summaryStatusActive`, {
        params: { startDate, endDate, page, pageSize },
        headers: { Authorization: `Bearer ${token}` },
      });

      setInventory(response.data.data);
      setTotal(response.data.total);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
      setGrandTotal(response.data.grandTotal)
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tồn kho:", error);
    }
  };
  // const fetchItemByQrCode = async () => {
  //   if (!qrCode) return;
  //   try {
  //     const response = await axios.get(`${API_BASE_URL}/api/inbounds/by-qrcode`, {
  //       params: { qrCode },
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     setQrItem(response.data);
  //   } catch (error) {
  //     console.error("Lỗi khi tìm sản phẩm theo QR:", error);
  //     setQrItem(null);
  //   }
  // };

  const toggleStatusByQrCode = async () => {
    if (!qrCode) return;
    try {
      const response = await axios.put(`${API_BASE_URL}/api/inbounds/toggle-status`, null, {
        params: { qrCode },
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(response.data);
      fetchInventory();
      // fetchItemByQrCode();
    } catch (error) {
      console.error("Lỗi khi đổi trạng thái sản phẩm:", error);
    }
  };
  const handlePageChange = (newPage) => {
    // Cập nhật lại trang mới
    setDetailPage(newPage);
    // Gọi lại fetchDetails với trang mới
    fetchDetails(newPage);
  };
  const fetchDetails = async (page = 0) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/inbounds/allInventory`, {
        params: {
          page,
          size: 10,
          startDate: startDate || undefined,  // thêm startDate nếu có
          endDate: endDate || undefined       // thêm endDate nếu có
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      setDetails(response.data.data);
      setDetailPage(response.data.currentPage);
      setDetailTotalPages(response.data.totalPages);
      setShowDetails(true);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
    }
  };
  const downloadExcel = async (startDate, endDate) => {
    try {
      const token = localStorage.getItem("token");
  
      const response = await axios.get(`${API_BASE_URL}/api/inbounds/export`, {
        params: { startDate, endDate },
        headers: {
          Authorization: `Bearer ${token}` },
        responseType: "blob",
      });
  
      // 🔧 Format ngày
      const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toISOString().split("T")[0]; // YYYY-MM-DD
      };
  
      const formattedStart = startDate ? formatDate(startDate) : "all";
      const formattedEnd = endDate ? formatDate(endDate) : "all";
      const fileName = `inbound-${formattedStart}_to_${formattedEnd}.xlsx`;
  
      // 📥 Tạo link và tải file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("❌ Lỗi khi tải file Excel:", error);
      alert("Không thể tải file Excel.");
    }
  };
  



  useEffect(() => {
    fetchInventory();
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar bên trái */}
      <Sidebar />
      <div className="flex-1 mt-8 p-6 bg-white shadow-lg rounded-lg overflow-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">📦 Danh sách tồn kho</h2>
        <div className="flex space-x-4 mb-4">
          <input
            type="text"
            placeholder="Nhập mã QR..."
            value={qrCode}
            onChange={(e) => setQrCode(e.target.value)}
            className="border p-2 rounded"
          />
          {/* <button onClick={fetchItemByQrCode} className="bg-blue-500 text-white px-4 py-2 rounded">
      🔍 Tìm kiếm
    </button> */}
          <button onClick={toggleStatusByQrCode} className="bg-yellow-500 text-white px-4 py-2 rounded">
            🔄 Đổi trạng thái
          </button>
          <label className="text-gray-700 font-medium">📅 Từ ngày:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2 rounded"
          />
          <label className="text-gray-700 font-medium">📅 Đến ngày:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2 rounded"
          />
          <button
            onClick={() => fetchInventory(0)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            📊 Lọc
          </button>
        </div>

        <div className="flex justify-end mb-4 gap-2">
          <button
            onClick={() => fetchDetails()} // Gọi fetchDetails khi bấm nút Chi tiết
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            📋 Chi tiết
          </button>

          <button
            onClick={() => downloadExcel(startDate, endDate)} // Truyền ngày lọc vào
            className="bg-purple-500 text-white px-4 py-2 rounded"
          >
            📥 Tải Excel
          </button>
        </div>



        <p className="text-lg font-medium text-gray-700 mb-2">📊 Tổng số sản phẩm tồn kho:
          <span className="font-bold text-blue-600"> {grandTotal}</span>
        </p>

        {inventory.length === 0 ? (
          <p className="text-gray-500">Không có sản phẩm tồn kho.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3">📦 Sản phẩm</th>
                <th className="border p-3">🏷️ Tên sản phẩm</th>
                <th className="border p-3">🏷️ Số lượng</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item.id} className="border">
                  <td className="border p-3">{item.item}</td>
                  <td className="border p-3">{item.itemName}</td>
                  <td className="border p-3">{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => fetchInventory(currentPage - 1)}
            disabled={currentPage === 0}
            className="px-4 py-2 rounded bg-gray-500 text-white disabled:opacity-50"
          >
            ⬅ Trang trước
          </button>
          <span className="text-lg font-medium">
            Trang {currentPage + 1} / {totalPages}
          </span>
          <button
            onClick={() => fetchInventory(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
            className="px-4 py-2 rounded bg-gray-500 text-white disabled:opacity-50"
          >
            Trang sau ➡
          </button>
        </div>
        {showDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-7/10 max-w-5xl relative transform transition-all">
              <h3 className="text-xl font-semibold mb-4 text-center">📋 Chi tiết sản phẩm</h3>

              {/* Nút Đóng */}
              <button
                onClick={() => setShowDetails(false)}
                className="absolute top-4 right-4 bg-gray-500 text-white px-3 py-1 rounded-full shadow-lg"
              >
                ✖
              </button>

              {/* Nếu không có dữ liệu */}
              {details.length === 0 ? (
                <p className="text-gray-500 text-center">Không có chi tiết nào.</p>
              ) : (
                <div className="overflow-auto max-h-[500px]">
                  <table className="w-full border-collapse shadow-md rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-gray-300 text-black text-left">
                        <th className="border p-3 text-center">📦 Item</th>
                        <th className="border p-3 text-center">🏷️ Tên sản phẩm</th>
                        <th className="border p-3 text-center">🏭 Nhà cung cấp</th>
                        <th className="border p-3 text-center">🔢 QR Code</th>
                        <th className="border p-3 text-center">📅 Ngày nhập</th>
                        <th className="border p-3 text-center">🏭 Ngày sản xuất</th>
                        <th className="border p-3 text-center">📆 Hạn sử dụng</th>
                        <th className="border p-3 text-center">📦 Lô hàng</th>
                        <th className="border p-3 text-center">🛑 Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {details.map((detail, index) => (
                        <tr key={detail.id} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                          <td className="border p-3 text-center">{detail.item}</td>
                          <td className="border p-3">{detail.itemName}</td>
                          <td className="border p-3">{detail.supplier}</td>
                          <td className="border p-3 text-center font-mono">{detail.qrCode}</td>
                          <td className="border p-3 text-center">{new Date(detail.importDate).toLocaleDateString()}</td>
                          <td className="border p-3 text-center">{new Date(detail.manufacturingDate).toLocaleDateString()}</td>
                          <td className="border p-3 text-center">{new Date(detail.expirationDate).toLocaleDateString()}</td>
                          <td className="border p-3 text-center">{detail.batch}</td>
                          <td className="border p-3 text-center font-bold text-green-600">{detail.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Phân trang */}
              <div className="flex justify-between items-center mt-4">
                {/* Nút Trang trước */}
                <button
                  onClick={() => {
                    if (detailPage > 0) {
                      fetchDetails(detailPage - 1); // Giảm trang và gọi lại hàm fetch
                    }
                  }}
                  disabled={detailPage === 0}
                  className={`px-4 py-2 rounded ${detailPage === 0 ? "bg-gray-300" : "bg-blue-500 text-white"}`}
                >
                  ⬅ Trang trước
                </button>

                {/* Hiển thị trang hiện tại và tổng số trang */}
                <span className="text-lg font-medium">
                  Trang {detailPage + 1} / {detailTotalPages}
                </span>

                {/* Nút Trang sau */}
                <button
                  onClick={() => {
                    if (detailPage < detailTotalPages - 1) {
                      fetchDetails(detailPage + 1); // Tăng trang và gọi lại hàm fetch
                    }
                  }}
                  disabled={detailPage >= detailTotalPages - 1}
                  className={`px-4 py-2 rounded ${detailPage >= detailTotalPages - 1 ? "bg-gray-300" : "bg-blue-500 text-white"}`}
                >
                  Trang sau ➡
                </button>
              </div>
            </div>
          </div>
        )}



      </div>
    </div>
  );
};

export default InventoryPage;