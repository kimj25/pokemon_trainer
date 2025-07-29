import { useState, useEffect } from 'react';
import TableRowWithDelete from '../components/TableRowWithDelete';
import DeletePokemonForm from '../components/DeletePokemonForm';
import CreatePokemonForm from '../components/CreatePokemonForm';

function Pokemon({ backendURL }) {
    const [pokemons, setPokemons] = useState([]);
    const [loading, setLoading] = useState(true);

    // Formatter helper function to format date as MM/DD/YYYY
    const formatDate = (isoDate) => {
        if (!isoDate) return "NULL";
        const date = new Date(isoDate);
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const yyyy = date.getFullYear();
        return `${mm}/${dd}/${yyyy}`;
    };

    // Fetches Pokémon data from backend
    const getData = async () => {
        try {
            const response = await fetch(`${backendURL}/pokemon`);
            const { pokemons } = await response.json();

            const processed = (pokemons || []).map(pokemon => ({
                ...pokemon,
                nickname:
                    typeof pokemon.nickname === 'string' &&
                    pokemon.nickname.trim() !== ''
                        ? pokemon.nickname
                        : "Null",
                secondaryTypeName:
                    pokemon.secondaryTypeName != null &&
                    pokemon.secondaryTypeName !== ''
                        ? pokemon.secondaryTypeName
                        : "None",
                dateCaught: formatDate(pokemon.dateCaught),
            }));

            setPokemons(processed);
        } catch (error) {
            console.error("Failed to fetch Pokémon data:", error);
            setPokemons([]);
        } finally {
            setLoading(false);
        }
    };

    // On component mount
    useEffect(() => {
        getData();
    }, []);

    if (loading) return <p>Loading Pokémon...</p>;
    if (pokemons.length === 0) return <p>No Pokémon found.</p>;

    return (
        <>
            <h1>Tracked Pokémon List</h1>

            <table>
                <thead>
                    <tr>
                        {Object.keys(pokemons[0]).map((header, idx) => (
                            <th key={idx}>{header}</th>
                        ))}
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {pokemons.map((pokemon, idx) => (
                        <TableRowWithDelete
                            key={pokemon.pokemonID || idx}
                            rowObject={pokemon}
                            backendURL={backendURL}
                            refreshData={getData}
                            DeleteFormComponent={DeletePokemonForm}
                        />
                    ))}
                </tbody>
            </table>

            <CreatePokemonForm backendURL={backendURL} refreshData={getData} />
        </>
    );
}

export default Pokemon;
