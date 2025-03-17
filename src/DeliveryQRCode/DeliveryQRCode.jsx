import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";

const DeliveryQRCode = () => {
    const { deliveryId } = useParams();
    const [groupedQrCodes, setGroupedQrCodes] = useState([]); // Dữ liệu nhóm theo itemId
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");

        axios.get(`${API_BASE_URL}/api/qrcode/delivery/${deliveryId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((response) => {
            setGroupedQrCodes(response.data); // API mới trả về danh sách nhóm QR codes theo item
            setLoading(false);
        })
        .catch((error) => {
            console.error("Lỗi khi lấy QR codes:", error);
            setLoading(false);
        });
    }, [deliveryId]);

    if (loading) return <p className="text-center text-gray-500">Đang tải...</p>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">
                QR Codes cho Delivery {deliveryId}
            </h1>
            {groupedQrCodes.length > 0 ? (
                groupedQrCodes.map((group, index) => (
                    <div key={index} className="print-page-break">
                        {/* Phần Tiêu Đề (Luôn Giữ Khi In) */}
                        <div className="print-header">
                            <h2 className="text-xl font-semibold mb-2">
                                Sản phẩm: {group.productName} (ID: {group.itemId})
                            </h2>
                        </div>
    
                        {/* Danh sách QR Code */}
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
