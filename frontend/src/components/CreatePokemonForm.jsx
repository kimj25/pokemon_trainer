import React, { useState } from 'react';

const CreatePokemonForm = ({ species, trainers, types, backendURL, refreshData }) => {
  // State for controlled inputs
  const [pokemonSpeciesID, setPokemonSpeciesID] = useState('');
  const [nickname, setNickname] = useState('');
  const [level, setLevel] = useState(1);
  const [trainerID, setTrainerID] = useState('');
  const [dateCaught, setDateCaught] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation (optional)
    if (!pokemonSpeciesID || !level || !trainerID || !dateCaught) {
      alert('Please fill out all required fields.');
      return;
    }

    const newPokemon = {
      pokemonSpeciesID: Number(pokemonSpeciesID),
      nickname: nickname || null,
      level: Number(level),
      trainerID: Number(trainerID),
      dateCaught,
    };

    try {
      const response = await fetch(`${backendURL}/pokemons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPokemon),
      });

      if (!response.ok) {
        throw new Error('Failed to create Pokémon');
      }

      // Clear form fields
      setPokemonSpeciesID('');
      setNickname('');
      setLevel(1);
      setTrainerID('');
      setDateCaught('');

      // Refresh the Pokemon list
      refreshData();
    } catch (error) {
      console.error('Error creating Pokémon:', error);
      alert('Failed to create Pokémon');
    }
  };

  return (
    <>
      <h2>Create a Pokémon</h2>
      <form className="cuForm" onSubmit={handleSubmit}>
        <label htmlFor="species">Species:</label>
        <select
          id="species"
          value={pokemonSpeciesID}
          onChange={(e) => setPokemonSpeciesID(e.target.value)}
          required
        >
          <option value="">Select Species</option>
          {species.map((s) => (
            <option key={s.pokemonSpeciesID} value={s.pokemonSpeciesID}>
              {s.speciesName}
            </option>
          ))}
        </select>

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

        <label htmlFor="trainer">Trainer:</label>
        <select
          id="trainer"
          value={trainerID}
          onChange={(e) => setTrainerID(e.target.value)}
          required
        >
          <option value="">Select Trainer</option>
          {trainers.map((t) => (
            <option key={t.trainerID} value={t.trainerID}>
              {t.trainerName}
            </option>
          ))}
        </select>

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
