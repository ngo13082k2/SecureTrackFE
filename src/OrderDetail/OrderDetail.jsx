import { useState } from "react";
import { useZxing } from "react-zxing";
import axios from "axios";
import API_BASE_URL from "../config";

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

    // Xử lý quét QR Code
    const { ref } = useZxing({
        onDecodeResult(result) {
            console.log("Dữ liệu quét được:", result.text);

            const match = result.text.match(/QR\s?Code:\s*([^\s]+)/i);
            if (match) {
                const qrCode = match[1].trim();

                if (!qrCodes.includes(qrCode)) {
                    if (window.confirm(`Xác nhận thêm QR: ${qrCode} vào đơn hàng?`)) {
                        setQrCodes([...qrCodes, qrCode]);
                    }
                }
            } else {
                alert("Dữ liệu quét không hợp lệ! Vui lòng thử lại.");
            }
        },
    });

    const handleInputChange = (e) => {
        setCustomer({ ...customer, [e.target.name]: e.target.value });
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
            qrCodes: qrCodes.length > 0 ? qrCodes : [],
        };

        console.log("Dữ liệu gửi lên BE:", JSON.stringify(requestData, null, 2));

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Bạn chưa đăng nhập. Vui lòng đăng nhập lại.");
                return;
            }

            const response = await axios.post(
                `${API_BASE_URL}/api/orders`,
                requestData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

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
            console.log(error.response?.data);
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", gap: "20px", padding: "20px" }}>
            {/* Cột nhập thông tin khách hàng */}
            <div style={{ flex: 1, padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
                <h2>Thông tin khách hàng</h2>
                <input type="text" name="phoneNumber" placeholder="Số điện thoại" value={customer.phoneNumber} onChange={handleInputChange} />
                <input type="text" name="customerName" placeholder="Tên khách hàng" value={customer.customerName} onChange={handleInputChange} />
                <input type="text" name="province" placeholder="Tỉnh" value={customer.province} onChange={handleInputChange} />
                <input type="text" name="district" placeholder="Huyện" value={customer.district} onChange={handleInputChange} />
                <input type="text" name="ward" placeholder="Xã/Phường" value={customer.ward} onChange={handleInputChange} />
                <input type="text" name="street" placeholder="Đường" value={customer.street} onChange={handleInputChange} />
                <input type="text" name="addressDetail" placeholder="Chi tiết địa chỉ" value={customer.addressDetail} onChange={handleInputChange} />
                
                <button onClick={handleSubmit} style={{ marginTop: "10px", padding: "10px", background: "blue", color: "white", border: "none" }}>
                    Tạo đơn hàng
                </button>
            </div>

            {/* Cột quét QR */}
            <div style={{ flex: 1, padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
                <h2>Quét QR Code</h2>
                <video ref={ref} style={{ width: "50%", border: "1px solid black" }} />
                
                <h3>Danh sách QR Codes đã quét:</h3>
                <ul>
                    {qrCodes.map((code, idx) => (
                        <li key={idx}>{code}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default OrderDetail;
