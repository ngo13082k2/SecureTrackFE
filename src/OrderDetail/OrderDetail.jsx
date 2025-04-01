import { useState } from "react";
import { useZxing } from "react-zxing";
import axios from "axios";
import API_BASE_URL from "../config";
import Sidebar from "../component/sidebar";
const OrderDetail = () => {
    const [qrCodes, setQrCodes] = useState([]);
    const [customer, setCustomer] = useState({
        phoneNumber: "",
        customerName: "",
        province: "",
        district: "",
        ward: "",
        street: "",
        addressDetail: "",
    });

    const [loading, setLoading] = useState(false);

    // Xử lý quét QR Code
    const { ref } = useZxing({
        onDecodeResult(result) {
            console.log("Dữ liệu quét được:", result.text);
            const match = result.text.match(/QR\s?Code:\s*([^\s]+)/i);
            if (match) {
                const qrCode = match[1].trim();
                if (!qrCodes.includes(qrCode)) {
                    setQrCodes([...qrCodes, qrCode]);
                }
            }
        },
    });

    // Gọi API khi nhấn nút "Tìm kiếm"
    const handleSearchCustomer = async () => {
        if (!customer.phoneNumber.trim()) {
            alert("Vui lòng nhập số điện thoại để tìm kiếm.");
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.get(`${API_BASE_URL}/customers/search`, {
                params: { phoneNumber: customer.phoneNumber.trim() },
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 200 && response.data) {
                setCustomer({
                    phoneNumber: response.data.phoneNumber || "",
                    customerName: response.data.customerName || "",
                    province: response.data.province || "",
                    district: response.data.district || "",
                    ward: response.data.ward || "",
                    street: response.data.street || "",
                    addressDetail: response.data.detailAddress || "",
                });
            } else {
                alert("Không tìm thấy khách hàng.");
            }
        } catch (error) {
            console.error("Lỗi khi tìm kiếm khách hàng:", error);
            alert("Không tìm thấy khách hàng.");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setCustomer({ ...customer, [e.target.name]: e.target.value });
    };

    const handleDeleteQr = (index) => {
        setQrCodes(qrCodes.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!customer.phoneNumber || !customer.customerName || qrCodes.length === 0) {
            alert("Vui lòng nhập đầy đủ thông tin khách hàng và quét ít nhất một QR!");
            return;
        }

        const requestData = {
            phoneNumber: customer.phoneNumber,
            customerName: customer.customerName,
            province: customer.province,
            district: customer.district,
            ward: customer.ward,
            street: customer.street,
            addressDetail: customer.addressDetail,
            qrCodes,
        };

        console.log("Dữ liệu gửi lên BE:", JSON.stringify(requestData, null, 2));

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Bạn chưa đăng nhập. Vui lòng đăng nhập lại.");
                return;
            }

            const response = await axios.post(`${API_BASE_URL}/api/orders`, requestData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            alert("Đơn hàng được tạo thành công! ID: " + response.data.id);
            setQrCodes([]);
            setCustomer({
                phoneNumber: "",
                customerName: "",
                province: "",
                district: "",
                ward: "",
                street: "",
                addressDetail: "",
            });

        } catch (error) {
            console.error("Lỗi khi tạo đơn hàng:", error);
            alert("Có lỗi xảy ra khi tạo đơn hàng.");
        }
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar bên trái */}
            <Sidebar />
            <div className="flex-1  mt-8 p-6 bg-white shadow-lg rounded-lg overflow-auto">
                {/* Cột nhập thông tin khách hàng */}
                <div className="flex w-full gap-6">
                <div className="flex flex-col bg-white p-6 rounded-lg shadow-lg w-1/2">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Thông tin khách hàng</h2>

                    <div className="space-y-3">
                        <div className="flex gap-2">
                            <input
                                type="text" name="phoneNumber" placeholder="Số điện thoại"
                                value={customer.phoneNumber} onChange={handleInputChange}
                                className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={handleSearchCustomer}
                                className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition duration-300"
                                disabled={loading}
                            >
                                {loading ? "Đang tìm..." : "Tìm kiếm"}
                            </button>
                        </div>

                        <input
                            type="text" name="customerName" placeholder="Tên khách hàng"
                            value={customer.customerName} onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                type="text" name="province" placeholder="Tỉnh"
                                value={customer.province} onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="text" name="district" placeholder="Huyện"
                                value={customer.district} onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                type="text" name="ward" placeholder="Xã/Phường"
                                value={customer.ward} onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="text" name="street" placeholder="Đường"
                                value={customer.street} onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <input
                            type="text" name="addressDetail" placeholder="Chi tiết địa chỉ"
                            value={customer.addressDetail} onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="w-full mt-4 bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                        Tạo đơn hàng
                    </button>
                </div>

                {/* Cột quét QR */}
                <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg w-1/2">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Quét QR Code</h2>
                    <div className="flex justify-center border border-gray-300 rounded-lg p-2">
                        <video ref={ref} className="w-100 h-100 border border-black rounded-lg" />
                    </div>

                    <h3 className="mt-4 text-lg font-medium text-gray-700">Danh sách QR Codes đã quét:</h3>
                    <ul className="mt-2 w-full max-h-40 overflow-auto bg-gray-100 p-3 rounded-lg">
                        {qrCodes.map((code, idx) => (
                            <li key={idx} className="text-gray-700 text-sm p-1 border-b flex justify-between">
                                {code} <button onClick={() => handleDeleteQr(idx)} className="text-red-500 font-bold">X</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
        </div>
    );
};

export default OrderDetail;
