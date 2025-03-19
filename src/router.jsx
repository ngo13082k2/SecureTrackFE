import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login/Login"
import MasterDataPage from "./MasterData/MasterDataPage";
import DeliveryPage from "./Delivery/DeliveryPage";
import DeliveryQRCode from "./DeliveryQRCode/DeliveryQRCode";
import OrderDetail from "./OrderDetail/OrderDetail";
import OrderList from "./OrderList/OrderList";
import CustomerPage from "./CustomerPage/CustomerPage";
const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/masterData" element={<MasterDataPage />} />
        <Route path="/delivery" element={<DeliveryPage />} />
        <Route path="/qrcode/:deliveryId" element={<DeliveryQRCode />} />
        <Route path="/order" element={<OrderDetail />} />
        <Route path="/orderlist" element={<OrderList />} />
        <Route path="/customer" element={<CustomerPage />} />

      </Routes>
    </Router>
  );
};

export default AppRoutes;
