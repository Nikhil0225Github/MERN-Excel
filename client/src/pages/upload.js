import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const Upload = () => {
    const [file, setFile] = useState(null);
    const [parsedData, setParsedData] = useState(null);
    const { token } = useSelector((state) => state.auth);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await axios.post('http://localhost:5000/api/upload/upload', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            setParsedData(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl mb-4">Upload Excel File</h2>
            <form onSubmit={handleUpload}>
                <input type="file" onChange={handleFileChange} className="mb-4" />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                    Upload
                </button>
            </form>
            {parsedData && (
                <div className="mt-4">
                    <h3>Parsed Data:</h3>
                    <pre>{JSON.stringify(parsedData, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default Upload;