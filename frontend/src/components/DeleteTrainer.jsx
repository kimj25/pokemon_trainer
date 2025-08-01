import React from 'react';

const DeleteTrainerForm = ({ rowObject, backendURL, refreshData }) => {
    const handleDelete = async (e) => {
        e.preventDefault();

        try {
            // Assuming the unique identifier is trainerID, adjust if different
            const response = await fetch(`${backendURL}/trainers/${rowObject.trainerID}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete Trainer');
            }

            // Refresh the data after successful deletion
            refreshData();
        } catch (error) {
            console.error('Error deleting Trainer', error);
            alert('Failed to delete Trainer');
        }
    };

    return (
        <form onSubmit={handleDelete}>
            <button type="submit">Delete</button>
        </form>
    );
};

export default DeleteTrainerForm;
