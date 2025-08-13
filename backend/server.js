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

// Port and URL used
const PORT = 35729;
backendURL = `http://classwork.engr.oregonstate.edu:${PORT}...`;


// ########################################
// ########## ROUTE HANDLERS

// READ ROUTES
// get route to get all pokemon
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
// get route to get all types
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

// get route to get species throguh pagination which you can change limits but currently set to 10
// Citation: Gemini AI was used to to help with pagination implmentation for frontend, backend, and stored procedure
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

// get route to get all the badges by badgeID via selection
app.get('/badges', async (req, res) => {
    try {
        const [badges] = await db.query('SELECT * FROM Badges ORDER BY badgeID');
        res.status(200).json({ badges: badges });
    } catch (error) {
        console.error("Error executing Badges query:", error);
        res.status(500).json({ error: "An error occurred while retrieving Badges." });
    }
});

// delete route to delete pokemon based on ID which is given via row through params
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
        const [rows] = await db.query('CALL GetPokemonByID(?)', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Pokemon not found' });
        }

        res.status(200).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Database error' });
    }
});

// Get route to get all trainers
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

// Post route to create a new trainer to insert into the db
app.post('/trainers', async(req, res) => {
    const {trainerName, homeTown } = req.body;

    if (!trainerName || !homeTown) {
        return res.status(400).json({ error: 'Trainer Name, and Home Town are required' });
    }
    try {
        await db.execute('CALL InsertTrainers(?,?)', [trainerName, homeTown]);
        res.status(201).json({ message: 'Trainer added successfully' });
    } catch (error) {
        console.error('Error adding trainer:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// edit route trainer based on ID and params provided, used old params as default values
app.put('/trainers/:trainerID', async(req, res) => {
    const {trainerID} = req.params;
    const {trainerName, homeTown } = req.body;

    if (!trainerName || ! homeTown) {
        return res.status(400).json({ error: 'Trainer Name, and Home Town are required' });
    } 
    try {
        await db.execute('CALL UpdateTrainers(?, ?, ?)', [trainerID, trainerName, homeTown]);
        res.status(200).json({ message: 'Trainer updated successfully' });
    } catch (error) {
        console.error('Error updating trainer:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete route for trainers based on ID provided on the row
app.delete('/trainers/:trainerID', async (req, res) => {
    const { trainerID } = req.params;

    if (!trainerID) {
        return res.status(400).json({ error: "trainerID parameter is required" });
    }

    try {
        // Call the stored procedure to delete the trainer by ID
        await db.query('CALL DeleteTrainerById(?)', [trainerID]);

        res.status(200).json({ message: `Trainer with ID ${trainerID} deleted successfully.` });
    } catch (error) {
        console.error("Error deleting Trainer:", error);
        res.status(500).json({ error: "An error occurred while deleting the Trainer." });
    }
});

// Citation: Had Claude Sonnet generate code for deleting a trainer badge
// Prompt: Generate Delete request for TrainBadges based on the frontend provided
// Use direct SQL for delete and delete only the badge record, not the trainer
app.delete('/trainerbadges/:trainerBadgeID', async (req, res) => {
    const { trainerBadgeID } = req.params;
    console.log('Deleting trainer badge with ID:', trainerBadgeID);
    if (!trainerBadgeID) {
        return res.status(400).json({ error: "trainerBadgeID parameter is required" });
    }

    try {
        // Direct SQL delete
        await db.execute('DELETE FROM TrainerBadges WHERE trainerBadgeID = ?', [trainerBadgeID]);
        
        res.status(200).json({ message: `Trainer badge with ID ${trainerBadgeID} deleted successfully.` });
    } catch (error) {
        console.error("Error deleting trainer badge:", error);
        res.status(500).json({ error: "An error occurred while deleting the trainer badge." });
    }
});

// Citation: Had Claude Sonnet 4 generate put route for TrainerBadges
// Prompt: Create put request for TrainerBadges based on the frontend and UpdateTrainerBadges DML provided
// Also, handle the error for duplicate entries for badges
app.put('/trainerbadges/:trainerBadgeID', async(req, res) => {
    const {trainerBadgeID} = req.params;
    const {trainerID, badgeID, dateEarned} = req.body;

    if (!trainerID || !badgeID || !dateEarned) {
        return res.status(400).json({ error: 'Trainer ID, badgeID, dateEarned are required' });
    } 
    
    try {
        await db.execute('CALL UpdateTrainerBadges(?, ?, ?, ?)', [
            trainerBadgeID, 
            trainerID, 
            badgeID, 
            dateEarned
        ]);
        
        res.status(200).json({ message: 'Trainer Badge updated successfully' });
    } catch (error) {
        console.error('Error updating trainer Badge:', error);
        
        // Handle specific database errors
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'This trainer already has this badge!' });
        }
        
        res.status(500).json({ error: 'Internal server error' });
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

// Adding reset backend server call to ResetDatabase();
// Citation: ChatGpt
// Prompt: Generate a reset post with ResetDatabase();
app.post('/reset', async (req, res) => {
    try {
        await db.query("CALL ResetDatabase();");
        res.status(200).json({ message: "Database reset successfully" });
    } catch (error) {
        console.error("Error resetting database:", error);
        res.status(500).json({ error: "Failed to reset database" });
    }
});

// ########################################
// ########## LISTENER

app.listen(PORT, function () {
    console.log('Express started on http://classwork.engr.oregonstate.edu:' + PORT + '; press Ctrl-C to terminate.');
});