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
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
