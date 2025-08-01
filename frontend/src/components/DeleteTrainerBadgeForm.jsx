import React from 'react';

const DeleteTrainerBadgesForm = ({ rowObject, backendURL, refreshData }) => {
    const handleDelete = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${backendURL}/trainerbadges/${rowObject.trainerID}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete Trainer Badge information');
            }

            // Refresh the data after successful deletion
            refreshData();
        } catch (error) {
            console.error('Error deleting Trainer Badge', error);
            alert('Failed to delete Trainer Badge');
        }
    };

    return (
        <form onSubmit={handleDelete}>
            <button type="submit">Delete</button>
        </form>
    );
};

export default DeleteTrainerBadgesForm;
