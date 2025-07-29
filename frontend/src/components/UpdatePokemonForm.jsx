import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Citation: Had chatgpt help generate this code for creating a updating pokemon
// The prompt: Given CreatePokemonForm.jsx, create a form that allows users to update an existing Pokémon.
// Then I simply made edits to the form to make it work with the backend and frontend
const EditPokemonForm = ({ backendURL }) => {
    const { id: pokemonID } = useParams();
    const navigate = useNavigate();

    const [speciesName, setSpeciesName] = useState('');
    const [nickname, setNickname] = useState('');
    const [level, setLevel] = useState(1);
    const [trainerID, setTrainerID] = useState('');
    const [dateCaught, setDateCaught] = useState('');

    useEffect(() => {
        const fetchPokemon = async () => {
            try {
                const response = await fetch(`${backendURL}/pokemon/${pokemonID}`);
                if (!response.ok) throw new Error('Failed to fetch Pokémon');
                const data = await response.json();

                setSpeciesName(data.speciesName || '');
                setNickname(data.nickname || '');
                setLevel(data.level || 1);
                setTrainerID(data.trainerID || '');
                setDateCaught(data.dateCaught ? new Date(data.dateCaught).toISOString().split('T')[0] : '');
            } catch (err) {
                console.error('Error fetching Pokémon:', err);
                alert('Could not load Pokémon for editing.');
            }
        };

        fetchPokemon();
    }, [backendURL, pokemonID]);

    const isLevelValid = (level) => {
        const num = Number(level);
        return num >= 1 && num <= 100;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!speciesName.trim() || !trainerID || !dateCaught || !isLevelValid(level)) {
            alert('Please fill out all required fields correctly.');
            return;
        }

        const formattedDate = new Date(dateCaught).toISOString().split('T')[0];

        const updatedPokemon = {
            speciesName: speciesName.trim(),
            nickname: nickname.trim() === '' ? null : nickname.trim(),
            level: Number(level),
            trainerID: Number(trainerID),
            dateCaught: formattedDate,
        };

        try {
            const response = await fetch(`${backendURL}/pokemons/${pokemonID}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedPokemon),
            });

            if (!response.ok) throw new Error('Failed to update Pokémon');
            alert('Pokémon updated successfully!');
            navigate('/pokemon'); // Redirect to the Pokémon details page
        } catch (error) {
            console.error('Error updating Pokémon:', error);
            alert('Failed to update Pokémon');
        }
    };

    return (
        <>
            <h2>Edit Pokémon</h2>
            <form className="cuForm" onSubmit={handleSubmit}>
                {/* Same form inputs as before */}
                <label htmlFor="speciesName">Species Name:</label>
                <input
                    id="speciesName"
                    type="text"
                    value={speciesName}
                    onChange={(e) => setSpeciesName(e.target.value)}
                    required
                />
                <label htmlFor="nickname">Nickname (optional):</label>
                <input
                    id="nickname"
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                />
                <label htmlFor="level">Level (1-100):</label>
                <input
                    id="level"
                    type="number"
                    min="1"
                    max="100"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    required
                />
                <label htmlFor="trainerID">Trainer ID:</label>
                <input
                    id="trainerID"
                    type="number"
                    value={trainerID}
                    onChange={(e) => setTrainerID(e.target.value)}
                    required
                />
                <label htmlFor="dateCaught">Date Caught:</label>
                <input
                    id="dateCaught"
                    type="date"
                    value={dateCaught}
                    onChange={(e) => setDateCaught(e.target.value)}
                    required
                />
                <input type="submit" value="Update Pokémon" />
            </form>
        </>
    );
};

export default EditPokemonForm;
