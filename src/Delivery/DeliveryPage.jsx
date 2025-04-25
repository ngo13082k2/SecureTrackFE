import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";
import { useNavigate } from "react-router-dom";
import Sidebar from "../component/sidebar";
import { ClipLoader } from "react-spinners";
import Modal from "react-modal";
import Logo from "../component/logo";


const DeliveryPage = () => {
    const [isUploading, setIsUploading] = useState(false);

    const navigate = useNavigate();
    const [deliveries, setDeliveries] = useState([]);
    const [selectedDelivery, setSelectedDelivery] = useState(null);
    const [masterDataDetails, setMasterDataDetails] = useState([]);
    const [deliveryDetails, setDeliveryDetails] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [message, setMessage] = useState("");
    const token = localStorage.getItem("token");
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [formData, setFormData] = useState({
        calculationUnit: "",
        deliveryDate: "",
        items: []
    });
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }
        fetchDeliveries();
    }, [token, navigate]);

    const fetchDeliveries = () => {
        axios
            .get(`${API_BASE_URL}/api/delivery/all`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => setDeliveries(response.data))
            .catch((error) => console.error("Lỗi khi lấy danh sách giao hàng:", error));
    };

    const fetchDetails = (deliveryId) => {
        axios
            .get(`${API_BASE_URL}/api/masterDataDelivery/byDelivery`, {
                params: { deliveryId },
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setSelectedDelivery(deliveryId);
                setMasterDataDetails(response.data);

                // Gọi luôn API lấy số chai
                fetchDeliveryDetails(deliveryId);
            })
            .catch((error) => {
                console.error("Lỗi khi lấy dữ liệu chi tiết:", error);
                setMasterDataDetails([]);
                setDeliveryDetails([]); // Nếu lỗi thì xóa luôn dữ liệu số chai
            });
    };

    const fetchDeliveryDetails = (deliveryId) => {
        axios
            .get(`${API_BASE_URL}/api/delivery-details/${deliveryId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => setDeliveryDetails(response.data))
            .catch((error) => {
                console.error("Lỗi khi lấy số chai:", error);
                setDeliveryDetails([]);
            });
    };
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };
    const handleUpload = async () => {
        if (!selectedFile) {
            setMessage("Vui lòng chọn file trước khi tải lên.");
            setIsError(true);
            return;
        }

        setIsUploading(true); // Bắt đầu loading
        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await axios.post(`${API_BASE_URL}/api/delivery/import`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            setMessage(response.data.message);
            setIsError(false);
            fetchDeliveries();
        } catch (error) {
            setMessage(error.response?.data?.message || "Lỗi khi tải file lên!");
            setIsError(true);
        } finally {
            setIsUploading(false); // Kết thúc loading
        }
    };
    const handleGenerateQRCode = () => {
        setGenerating(true);
        const token = localStorage.getItem("token");
        axios.post(`${API_BASE_URL}/api/qrcode/generate`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => {
                setMessage("QR Codes generated successfully!");
            })
            .catch((error) => {
                console.error("Error generating QR codes:", error);
                setMessage("Failed to generate QR Codes");
            })
            .finally(() => {
                setGenerating(false);
            });
    };
    const handleAddItem = () => {
        setFormData(prevState => ({
            ...prevState,
            items: [...prevState.items, { batch: "", manufacturingDate: "", expireDate: "", itemId: "", quantity: "" }]
        }));
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...formData.items];
        newItems[index][field] = value;
        setFormData(prevState => ({ ...prevState, items: newItems }));
    };

    const handleSubmit = () => {
        const token = localStorage.getItem("token"); // Hoặc sessionStorage.getItem("token")

        axios.post(
            `${API_BASE_URL}/api/delivery/createDelivery`,
            formData,
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        )
            .then(response => {
                alert(response.data);
                setIsModalOpen(false);
                fetchDeliveries();
            })
            .catch(error => {
                console.error("Lỗi khi tạo Delivery:", error);
                alert("Lỗi khi tạo Delivery");
            });
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const handleRemoveItem = (index) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            items: prevFormData.items.filter((_, i) => i !== index),
        }));
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-4">
                <h1 className="text-3xl font-semibold mb-4 text-center">DANH SÁCH GIAO HÀNG</h1>
                <div className="mb-4 p-4 bg-white shadow-lg rounded-lg">
                    <h2 className="text-lg font-semibold mb-2">Upload File Excel</h2>

                    <div className="flex justify-between items-center mb-4">
                        {/* Nhóm input và button upload */}
                        <div className="flex items-center space-x-2">
                            <input
                                type="file"
                                accept=".xlsx"
                                onChange={handleFileChange}
                                className="border rounded px-2 py-1"
                            />
                            <button
                                onClick={handleUpload}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                disabled={isUploading}
                            >
                                {isUploading ? <ClipLoader size={20} color="#ffffff" /> : "Upload"}
                            </button>
                        </div>

                        {/* Logo nằm bên phải */}
                        <Logo />
                    </div>

                    <button
                        onClick={handleGenerateQRCode}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 mb-4 flex items-center justify-center"
                        disabled={generating}>
                        {generating ? <ClipLoader size={20} color="#ffffff" /> : "Generate QR Codes"}
                    </button>
                    <button onClick={() => setIsModalOpen(true)} className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4">Tạo Delivery</button>
                    {message && (
                        <p className={`mt-2 ${isError ? "text-red-500" : "text-green-500"}`}>
                            {message}
                        </p>
                    )}
                    {isModalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white w-1/3 p-6 rounded-lg shadow-lg">
                                <h2 className="text-xl font-semibold mb-4 text-center">Tạo Delivery</h2>

                                {/* Đơn vị tính */}
                                <div className="mb-3">
                                    <label className="block font-medium mb-1">Đơn vị tính:</label>
                                    <input type="text" placeholder="VD: CARTON" value={formData.calculationUnit}
                                        onChange={e => setFormData({ ...formData, calculationUnit: e.target.value })}
                                        className="w-full p-2 border rounded-md"
                                    />
                                </div>

                                {/* Ngày giao hàng */}
                                <div className="mb-3">
                                    <label className="block font-medium mb-1">Ngày giao hàng:</label>
                                    <input type="date" value={formData.deliveryDate}
                                        onChange={e => setFormData({ ...formData, deliveryDate: e.target.value })}
                                        className="w-full p-2 border rounded-md"
                                    />
                                </div>

                                <h3 className="font-semibold mt-4">Danh sách Items:</h3>
                                {formData.items.map((item, index) => (
                                    <div key={index} className="mb-3 p-3 border rounded-md relative">
                                        {/* Batch */}
                                        <div className="mb-2">
                                            <label className="block font-medium mb-1">Mã lô hàng (Batch):</label>
                                            <input type="text" placeholder="VD: BATCH001" value={item.batch}
                                                onChange={e => handleItemChange(index, "batch", e.target.value)}
                                                className="w-full p-2 border rounded-md"
                                            />
                                        </div>

                                        {/* Ngày sản xuất */}
                                        <div className="mb-2">
                                            <label className="block font-medium mb-1">Ngày sản xuất:</label>
                                            <input type="date" value={item.manufacturingDate}
                                                onChange={e => handleItemChange(index, "manufacturingDate", e.target.value)}
                                                className="w-full p-2 border rounded-md"
                                            />
                                        </div>

                                        {/* Hạn sử dụng */}
                                        <div className="mb-2">
                                            <label className="block font-medium mb-1">Hạn sử dụng:</label>
                                            <input type="date" value={item.expireDate}
                                                onChange={e => handleItemChange(index, "expireDate", e.target.value)}
                                                className="w-full p-2 border rounded-md"
                                            />
                                        </div>

                                        {/* Item ID */}
                                        <div className="mb-2">
                                            <label className="block font-medium mb-1">Mã sản phẩm (Item ID):</label>
                                            <input type="number" placeholder="VD: 1, 2, ..." value={item.itemId}
                                                onChange={e => handleItemChange(index, "itemId", e.target.value)}
                                                className="w-full p-2 border rounded-md"
                                            />
                                        </div>

                                        {/* Số lượng */}
                                        <div className="mb-2">
                                            <label className="block font-medium mb-1">Số lượng:</label>
                                            <input type="number" placeholder="Nhập số lượng" value={item.quantity}
                                                onChange={e => handleItemChange(index, "quantity", e.target.value)}
                                                className="w-full p-2 border rounded-md"
                                            />
                                        </div>

                                        {/* Nút Xóa */}
                                        <button
                                            onClick={() => handleRemoveItem(index)}
                                            className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-lg text-sm"
                                        >
                                            ❌
                                        </button>
                                    </div>
                                ))}

                                <button onClick={handleAddItem} className="bg-blue-500 text-white px-3 py-2 rounded-lg w-full mb-3">+ Thêm Item</button>
                                <div className="flex justify-between mt-4">
                                    <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded-lg">Tạo</button>
                                    <button onClick={() => setIsModalOpen(false)} className="bg-red-500 text-white px-4 py-2 rounded-lg">Hủy</button>
                                </div>
                            </div>
                        </div>
                    )}



                </div>
                {/* Form tạo mới */}


                {/* Bảng danh sách Delivery */}
                <div className="overflow-x-auto bg-gray-100 p-4 rounded-lg shadow-lg">
                    <table className="min-w-full table-auto border-collapse bg-white shadow-md rounded-lg">
                        <thead className="bg-blue-500 text-white">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-medium">ID</th>
                                <th className="px-6 py-3 text-left text-sm font-medium">Đơn vị tính</th>
                                <th className="px-6 py-3 text-left text-sm font-medium">Ngày giao hàng</th>
                                <th className="px-6 py-3 text-left text-sm font-medium">Số lượng</th>
                                <th className="px-6 py-3 text-left text-sm font-medium">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deliveries.length > 0 ? (
                                deliveries.map((delivery) => (
                                    <tr key={delivery.deliveryId} className="border-b hover:bg-gray-50 transition-all duration-300">
                                        <td className="px-6 py-4 text-sm text-gray-700">{delivery.deliveryId}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{delivery.calculationUnit}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{delivery.deliveryDate}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{delivery.quantity}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <button
                                                onClick={() => fetchDetails(delivery.deliveryId)}
                                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mr-2"
                                            >
                                                Detail
                                            </button>
                                            <button
                                                className="bg-green-500 text-white px-3 py-1 rounded"
                                                onClick={() => navigate(`/qrcode/${delivery.deliveryId}`)}
                                            >
                                                View QR Codes
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                        Không có dữ liệu
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Hiển thị chi tiết MasterDataDelivery */}
                {selectedDelivery && (
                    <div className="mt-6 p-4 bg-white shadow-lg rounded-lg">
                        <h2 className="text-xl font-semibold text-center mb-4">
                            Chi tiết cho Delivery ID: {selectedDelivery}
                        </h2>
                        <table className="min-w-full table-auto border-collapse bg-gray-100 shadow-md rounded-lg">
                            <thead className="bg-gray-500 text-white">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-medium">Item</th>

                                    <th className="px-6 py-3 text-left text-sm font-medium">Tên sản phẩm</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium">Số lượng</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium">Ngày sản xuất</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium">Ngày hết hạn</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium">Lô hàng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {masterDataDetails.length > 0 ? (
                                    masterDataDetails.map((data, index) => (
                                        <tr key={index} className="border-b hover:bg-gray-50 transition-all duration-300">
                                            <td className="px-6 py-4 text-sm text-gray-700">{data.item}</td>

                                            <td className="px-6 py-4 text-sm text-gray-700">{data.masterDataName}</td>
                                            <td className="px-6 py-4 text-sm text-gray-700">{data.quantity}</td>
                                            <td className="px-6 py-4 text-sm text-gray-700">{data.manufacturingDate}</td>
                                            <td className="px-6 py-4 text-sm text-gray-700">{data.expirationDate}</td>
                                            <td className="px-6 py-4 text-sm text-gray-700">{data.batch}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                            Không có dữ liệu
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}


                {/* Hiển thị danh sách số chai */}
                {deliveryDetails.length > 0 && (
                    <div className="mt-6 p-4 bg-white shadow-lg rounded-lg">
                        <h2 className="text-xl font-semibold text-center mb-4">Số chai của Delivery ID: {selectedDelivery}</h2>
                        <table className="min-w-full table-auto border-collapse bg-gray-100 shadow-md rounded-lg">
                            <thead className="bg-green-500 text-white">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-medium">Item</th>

                                    <th className="px-6 py-3 text-left text-sm font-medium">Tên sản phẩm</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium">Số lượng</th>

                                    <th className="px-6 py-3 text-left text-sm font-medium">Lô hàng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deliveryDetails.map((detail, index) => (
                                    <tr key={index} className="border-b hover:bg-gray-50 transition-all duration-300">
                                        <td className="px-6 py-4 text-sm text-gray-700">{detail.item}</td>

                                        <td className="px-6 py-4 text-sm text-gray-700">{detail.masterDataName}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{detail.quantity}</td>

                                        <td className="px-6 py-4 text-sm text-gray-700">{detail.batch}</td>
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

export default DeliveryPage;
