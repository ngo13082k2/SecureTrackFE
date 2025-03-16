import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login/Login"
import MasterDataPage from "./MasterData/MasterDataPage";
import DeliveryPage from "./Delivery/DeliveryPage";
import DeliveryQRCode from "./DeliveryQRCode/DeliveryQRCode";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/masterData" element={<MasterDataPage />} />
        <Route path="/delivery" element={<DeliveryPage />} />
        <Route path="/qrcode/:deliveryId" element={<DeliveryQRCode />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
