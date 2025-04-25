import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";
import SidebarForBoss from "../component/sidebarForBoss";
const InboundPageForBoss = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [details, setDetails] = useState([]);
  const [detailPage, setDetailPage] = useState(0);
  const [detailTotalPages, setDetailTotalPages] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [username, setUsername] = useState("");

  const pageSize = 15;

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const fetchData = async (page) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${API_BASE_URL}/api/inbounds/uniqueItems`, {
        params: {
          page,
          size: pageSize,
          startDate: startDate || undefined,  // bỏ qua nếu rỗng
          endDate: endDate || undefined,
          username: username || undefined, 
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      setData(response.data.data);
      setTotalPages(response.data.totalPages);
      setGrandTotal(response.data.grandTotal);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchDetails = async (page = 0) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${API_BASE_URL}/api/inbounds/paged`, {
        params: {
          page,
          size: pageSize,
          startDate: startDate || undefined,  // bỏ qua nếu rỗng
          endDate: endDate || undefined,
          username: username || null, 

        },
        headers: { Authorization: `Bearer ${token}` },
      });

      setDetails(response.data.data);
      setDetailTotalPages(response.data.totalPages);
      setDetailPage(page);
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };


 
  const downloadExcel = async (startDate, endDate) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`${API_BASE_URL}/api/inbounds/exportInbound`, {
        params: {
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          username: username || undefined

          
        },
        headers: {
          Authorization: `Bearer ${token}`
        },
        responseType: "blob",
      });

      // 🔧 Format ngày
      const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toISOString().split("T")[0];
      };

      const formattedStart = startDate ? formatDate(startDate) : "all";
      const formattedEnd = endDate ? formatDate(endDate) : "all";
      const fileName = `inbounds-${formattedStart}_to_${formattedEnd}.xlsx`;

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

  return (
    <div className="flex h-screen">
      {/* Sidebar bên trái */}
      <SidebarForBoss />
      <div className="flex-1 mt-8 p-6 bg-white shadow-lg rounded-lg overflow-auto relative">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">📦 Danh sách nhập kho</h2>

        {/* ✅ Nút Detail nằm góc phải ngoài cùng */}
        <div className="absolute top-6 right-6 flex gap-3">
          <button
            onClick={() => {
              fetchDetails(0);
              setShowPopup(true);
            }}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            📋 Xem chi tiết
          </button>

          <button
            onClick={() => downloadExcel(startDate, endDate)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            📥 Tải Excel
          </button>
        </div>


        {/* Bộ lọc ngày */}
        <div className="flex space-x-4 mb-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Tên Đại lý"
            className="border p-2 rounded"
          />

          <button onClick={() => fetchData(0)} className="bg-blue-500 text-white px-4 py-2 rounded">Lọc</button>

        </div>

        <p className="text-lg font-medium mb-2">📊 Tổng số lượng: <span className="font-bold text-blue-600">{grandTotal}</span></p>

        {/* Bảng dữ liệu */}
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Item</th>
              <th className="border border-gray-300 px-4 py-2">Item Name</th>
              <th className="border border-gray-300 px-4 py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">{item.item}</td>
                <td className="border border-gray-300 px-4 py-2">{item.itemName}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{item.total}</td>

              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center mt-4 space-x-2">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            disabled={currentPage === 0}
          >
            Previous
          </button>
          <span className="px-4 py-2">Page {currentPage + 1} of {totalPages}</span>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
            disabled={currentPage >= totalPages - 1}
          >
            Next
          </button>
        </div>

        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-4 rounded shadow-lg w-11/12 max-w-6xl">
              <h3 className="text-lg font-bold mb-2">Danh sách Inbounds</h3>
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border px-2 py-1">ID</th>
                    <th className="border px-2 py-1">Item</th>
                    <th className="border px-2 py-1">ItemName</th>
                    <th className="border px-2 py-1">Supplier</th>
                    <th className="border px-2 py-1">QR Code</th>
                    <th className="border px-2 py-1">Import Date</th>
                    <th className="border px-2 py-1">Manufacturing Date</th>
                    <th className="border px-2 py-1">Expiration Date</th>
                    <th className="border px-2 py-1">Batch</th>
                    <th className="border px-2 py-1">Đại Lý</th>

                    <th className="border px-2 py-1">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {details.map((detail, index) => (
                    <tr key={index} className="hover:bg-gray-100">
                      <td className="border px-2 py-1">{detail.id}</td>
                      <td className="border px-2 py-1">{detail.item}</td>
                      <td className="border px-2 py-1">{detail.itemName}</td>

                      <td className="border px-2 py-1">{detail.supplier}</td>
                      <td className="border px-2 py-1">{detail.qrCode}</td>
                      <td className="border px-2 py-1">{detail.importDate}</td>
                      <td className="border px-2 py-1">{detail.manufacturingDate}</td>
                      <td className="border px-2 py-1">{detail.expirationDate}</td>
                      <td className="border px-2 py-1">{detail.batch}</td>
                      <td className="border px-2 py-1">{detail.userName}</td>

                      <td className="border px-2 py-1">{detail.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-between items-center mt-4 flex-wrap gap-2">
                {/* Nút Trang đầu */}
                <button
                  onClick={() => fetchDetails(0)}
                  disabled={detailPage === 0}
                  className={`px-4 py-2 rounded ${detailPage === 0 ? "bg-gray-300" : "bg-blue-500 text-white"}`}
                >
                  ⏮ Trang đầu
                </button>

                {/* Nút Trang trước */}
                <button
                  onClick={() => fetchDetails(detailPage - 1)}
                  disabled={detailPage === 0}
                  className={`px-4 py-2 rounded ${detailPage === 0 ? "bg-gray-300" : "bg-blue-500 text-white"}`}
                >
                  ⬅ Trang trước
                </button>

                {/* Hiển thị trang hiện tại / tổng trang */}
                <span className="text-lg font-medium">
                  Trang {detailPage + 1} / {detailTotalPages}
                </span>

                {/* Nút Trang sau */}
                <button
                  onClick={() => fetchDetails(detailPage + 1)}
                  disabled={detailPage >= detailTotalPages - 1}
                  className={`px-4 py-2 rounded ${detailPage >= detailTotalPages - 1 ? "bg-gray-300" : "bg-blue-500 text-white"}`}
                >
                  Trang sau ➡
                </button>

                {/* Nút Trang cuối */}
                <button
                  onClick={() => fetchDetails(detailTotalPages - 1)}
                  disabled={detailPage >= detailTotalPages - 1}
                  className={`px-4 py-2 rounded ${detailPage >= detailTotalPages - 1 ? "bg-gray-300" : "bg-blue-500 text-white"}`}
                >
                  Trang cuối ⏭
                </button>
              </div>

              {/* Nút Đóng */}
              <button
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
                onClick={() => setShowPopup(false)}
              >
                ✖ Close
              </button>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default InboundPageForBoss;