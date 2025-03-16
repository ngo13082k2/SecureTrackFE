import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";

const DeliveryQRCode = () => {
    const { deliveryId } = useParams();
    const [qrCodes, setQrCodes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token"); // Hoặc sessionStorage
        axios.get(`${API_BASE_URL}/api/qrcode/delivery/${deliveryId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                setQrCodes(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching QR codes:", error);
                setLoading(false);
            });
    }, [deliveryId]);

    if (loading) return <p>Loading...</p>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">QR Codes for Delivery {deliveryId}</h1>
            <div className="grid grid-cols-3 gap-4">
                {qrCodes.length > 0 ? (
                    qrCodes.map((qr, index) => (
                        <div key={index} className="p-4 bg-white shadow-lg rounded-lg text-center">
                            <img src={`data:image/png;base64,${qr.qrCodeImage}`} alt="QR Code" className="mx-auto w-32 h-32" />
                            <p className="mt-2 text-sm font-medium">{qr.qrCode}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">Không có QR Code nào!</p>
                )}
            </div>
        </div>
    );
};

export default DeliveryQRCode;
