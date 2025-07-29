// ########################################
// ########## SETUP

// Database
const db = require('./database/db-connector');

// Express
const express = require('express');
const app = express();

// Middleware
const cors = require('cors');
app.use(cors({ credentials: true, origin: "*" }));
app.use(express.json()); // this is needed for post requests


const PORT = 35729;

// ########################################
// ########## ROUTE HANDLERS

// READ ROUTES
app.get('/pokemon', async (req, res) => {
    try {
        // Call stored procedure to get Pokémon data
        const [pokemons] = await db.query('CALL GetAllPokemons()');
        res.status(200).json({ pokemons: pokemons[0] });
    } catch (error) {
        console.error("Error executing Pokémon query:", error);
        res.status(500).send("An error occurred while retrieving Pokémon.");
    }
});

app.get('/types', async (req, res) => {
    try {
        // Call stored procedure to get Types data
        const [types] = await db.query('CALL GetAllTypes()');
        res.status(200).json({ types: types[0] });
    } catch (error) {
        console.error("Error executing Types query:", error);
        res.status(500).send("An error occurred while retrieving Types.");
    }
});

app.get('/species', async (req, res) => {
    try {
        const { type = null, page = 1, limit = 10 } = req.query;

        const [rows] = await db.query(
            `CALL GetSpeciesByTypeWithPagination(?, ?, ?)`,
            [type, parseInt(page), parseInt(limit)]
        );

        res.status(200).json({ species: rows[0] }); // Stored procedures return an array of result sets
    } catch (error) {
        console.error("Error calling stored procedure:", error);
        res.status(500).send("An error occurred while retrieving Species.");
    }
});

app.delete('/pokemons/:pokemonID', async (req, res) => {
    const { pokemonID } = req.params;

    if (!pokemonID) {
        return res.status(400).json({ error: "pokemonID parameter is required" });
    }

    try {
        // Call the stored procedure to delete the Pokémon by ID
        await db.query('CALL DeletePokemonById(?)', [pokemonID]);

        res.status(200).json({ message: `Pokemon with ID ${pokemonID} deleted successfully.` });
    } catch (error) {
        console.error("Error deleting Pokemon:", error);
        res.status(500).json({ error: "An error occurred while deleting the Pokemon." });
    }
});




// ########################################
// ########## LISTENER

app.listen(PORT, function () {
    console.log('Express started on http://classwork.engr.oregonstate.edu:' + PORT + '; press Ctrl-C to terminate.');
});