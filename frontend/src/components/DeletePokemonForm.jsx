import React from 'react';

const DeletePokemonForm = ({ rowObject, backendURL, refreshData }) => {
    const handleDelete = async (e) => {
        e.preventDefault();

        try {
            // Assuming the unique identifier is pokemonID, adjust if different
            const response = await fetch(`${backendURL}/pokemons/${rowObject.pokemonID}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete Pokemon');
            }

            // Refresh the data after successful deletion
            refreshData();
        } catch (error) {
            console.error('Error deleting Pokemon:', error);
            alert('Failed to delete Pokemon');
        }
    };

    return (
        <form onSubmit={handleDelete}>
            <button type="submit">Delete</button>
        </form>
    );
};

export default DeletePokemonForm;
