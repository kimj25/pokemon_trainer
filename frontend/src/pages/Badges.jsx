import React, { useState, useEffect } from 'react';

function Badges({ backendURL }) {
    const [badges, setBadges] = useState([]);
    const [formData, setFormData] = useState({
        badgeName: '',
        gymLocation: ''
    });

    const getData = async () => {
        try {
            const response = await fetch(`${backendURL}/api/badges`);
            const data = await response.json();
            setBadges(data.badges || data);
        } catch (error) {
            console.error("Failed to fetch badges:", error);
            setBadges([]); // Just empty array if it fails
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Adding badge: ${formData.badgeName} from ${formData.gymLocation}`);
        setFormData({ badgeName: '', gymLocation: '' });
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <div>
            <h1>Pokemon Gym Badges</h1>
            
            <table border="1">
                <thead>
                    <tr>
                        <th>Badge ID</th>
                        <th>Badge Name</th>
                        <th>Gym Location</th>
                    </tr>
                </thead>
                <tbody>
                    {badges.map((badge, idx) => (
                        <tr key={badge.badgeID || idx}>
                            <td>{badge.badgeID}</td>
                            <td>{badge.badgeName}</td>
                            <td>{badge.gymLocation}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            <br/>
            
            <h2>Add New Badge</h2>
            <form onSubmit={handleSubmit}>
                <label>Badge Name: </label>
                <input
                    type="text"
                    name="badgeName"
                    value={formData.badgeName}
                    onChange={handleInputChange}
                    required
                />
                <br/><br/>
                <label>Gym Location: </label>
                <input
                    type="text"
                    name="gymLocation"
                    value={formData.gymLocation}
                    onChange={handleInputChange}
                    required
                />
                <br/><br/>
                <button type="submit">Add Badge</button>
            </form>
            
            <p>Total badges: {badges.length}</p>
        </div>
    );
}

export default Badges;