import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <div className="w-64 bg-gray-800 text-white h-screen">
            <div className="p-4">
                <h2 className="text-xl font-semibold">Menu</h2>
                <ul className="mt-4">
                    <li>
                        <Link to="/masterData" className="block py-2 px-4 hover:bg-gray-700">Master Data</Link>
                    </li>
                    <li>
                        <Link to="/delivery" className="block py-2 px-4 hover:bg-gray-700">Delivery</Link>
                    </li>
                    <li>
                        <Link to="/order" className="block py-2 px-4 hover:bg-gray-700">Order</Link>
                    </li>
                    <li>
                        <Link to="/orderlist" className="block py-2 px-4 hover:bg-gray-700">OrderList</Link>
                    </li>
                    <li>
                        <Link to="/customer" className="block py-2 px-4 hover:bg-gray-700">Customer</Link>
                    </li>
                    <li>
                        <Link to="/outbound" className="block py-2 px-4 hover:bg-gray-700">Outbound</Link>
                    </li>
                    <li>
                        <Link to="/inbound" className="block py-2 px-4 hover:bg-gray-700">Inbound</Link>
                    </li>
                    <li>
                        <Link to="/inventory" className="block py-2 px-4 hover:bg-gray-700">Inventory</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
