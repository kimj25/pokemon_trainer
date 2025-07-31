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


const PORT = 35722;
backendURL = `http://classwork.engr.oregonstate.edu:${PORT}...`;


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

app.get('/trainers', async (req, res) => {
    try {
        // Call stored procedure to get Types data
        const [trainers] = await db.query('CALL GetAllTrainers()');
        res.status(200).json({ trainers: trainers[0] });
    } catch (error) {
        console.error("Error executing Trainers query:", error);
        res.status(500).send("An error occurred while retrieving Trainers.");
    }
});

app.get('/badges', async (req, res) => {
    try {
        const [badges] = await db.query('SELECT * FROM Badges ORDER BY badgeID');
        res.status(200).json({ badges: badges });
    } catch (error) {
        console.error("Error executing Badges query:", error);
        res.status(500).json({ error: "An error occurred while retrieving Badges." });
    }
});

//Citation: Had chatgpt4 generate get function for TrainerBadges
//Prompt: Create get request for Trainerbadges based on DML and frontend page provided
// Call GetAllTrainerBadges stored procedure to retrieve trainer badges
app.get('/trainerbadges', async (req, res) => {
    try {
        // Use the stored procedure instead of raw SQL
        const [trainerBadges] = await db.query('CALL GetAllTrainerBadges()');
        res.status(200).json({ trainerBadges: trainerBadges[0] });
    } catch (error) {
        console.error("Error executing TrainerBadges query:", error);
        res.status(500).json({ error: "An error occurred while retrieving TrainerBadges." });
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


// Citation: Had chatgpt generate this code for creating a new Pokémon
// Prompt: Create post request based on front end and dml provided
// with fields for species name, nickname, level, trainer ID, and date caught based on the front end
app.post('/pokemons', async (req, res) => {
    const { speciesName, nickname, level, trainerID, dateCaught } = req.body;

    if (!speciesName || !trainerID || !dateCaught || !level || level < 1 || level > 100) {
        return res.status(400).json({ error: 'Invalid input data' });
    }

    try {
        // 1. Lookup species ID by name
        const [rows] = await db.execute('SELECT pokemonSpeciesID FROM PokemonSpecies WHERE speciesName = ?', [speciesName.trim()]);

        if (rows.length === 0) {
            return res.status(400).json({ error: 'Species name not found' });
        }

        const pokemonSpeciesID = rows[0].pokemonSpeciesID;

        // 2. Call insert procedure with the found ID
        await db.execute('CALL InsertPokemon(?, ?, ?, ?, ?)', [
            pokemonSpeciesID,
            nickname || null,
            level,
            trainerID,
            dateCaught
        ]);

        res.status(201).json({ message: 'Pokémon created successfully' });
    } catch (err) {
        console.error('Error creating Pokémon:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Citation: Had chatgpt generate this code for creating a updating Pokémon
// Prompt: given the post route, create one for updating pokemon
// Then more manual edits
app.put('/pokemons/:pokemonID', async (req, res) => {
    const { pokemonID } = req.params;
    const { speciesName, nickname, level, trainerID, dateCaught } = req.body;

    if (!speciesName || !trainerID || !dateCaught || !level || level < 1 || level > 100) {
        return res.status(400).json({ error: 'Invalid input data' });
    }

    try {
        // Lookup pokemonSpeciesID by speciesName
        const [rows] = await db.execute('SELECT pokemonSpeciesID FROM PokemonSpecies WHERE speciesName = ?', [speciesName.trim()]);

        if (rows.length === 0) {
            return res.status(400).json({ error: 'Species name not found' });
        }

        const pokemonSpeciesID = rows[0].pokemonSpeciesID;

        // Call the update stored procedure
        await db.execute('CALL UpdatePokemon(?, ?, ?, ?, ?, ?)', [
            pokemonID,
            pokemonSpeciesID,
            nickname || null,
            level,
            trainerID,
            dateCaught
        ]);

        res.status(200).json({ message: `Pokémon with ID ${pokemonID} updated successfully.` });
    } catch (error) {
        console.error('Error updating Pokémon:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Made a get route with the help of Copilot to get the current info to display on the edit component 
app.get('/pokemon/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const [rows] = await db.query(
            `
            Select 
                Pokemons.pokemonID,
                PokemonSpecies.speciesName,
                Pokemons.nickname,
                Pokemons.level,
                Pokemons.trainerID,
                Pokemons.dateCaught
            From Pokemons
            Join PokemonSpecies On Pokemons.pokemonSpeciesID = PokemonSpecies.pokemonSpeciesID
            Where Pokemons.pokemonID = ?;
            `,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Pokemon not found' });
        }

        res.status(200).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Database error' });
    }
});

// Citation: Had Claude Sonnet 4 update the code for the TrainerBadges post request
// Prompt: Create post request for TrainerBadges based on the frontend and dml provided
// This will insert a new trainer badge record
app.post('/trainerbadges', async (req, res) => {
    const { trainerID, badgeID, dateEarned } = req.body;

    if (!trainerID || !badgeID || !dateEarned) {
        return res.status(400).json({ error: 'Trainer ID, Badge ID, and Date Earned are required' });
    }

    try {
        await db.execute('CALL InsertTrainerBadges(?, ?, ?)', [trainerID, badgeID, dateEarned]);
        res.status(201).json({ message: 'Trainer badge record added successfully' });
    } catch (error) {
        console.error('Error adding trainer badge:', error);
        
        // Handle duplicate key error from the UNIQUE constraint
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'This trainer already has this badge!' });
        }
        
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// ########################################
// ########## LISTENER

app.listen(PORT, function () {
    console.log('Express started on http://classwork.engr.oregonstate.edu:' + PORT + '; press Ctrl-C to terminate.');
});