import React, { useState } from 'react';

const UpdatePokemonForm = ({ pokemons, species, trainers, types, backendURL, refreshData }) => {
  // State for controlled inputs
  const [pokemonID, setPokemonID] = useState('');
  const [pokemonSpeciesID, setPokemonSpeciesID] = useState('');
  const [nickname, setNickname] = useState('');
  const [level, setLevel] = useState('');
  const [trainerID, setTrainerID] = useState('');
  const [dateCaught, setDateCaught] = useState('');

  // When user selects a Pokemon to update, pre-fill form fields
  const handlePokemonChange = (e) => {
    const selectedID = e.target.value;
    setPokemonID(selectedID);

    const selectedPokemon = pokemons.find((p) => p.pokemonID.toString() === selectedID);
    if (selectedPokemon) {
      setPokemonSpeciesID(selectedPokemon.pokemonSpeciesID.toString());
      setNickname(selectedPokemon.nickname || '');
      setLevel(selectedPokemon.level.toString());
      setTrainerID(selectedPokemon.trainerID.toString());
      setDateCaught(selectedPokemon.dateCaught);
    } else {
      // Reset form if no selection
      setPokemonSpeciesID('');
      setNickname('');
      setLevel('');
      setTrainerID('');
      setDateCaught('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pokemonID) {
      alert('Please select a Pokémon to update.');
      return;
    }

    const updatedPokemon = {
      pokemonSpeciesID: Number(pokemonSpeciesID),
      nickname: nickname || null,
      level: Number(level),
      trainerID: Number(trainerID),
      dateCaught,
    };

    try {
      const response = await fetch(`${backendURL}/pokemons/${pokemonID}`, {
        method: 'PATCH', // or 'PUT' depending on your backend
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPokemon),
      });

      if (!response.ok) {
        throw new Error('Failed to update Pokémon');
      }

      // Refresh the data in the parent component
      refreshData();

      // Optionally clear the form or keep updated data
      setPokemonID('');
      setPokemonSpeciesID('');
      setNickname('');
      setLevel('');
      setTrainerID('');
      setDateCaught('');
    } catch (error) {
      console.error('Error updating Pokémon:', error);
      alert('Failed to update Pokémon');
    }
  };

  return (
    <>
      <h2>Update a Pokémon</h2>
      <form className="cuForm" onSubmit={handleSubmit}>
        <label htmlFor="update_pokemon_id">Select Pokémon to Update:</label>
        <select
          id="update_pokemon_id"
          value={pokemonID}
          onChange={handlePokemonChange}
          required
        >
          <option value="">Select a Pokémon</option>
          {pokemons.map((p) => (
            <option key={p.pokemonID} value={p.pokemonID}>
              {p.pokemonID} - {p.nickname || '(no nickname)'}
            </option>
          ))}
        </select>

        <label htmlFor="update_species">Species:</label>
        <select
          id="update_species"
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

        <label htmlFor="update_nickname">Nickname (optional):</label>
        <input
          id="update_nickname"
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />

        <label htmlFor="update_level">Level (1-100):</label>
        <input
          id="update_level"
          type="number"
          min="1"
          max="100"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          required
        />

        <label htmlFor="update_trainer">Trainer:</label>
        <select
          id="update_trainer"
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

        <label htmlFor="update_dateCaught">Date Caught:</label>
        <input
          id="update_dateCaught"
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

export default UpdatePokemonForm;