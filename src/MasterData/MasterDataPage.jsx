import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from "../config";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; import Sidebar from '../component/sidebar';

const MasterDataPage = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [file, setFile] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [updateData, setUpdateData] = useState({ name: "", spec: "", per: "", calculationUnit: "" });
    const [isCreating, setIsCreating] = useState(false);
    const [newData, setNewData] = useState({ item: "", name: "", spec: "", per: "", calculationUnit: "" });
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        const loginSuccess = localStorage.getItem("loginSuccess");
        if (loginSuccess === "true") {
            toast.success("🎉 Đăng nhập thành công!"); // ✅ chỉ toast ở đây
            setTimeout(() => {
                localStorage.removeItem("loginSuccess");
              }, 500);        }

        fetchData();
    }, [token, navigate]);

    const fetchData = () => {
        axios
            .get(`${API_BASE_URL}/api/master-data`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => setData(response.data.data))
            .catch((error) => console.error('Lỗi khi gọi API:', error));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`${API_BASE_URL}/api/master-data/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
            alert(response.data.message);
            fetchData();
        } catch (error) {
            alert('Lỗi khi tải lên file!');
            console.error(error);
        }
    };

    const handleEditClick = (item) => {
        setSelectedItem(item);
        setUpdateData({
            name: item.name,
            spec: item.spec,
            per: item.per,
            calculationUnit: item.calculationUnit
        });
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`${API_BASE_URL}/api/master-data/${selectedItem.item}`, updateData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Cập nhật thành công!");
            setSelectedItem(null);
            fetchData();
        } catch (error) {
            alert("Lỗi khi cập nhật!");
            console.error(error);
        }
    };
    const handleCreate = async () => {
        try {
            await axios.post(`${API_BASE_URL}/api/master-data`, newData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Tạo mới thành công!");
            setIsCreating(false);
            fetchData();
        } catch (error) {
            alert("Lỗi khi tạo mới!");
            console.error(error);
        }
    };
    return (
        <div className="flex">
            <ToastContainer position="top-right" autoClose={3000} />

            <Sidebar />
            <div className="flex-1 p-4">
                <h1 className="text-3xl font-semibold mb-4 text-center">Danh sách Master Data</h1>
                <div className="mb-4 flex justify-center">
                    <input type="file" accept=".xlsx" onChange={handleFileChange} className="mr-2 p-2 border border-gray-300 rounded-md" />
                    <button onClick={handleUpload} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Tải lên</button>
                    <button onClick={() => setIsCreating(true)} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">Tạo mới</button>

                </div>

                <div className="overflow-x-auto bg-gray-100 p-4 rounded-lg shadow-lg">
                    <table className="min-w-full table-auto border border-gray-300 bg-white shadow-md rounded-lg">
                        <thead className="bg-blue-500 text-white">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium border border-gray-300">Item</th>
                                <th className="px-4 py-3 text-left text-sm font-medium border border-gray-300">Name</th>
                                <th className="px-4 py-3 text-left text-sm font-medium border border-gray-300">Spec</th>
                                <th className="px-4 py-3 text-left text-sm font-medium border border-gray-300">Per</th>
                                <th className="px-4 py-3 text-left text-sm font-medium border border-gray-300">Calculation Unit</th>
                                <th className="px-4 py-3 text-center text-sm font-medium border border-gray-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {data.map((item) => (
                                <tr key={item.item} className="hover:bg-gray-50 transition-all duration-300">
                                    <td className="px-4 py-3 text-sm text-gray-700 border border-gray-300">{item.item}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700 border border-gray-300">{item.name}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700 border border-gray-300">{item.spec}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700 border border-gray-300">{item.per}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700 border border-gray-300">{item.calculationUnit}</td>
                                    <td className="px-4 py-3 text-center border border-gray-300">
                                        <button onClick={() => handleEditClick(item)} className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">
                                            Cập nhật
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>

                {selectedItem && (
                    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                            <h2 className="text-lg font-semibold mb-4">Cập nhật dữ liệu</h2>

                            <label className="block text-sm font-medium text-gray-700">Item</label>
                            <input type="text" value={selectedItem.item} disabled className="block w-full p-2 border rounded-md mb-2 bg-gray-200 text-gray-700" />

                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input type="text" value={updateData.name} onChange={(e) => setUpdateData({ ...updateData, name: e.target.value })} className="block w-full p-2 border rounded-md mb-2" />

                            <label className="block text-sm font-medium text-gray-700">Spec</label>
                            <input type="text" value={updateData.spec} onChange={(e) => setUpdateData({ ...updateData, spec: e.target.value })} className="block w-full p-2 border rounded-md mb-2" />

                            <label className="block text-sm font-medium text-gray-700">Per</label>
                            <input type="text" value={updateData.per} onChange={(e) => setUpdateData({ ...updateData, per: e.target.value })} className="block w-full p-2 border rounded-md mb-2" />

                            <label className="block text-sm font-medium text-gray-700">Calculation Unit</label>
                            <input type="text" value={updateData.calculationUnit} onChange={(e) => setUpdateData({ ...updateData, calculationUnit: e.target.value })} className="block w-full p-2 border rounded-md mb-2" />

                            <div className="flex justify-end space-x-2 mt-4">
                                <button onClick={() => setSelectedItem(null)} className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500">Hủy</button>
                                <button onClick={handleUpdate} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">Lưu</button>
                            </div>
                        </div>
                    </div>
                )}
                {isCreating && (
                    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                            <h2 className="text-lg font-semibold mb-4">Tạo mới dữ liệu</h2>

                            <label className="block text-sm font-medium text-gray-700">Item</label>
                            <input type="text" value={newData.item} onChange={(e) => setNewData({ ...newData, item: e.target.value })} className="block w-full p-2 border rounded-md mb-2" />

                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input type="text" value={newData.name} onChange={(e) => setNewData({ ...newData, name: e.target.value })} className="block w-full p-2 border rounded-md mb-2" />

                            <label className="block text-sm font-medium text-gray-700">Spec</label>
                            <input type="text" value={newData.spec} onChange={(e) => setNewData({ ...newData, spec: e.target.value })} className="block w-full p-2 border rounded-md mb-2" />

                            <label className="block text-sm font-medium text-gray-700">Per</label>
                            <input type="text" value={newData.per} onChange={(e) => setNewData({ ...newData, per: e.target.value })} className="block w-full p-2 border rounded-md mb-2" />

                            <label className="block text-sm font-medium text-gray-700">Calculation Unit</label>
                            <input type="text" value={newData.calculationUnit} onChange={(e) => setNewData({ ...newData, calculationUnit: e.target.value })} className="block w-full p-2 border rounded-md mb-2" />

                            <div className="flex justify-end space-x-2 mt-4">
                                <button onClick={() => setIsCreating(false)} className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500">Hủy</button>
                                <button onClick={handleCreate} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">Lưu</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
};

export default MasterDataPage;
