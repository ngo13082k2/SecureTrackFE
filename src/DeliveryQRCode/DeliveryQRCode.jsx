import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";

const ITEMS_PER_PAGE = 42; // Số QR Codes mỗi trang

const DeliveryQRCode = () => {
    const { deliveryId } = useParams();
    const [groupedQrCodes, setGroupedQrCodes] = useState([]); // Lưu QR Codes theo sản phẩm & batch
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchQRCodeData();
    }, [deliveryId]);

    const fetchQRCodeData = () => {
        setLoading(true);
        const token = localStorage.getItem("token");

        axios.get(`${API_BASE_URL}/api/qrcode/delivery/${deliveryId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => {
                if (response.status === 200) {
                    setGroupedQrCodes(response.data);
                } else {
                    console.error("Lỗi dữ liệu không hợp lệ:", response);
                    setGroupedQrCodes([]);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error("Lỗi khi lấy QR codes:", error);
                setGroupedQrCodes([]);
                setLoading(false);
            });
    };

    if (loading) return <p className="text-center text-gray-500">Đang tải...</p>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">
                QR Codes cho Delivery {deliveryId}
            </h1>

            {groupedQrCodes.length > 0 ? (
                groupedQrCodes.map((group, index) => {
                    // Chia nhóm QR Codes thành từng phần nhỏ (mỗi phần 30 mã)
                    const pages = [];
                    for (let i = 0; i < group.qrCodes.length; i += ITEMS_PER_PAGE) {
                        pages.push(group.qrCodes.slice(i, i + ITEMS_PER_PAGE));
                    }

                    return (
                        <div key={index}>
                            {pages.map((qrPage, pageIndex) => (
                                <div
                                    key={pageIndex}
                                    className="mb-6 print-page-break-before"
                                    style={{ breakInside: 'avoid' }} // 👈 Không bị tách ra giữa trang in
                                >
                                    {/* Tiêu đề sản phẩm */}
                                    <div className="mb-2">
                                        <h2 className="text-lg font-semibold text-center">
                                            Sản phẩm: {group.productName} (ID: {group.itemId}) Batch: {group.batch} - Trang {pageIndex + 1}
                                        </h2>
                                    </div>

                                    {/* Grid chứa QR Code */}
                                    <div className="grid grid-cols-6 gap-4 mt-4">
                                        {qrPage.map((qr, qrIndex) => (
                                            <div key={qrIndex} className="p-4 bg-white rounded-lg text-center">
                                                <img
                                                    src={`data:image/png;base64,${qr.qrCodeImage}`}
                                                    alt="QR Code"
                                                    className="mx-auto w-32 h-32"
                                                />
                                                <p className="mt-1 text-sm font-medium">{qr.qrCode}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    );

                })
            ) : (
                <p className="text-center text-gray-500">Không có QR Code nào!</p>
            )}
        </div>
    );
};

export default DeliveryQRCode;
