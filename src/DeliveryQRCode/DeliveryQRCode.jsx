import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";

const DeliveryQRCode = () => {
    const { deliveryId } = useParams();
    const [groupedQrCodes, setGroupedQrCodes] = useState([]); // Lưu QR Codes theo sản phẩm & batch
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([]); // Danh sách sản phẩm
    const [selectedItem, setSelectedItem] = useState(null); // Sản phẩm đang chọn

    useEffect(() => {
        const token = localStorage.getItem("token");

        // Gọi API lấy danh sách sản phẩm & batch
        axios.get(`${API_BASE_URL}/api/masterDataDelivery/delivery/${deliveryId}/items`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then((response) => {
            setItems(response.data);
            if (response.data.length > 0) {
                fetchQRCode(response.data[0]); // Gọi API cho sản phẩm đầu tiên
            } else {
                setLoading(false);
            }
        })
        .catch((error) => {
            console.error("Error fetching items:", error);
            setLoading(false);
        });
    }, [deliveryId]);

    // Gọi API lấy QR Codes theo sản phẩm & batch
    const fetchQRCode = (item) => {
        setLoading(true);
        setSelectedItem(item);
        const token = localStorage.getItem("token");
    
        axios.get(`${API_BASE_URL}/api/qrcode/delivery/getByItemAndBatch/${deliveryId}`, {
            params: { itemId: item.itemId, batch: item.batch },
            headers: { Authorization: `Bearer ${token}` }
        })
        .then((response) => {
            if (response.status === 200) {
                setGroupedQrCodes(response.data); // Cập nhật danh sách QR Code
            } else {
                console.error("Lỗi dữ liệu không hợp lệ:", response);
                setGroupedQrCodes([]);
            }
            setLoading(false);
        })
        .catch((error) => {
            if (error.response && error.response.status === 403) {
                alert("Bạn không có quyền truy cập vào dữ liệu này!"); // Hoặc chuyển hướng trang
            } else {
                console.error("Lỗi khi lấy QR codes:", error);
            }
            setGroupedQrCodes([]); // Xóa dữ liệu cũ khi lỗi
            setLoading(false);
        });
    };
    

    if (loading) return <p className="text-center text-gray-500">Đang tải...</p>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">
                QR Codes cho Delivery {deliveryId}
            </h1>

            {/* Danh sách sản phẩm dạng button */}
            <div className="flex flex-wrap gap-2 justify-center mb-6">
                {items.map((item, index) => (
                    <button
                        key={index}
                        className={`px-4 py-2 rounded-lg text-white ${selectedItem?.itemId === item.itemId && selectedItem?.batch === item.batch ? "bg-blue-600" : "bg-gray-500"} hover:bg-blue-700 transition`}
                        onClick={() => fetchQRCode(item)}
                    >
                        {item.productName} (Batch: {item.batch})
                    </button>
                ))}
            </div>

            {/* Hiển thị QR Codes */}
            {groupedQrCodes.length > 0 ? (
                groupedQrCodes.map((group, index) => (
                    <div key={index} className="print-page-break">
                        <div className="print-header">
                            <h2 className="text-xl font-semibold mb-2">
                                Sản phẩm: {group.productName} (ID: {group.itemId})
                            </h2>
                            <h3 className="text-md text-gray-600 mb-4">
                                Batch: {group.batch}
                            </h3>
                        </div>

                        <div className="grid grid-cols-6 gap-4">
                            {group.qrCodes.map((qr, qrIndex) => (
                                <div key={qrIndex} className="p-4 bg-white shadow-lg rounded-lg text-center">
                                    <img 
                                        src={`data:image/png;base64,${qr.qrCodeImage}`} 
                                        alt="QR Code" 
                                        className="mx-auto w-32 h-32"
                                    />
                                    <p className="mt-2 text-sm font-medium">{qr.qrCode}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-500">Không có QR Code nào!</p>
            )}
        </div>
    );
};

export default DeliveryQRCode;
