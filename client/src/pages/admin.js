import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [uploads, setUploads] = useState([]);
    const { token, role } = useSelector((state) => state.auth);

    useEffect(() => {
        if (role !== 'admin') return;
        const fetchData = async () => {
            const usersRes = await axios.get('http://localhost:5000/api/admin/users', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const uploadsRes = await axios.get('http://localhost:5000/api/admin/uploads', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(usersRes.data);
            setUploads(uploadsRes.data);
        };
        fetchData();
    }, [token, role]);

    if (role !== 'admin') return <div>Access Denied</div>;

    return (
        <div className="p-6">
            <h2 className="text-2xl mb-4">Admin Panel</h2>
            <h3 className="text-xl mb-2">Users</h3>
            <ul>
                {users.map((user) => (
                    <li key={user._id} className="p-2 border-b">
                        {user.username} - {user.role}
                    </li>
                ))}
            </ul>
            <h3 className="text-xl mb-2 mt-4">Uploads</h3>
            <ul>
                {uploads.map((upload) => (
                    <li key={upload._id} className="p-2 border-b">
                        {upload.filename} by {upload.userId.username} -{' '}
                        {new Date(upload.createdAt).toLocaleDateString()}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminPanel;