import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login/Login"
import MasterDataPage from "./MasterData/MasterDataPage";
import DeliveryPage from "./Delivery/DeliveryPage";
import DeliveryQRCode from "./DeliveryQRCode/DeliveryQRCode";
import OrderDetail from "./OrderDetail/OrderDetail";
import OrderList from "./OrderList/OrderList";
import CustomerPage from "./CustomerPage/CustomerPage";
import OutboundPage from "./OutboundPage/OutboundPage";
import InboundPage from "./InboundPage/InboundPage";
import InventoryPage from "./InventoryPage/InventoryPage";
const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/masterData" element={<MasterDataPage />} />
        <Route path="/delivery" element={<DeliveryPage />} />
        <Route path="/qrcode/:deliveryId" element={<DeliveryQRCode />} />
        <Route path="/order" element={<OrderDetail />} />
        <Route path="/orderlist" element={<OrderList />} />
        <Route path="/customer" element={<CustomerPage />} />
        <Route path="/outbound" element={<OutboundPage />} />
        <Route path="/inbound" element={<InboundPage />} />
        <Route path="/inventory" element={<InventoryPage />} />


      </Routes>
    </Router>
  );
};

export default AppRoutes;
