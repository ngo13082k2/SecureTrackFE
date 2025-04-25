import React from 'react';
import { NavLink } from 'react-router-dom';

const SidebarForBoss = () => {
  const menuItems = [
  
    { to: "/OutboundPageSumarry", label: "Outbound" },
    { to: "/InboundPageSumarry", label: "Inbound" },
    { to: "/InventorySummarry", label: "Inventory" },
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

export default SidebarForBoss;
