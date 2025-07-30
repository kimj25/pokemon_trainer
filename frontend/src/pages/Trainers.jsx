import React, { useState, useEffect } from 'react';

function Trainers({ backendURL }) {
    const [trainers, setTrainers] = useState([]);
    const [formData, setFormData] = useState({
        trainerName: '',
        homeTown: ''
    });

    const getData = async () => {
        try {
            const response = await fetch(`${backendURL}/api/trainers`);
            const data = await response.json();
            setTrainers(data.trainers || data);
        } catch (error) {
            console.error("Failed to fetch trainers:", error);
            setTrainers([
                { trainerID: 1, trainerName: 'Ash', homeTown: 'Pallet Town' },
                { trainerID: 2, trainerName: 'Misty', homeTown: 'Cerulean City' }
            ]);
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
        alert(`Adding trainer: ${formData.trainerName} from ${formData.homeTown}`);
        setFormData({ trainerName: '', homeTown: '' });
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <div>
            <h1>Pokemon Trainers</h1>
            
            <table border="1">
                <thead>
                    <tr>
                        <th>Trainer ID</th>
                        <th>Trainer Name</th>
                        <th>Home Town</th>
                    </tr>
                </thead>
                <tbody>
                    {trainers.map((trainer, idx) => (
                        <tr key={trainer.trainerID || idx}>
                            <td>{trainer.trainerID}</td>
                            <td>{trainer.trainerName}</td>
                            <td>{trainer.homeTown}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            <br/>
            
            <h2>Add New Trainer</h2>
            <form onSubmit={handleSubmit}>
                <label>Trainer Name: </label>
                <input
                    type="text"
                    name="trainerName"
                    value={formData.trainerName}
                    onChange={handleInputChange}
                    required
                />
                <br/><br/>
                <label>Home Town: </label>
                <input
                    type="text"
                    name="homeTown"
                    value={formData.homeTown}
                    onChange={handleInputChange}
                    required
                />
                <br/><br/>
                <button type="submit">Add Trainer</button>
            </form>
            
            <p>Total trainers: {trainers.length}</p>
        </div>
    );
}

export default Trainers;