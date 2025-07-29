import React, { useState } from 'react';

// Citation: Had chatgpt help generate this code for creating a new Pokémon
// The prompt: Given the following code and with fields for species name, nickname, level, trainer ID, and date caught.
// create a form that allows users to create a new Pokémon. Make sure to validate the inputs. The level should be between 1 and 100. and the date should be in the format YYYY-MM-DD.
// It was great help for the formatting the date and ensuring the level is within the range of 1-100.
// The form should validate the inputs and provide feedback if any required fields are missing or invalid.
const CreatePokemonForm = ({ backendURL, refreshData }) => {
    const [speciesName, setSpeciesName] = useState('');
    const [nickname, setNickname] = useState('');
    const [level, setLevel] = useState(1);
    const [trainerID, setTrainerID] = useState('');
    const [dateCaught, setDateCaught] = useState('');

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

        const formattedDate = new Date(dateCaught).toISOString().split('T')[0]; // YYYY-MM-DD

        const newPokemon = {
            speciesName: speciesName.trim(),
            nickname: nickname.trim() === '' ? null : nickname.trim(),
            level: Number(level),
            trainerID: Number(trainerID),
            dateCaught: formattedDate,
        };

        try {
            const response = await fetch(`${backendURL}/pokemons`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPokemon),
            });

            if (!response.ok) throw new Error('Failed to create Pokémon');

            // Clear form
            setSpeciesName('');
            setNickname('');
            setLevel(1);
            setTrainerID('');
            setDateCaught('');
            refreshData();
        } catch (error) {
            console.error('Error creating Pokémon:', error);
            alert('Failed to create Pokémon');
        }
    };

    return (
        <>
            <h2>Add a new Pokémon</h2>
            <form className="cuForm" onSubmit={handleSubmit}>
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

                <input type="submit" value="Create Pokémon" />
            </form>
        </>
    );
};

export default CreatePokemonForm;

