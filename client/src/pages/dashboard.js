import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [uploads, setUploads] = useState([]);
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchUploads = async () => {
            const res = await axios.get('http://localhost:5000/api/upload/history', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUploads(res.data);
        };
        fetchUploads();
    }, [token]);

    return (
        <div className="p-6">
            <h2 className="text-2xl mb-4">Dashboard</h2>
            <Link to="/upload" className="bg-blue-500 text-white p-2 rounded mb-4 inline-block">
                Upload New File
            </Link>
            <h3 className="text-xl mb-2">Upload History</h3>
            <ul>
                {uploads.map((upload) => (
                    <li key={upload._id} className="p-2 border-b">
                        {upload.filename} - {new Date(upload.createdAt).toLocaleDateString()}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;