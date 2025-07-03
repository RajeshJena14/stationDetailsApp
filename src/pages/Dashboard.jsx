import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
    const [division, setDivision] = useState('Khordha');
    const navigate = useNavigate();

    const handleDivisionChange = (e) => {
        const selected = e.target.value;
        setDivision(selected);
        localStorage.setItem('selectedZone', selected); 
        if (e.target.value === 'Khordha') {
            navigate('/khordha');
        }
    };

    return (
        <div className="dashboard-content">
            <h3>Choose your Division</h3>
            <select value={division} onChange={handleDivisionChange}>
                <option value="Khordha">Khordha</option>
                <option value="Waltier">Waltier</option>
                <option value="Sambalpur">Sambalpur</option>
            </select>
        </div>
    );
}

export default Dashboard;