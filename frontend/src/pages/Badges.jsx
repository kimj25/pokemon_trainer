import React, { useState, useEffect } from 'react';

function Badges({ backendURL }) {
    const [badges, setBadges] = useState([]);
    const [loading, setLoading] = useState(true);

    const getData = async () => {
        try {
            const response = await fetch(`${backendURL}/badges`);
            const data = await response.json();
            setBadges(data.badges || data);
        } catch (error) {
            console.error("Failed to fetch badges:", error);
            setBadges([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getData();
    }, [backendURL]);

    if (loading) return <p>Loading badges...</p>;
    if (badges.length === 0) return <p>No badges found.</p>;

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
            
            <p>Total badges: {badges.length}</p>
        </div>
    );
}

export default Badges;