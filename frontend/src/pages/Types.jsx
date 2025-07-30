import { useState, useEffect } from 'react';
import GenericTableRow from '../components/GenericTableRow';

function Types({ backendURL }) {
    const [types, setTypes] = useState([]);

    const getData = async () => {
        try {
            console.log('📡 Fetching trainers data from:', `${backendURL}/types`);
            const response = await fetch(`${backendURL}/types`);
            const { types } = await response.json();
            setTypes(types);
        } catch (error) {
            console.error("Failed to fetch types data:", error);
            setTypes([]);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <>
            <h1>Pokémon Types</h1>

            <table>
                <thead>
                    <tr>
                        {Object.keys(types[0] || {}).map((header, idx) => (
                            <th key={idx}>{header}</th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {types.map((type, idx) => (
                        <GenericTableRow
                            key={type.typeID || idx}
                            rowObject={type}
                        />
                    ))}
                </tbody>
            </table>
        </>
    );
}

export default Types;
