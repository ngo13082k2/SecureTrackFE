import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const menuItems = [
    { to: "/masterData", label: "Master Data" },
    { to: "/delivery", label: "Delivery" },
    { to: "/order", label: "Order" },
    { to: "/orderlist", label: "OrderList" },
    { to: "/customer", label: "Customer" },
    { to: "/outbound", label: "Outbound" },
    { to: "/inbound", label: "Inbound" },
    { to: "/inventory", label: "Inventory" },
  ];

  return (
    <div className="w-64 bg-gray-700 text-white h-screen">
      <div className="p-4">
        <h2 className="text-xl font-semibold">Menu</h2>
        <ul className="mt-4">
          {menuItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `block py-2 px-4 hover:bg-gray-700 transition duration-200 ${
                    isActive ? "bg-gray-900 font-bold" : ""
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
