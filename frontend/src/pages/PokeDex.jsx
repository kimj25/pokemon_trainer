import { useState, useEffect } from 'react';
import GenericTableRow from '../components/GenericTableRow';

function Pokedex({ backendURL }) {
    const [species, setSpecies] = useState([]);
    const [typeOptions, setTypeOptions] = useState([]); // <-- Add this line
    const [typeFilter, setTypeFilter] = useState('');
    const [page, setPage] = useState(1);

    // Fetch species data based on typeFilter and page (optional)
    const getData = async () => {
        try {
            // Construct URL with query params
            // Asked ChatGPT to add pagination and type filtering and fetch from URL
            const params = new URLSearchParams();
            if (typeFilter) params.append('type', typeFilter);
            params.append('page', page);
            params.append('limit', 10);
            
            const response = await fetch(`${backendURL}/species?${params.toString()}`);
            const { species } = await response.json();

            // process species data if needed
            const processed = (species || []).map((spec) => ({
                ...spec,
                secondaryTypeName:
                    spec.secondaryTypeName != null && spec.secondaryTypeName !== ''
                        ? spec.secondaryTypeName
                        : 'None',
            }));

            setSpecies(processed);
        } catch (error) {
            console.error('Failed to fetch species data:', error);
            setSpecies([]);
        }
    };

    // Fetch type options on mount based on Types table
    useEffect(() => {
        async function fetchTypes() {
            try {
                const response = await fetch(`${backendURL}/types`);
                const { types } = await response.json();
                setTypeOptions(types.map(t => t.typeName));
            } catch (error) {
                console.error('Failed to fetch types:', error);
                setTypeOptions([]);
            }
        }
        fetchTypes();
    }, []);

    // Fetch species data when typeFilter or page changes
    useEffect(() => {
        getData();
    }, [typeFilter, page]);

    return (
        <>
            <h1>Pokédex</h1>

            <select
                style={{ margin: '1rem' }}
                value={typeFilter}
                onChange={(e) => {
                    setPage(1); // Reset to first page on filter change
                    setTypeFilter(e.target.value);
                }}
            >
                <option value="">All Types</option>
                {typeOptions.map((typeName) => (
                    <option key={typeName} value={typeName}>
                        {typeName}
                    </option>
                ))}
            </select>

            <table>
                <thead>
                    <tr>
                        {Object.keys(species[0] || {}).map((header, idx) => (
                            <th key={idx}>{header}</th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {species.map((row, idx) => (
                        <GenericTableRow
                            key={row.pokemonSpeciesID || idx}
                            rowObject={row}
                        />
                    ))}
                </tbody>
            </table>

            <div style={{ padding: '1rem' }}>
                <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
                    Prev
                </button>
                <span style={{ margin: '0 1rem' }}>Page {page}</span>
                <button onClick={() => setPage(page + 1)}>Next</button>
            </div>
        </>
    );
}

export default Pokedex;
