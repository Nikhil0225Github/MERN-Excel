import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Chart = () => {
    const [uploads, setUploads] = useState([]);
    const [selectedUpload, setSelectedUpload] = useState(null);
    const [xAxis, setXAxis] = useState('');
    const [yAxis, setYAxis] = useState('');
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

    const handleSelectUpload = (upload) => {
        setSelectedUpload(upload);
    };

    const data = selectedUpload
        ? {
              labels: selectedUpload.data.map((row) => row[xAxis]),
              datasets: [
                  {
                      label: yAxis,
                      data: selectedUpload.data.map((row) => row[yAxis]),
                      backgroundColor: 'rgba(75, 192, 192, 0.6)',
                  },
              ],
          }
        : {};

    return (
        <div className="p-6">
            <h2 className="text-2xl mb-4">Generate Charts</h2>
            <select onChange={(e) => handleSelectUpload(uploads[e.target.value])} className="mb-4 p-2 border rounded">
                <option>Select an upload</option>
                {uploads.map((upload, index) => (
                    <option key={upload._id} value={index}>
                        {upload.filename}
                    </option>
                ))}
            </select>
            {selectedUpload && (
                <div>
                    <div className="mb-4">
                        <label className="mr-2">X-Axis:</label>
                        <select onChange={(e) => setXAxis(e.target.value)} className="p-2 border rounded">
                            <option>Select X-Axis</option>
                            {Object.keys(selectedUpload.data[0]).map((key) => (
                                <option key={key} value={key}>
                                    {key}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="mr-2">Y-Axis:</label>
                        <select onChange={(e) => setYAxis(e.target.value)} className="p-2 border rounded">
                            <option>Select Y-Axis</option>
                            {Object.keys(selectedUpload.data[0]).map((key) => (
                                <option key={key} value={key}>
                                    {key}
                                </option>
                            ))}
                        </select>
                    </div>
                    {xAxis && yAxis && (
                        <>
                            <h3 className="text-xl mb-2">2D Chart (Bar)</h3>
                            <Bar data={data} />
                            <h3 className="text-xl mb-2 mt-4">3D Chart</h3>
                            <Canvas style={{ height: '400px' }}>
                                <OrbitControls />
                                <ambientLight intensity={0.5} />
                                {selectedUpload.data.map((row, i) => (
                                    <mesh key={i} position={[i, row[yAxis] / 10, 0]}>
                                        <boxGeometry args={[0.5, row[yAxis] / 10, 0.5]} />
                                        <meshStandardMaterial color="blue" />
                                        <Text position={[0, row[yAxis] / 10 + 0.5, 0]} fontSize={0.5}>
                                            {row[xAxis]}
                                        </Text>
                                    </mesh>
                                ))}
                            </Canvas>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default Chart;