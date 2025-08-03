import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditTrainerForm = ({ backendURL }) => {
    const { id: trainerID } = useParams();
    const navigate = useNavigate();

    const [trainerName, setTrainerName] = useState('');
    const [homeTown, setHomeTown] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrainer = async () => {
            try {
                const response = await fetch(`${backendURL}/trainers/${trainerID}`);
                if (!response.ok) throw new Error('Failed to fetch trainer');
                const data = await response.json();

                setTrainerName(data.trainerName || '');
                setHomeTown(data.homeTown || '');
            } catch (err) {
                console.error('Error fetching trainer:', err);
                alert('Could not load trainer for editing.');
            } finally {
                setLoading(false);
            }
        };

        fetchTrainer();
    }, [backendURL, trainerID]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!trainerName.trim() || !homeTown.trim()) {
            alert('Please fill out all required fields correctly.');
            return;
        }

        const updatedTrainer = {
            trainerName: trainerName.trim(),
            homeTown: homeTown.trim(),
        };

        try {
            const response = await fetch(`${backendURL}/trainers/${trainerID}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedTrainer),
            });

            if (!response.ok) throw new Error('Failed to update trainer');
            alert('Trainer updated successfully!');
            navigate('/trainers');
        } catch (error) {
            console.error('Error updating trainer:', error);
            alert('Failed to update trainer');
        }
    };

    if (loading) {
        return <p>Loading trainer data...</p>;
    }

    return (
        <>
            <h2>Edit Trainer</h2>
            <form className="cuForm" onSubmit={handleSubmit}>
                <label htmlFor="trainerName">Trainer Name:</label>
                <input
                    id="trainerName"
                    type="text"
                    value={trainerName || ''}
                    onChange={(e) => setTrainerName(e.target.value)}
                    required
                />
                <label htmlFor="homeTown">Home Town:</label>
                <input
                    id="homeTown"
                    type="text"
                    value={homeTown || ''}
                    onChange={(e) => setHomeTown(e.target.value)}
                    required
                />   
                <input type="submit" value="Update Trainer" />
            </form>
        </>
    );
};

export default EditTrainerForm;