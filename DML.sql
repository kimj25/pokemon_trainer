Delimiter //

-- Drops all procedures if they exist
-- This is useful for development to ensure we can recreate procedures without conflicts
Drop Procedure If Exists GetAllPokemons //
Drop Procedure If Exists GetAllTypes //
Drop Procedure If Exists GetAllSpecies //
Drop Procedure If Exists GetSpeciesByTypeWithPagination //
Drop Procedure If Exists DeletePokemonById //
Drop Procedure If Exists InsertPokemon //
Drop Procedure If Exists UpdatePokemon //
Drop Procedure If Exists GetAllTrainers //
Drop Procedure If Exists GetTrainerById //
Drop Procedure If Exists InsertTrainers //
Drop procedure If Exists DeleteTrainerById //
Drop Procedure If Exists GetAllTrainerBadges //
Drop Procedure If Exists InsertTrainerBadges //
Drop Procedure If Exists UpdateTrainers //
Drop Procedure If Exists UpdateTrainerBadges //
Drop Procedure If Exists ResetDatabase //



-- Procedures to retrieve for the pokemon page
Create Procedure GetAllPokemons()
Begin
    Select 
        Pokemons.pokemonID, 
        Pokemons.nickname,
        PokemonSpecies.speciesName, 
        T1.typeName As primaryTypeName,
        T2.typeName As secondaryTypeName,
        Pokemons.level, 
        Trainers.trainerName, 
        Pokemons.dateCaught 
    From Pokemons
    Left Join PokemonSpecies On Pokemons.pokemonSpeciesID = PokemonSpecies.pokemonSpeciesID
    Left Join Types As T1 On PokemonSpecies.primaryTypeID = T1.typeID
    Left Join Types As T2 On PokemonSpecies.secondaryTypeID = T2.typeID
    Left Join Trainers On Pokemons.trainerID = Trainers.trainerID;
End //

-- Procedure to get all types for the type page
Create Procedure GetAllTypes()
Begin  
    Select
        typeID,
        typeName
    From Types;
End //

-- No longer needed as we have GetSpeciesByTypeWithPagination
Create Procedure GetAllSpecies()
Begin
    Select
        PokemonSpecies.pokemonSpeciesID,
        PokemonSpecies.speciesName,
        T1.typeName As primaryTypeName,
        T2.typeName As secondaryTypeName
    From PokemonSpecies
    Left Join Types As T1 On PokemonSpecies.primaryTypeID = T1.typeID
    Left Join Types As T2 On PokemonSpecies.secondaryTypeID = T2.typeID;
End //

-- Procedure to get species by type with pagination asked chatgpt to help convert GetAllSpeciesByType to a paginated version
-- This procedure allows filtering by type and supports pagination
Create Procedure GetSpeciesByTypeWithPagination(
    In inputTypeName Varchar(50),
    In inputPage Int,
    In inputLimit Int
)
Begin
    Declare offsetVal Int;
    Set offsetVal = (inputPage - 1) * inputLimit;

    Select 
        PokemonSpecies.pokemonSpeciesId,
        PokemonSpecies.speciesName,
        T1.typeName As primaryTypeName,
        T2.typeName As secondaryTypeName
    From PokemonSpecies
    Left Join Types As T1 On PokemonSpecies.primaryTypeId = T1.typeId
    Left Join Types As T2 On PokemonSpecies.secondaryTypeId = T2.typeId
    Where 
        (inputTypeName Is Null 
         Or T1.typeName = inputTypeName 
         Or T2.typeName = inputTypeName)
    Limit inputLimit Offset offsetVal;
End //

Create procedure DeletePokemonById(In inputPokemonID Int)
Begin
    Delete from Pokemons where pokemonID = inputPokemonID;
End //

-- Citation: Had chatgpt generate this code for creating a new Pokémon
-- Asked for SQL procedure to insert a new Pokémon
Create Procedure InsertPokemon (
    In in_pokemonSpeciesID Int,
    In in_nickname Varchar(255),
    In in_level Int,
    In in_trainerID Int,
    In in_dateCaught Date
)
Begin
    Insert Into Pokemons (pokemonSpeciesID, nickname, level, trainerID, dateCaught)
    Values (in_pokemonSpeciesID, in_nickname, in_level, in_trainerID, in_dateCaught);
End //

Create Procedure UpdatePokemon (
    In in_pokemonID Int,
    In in_pokemonSpeciesID Int,
    In in_nickname Varchar(255),
    In in_level Int,
    In in_trainerID Int,
    In in_dateCaught Date
)
Begin
    Update Pokemons
    Set
        pokemonSpeciesID = in_pokemonSpeciesID,
        nickname = in_nickname,
        level = in_level,
        trainerID = in_trainerID,
        dateCaught = in_dateCaught
    Where pokemonID = in_pokemonID;
End //

-- Procedures to retrieve for the trainers page
Create PROCEDURE GetAllTrainers()
Begin
    Select
        trainerID,
        trainerName,
        homeTown
    From Trainers
    Order by trainerID;
END //

Create Procedure InsertTrainers(
    In in_trainerName VarChar(50),
    In in_homeTown VarChar(50)
)
Begin
    Insert Into Trainers (trainerName, homeTown)
    Values (in_trainerName, in_homeTown);

END //

Create Procedure UpdateTrainers(
    In in_trainerID Int,
    In in_trainerName VarChar(50),
    In in_homeTown VarChar(50)
)
Begin
    Update Trainers
    Set
        trainerName = in_trainerName,
        homeTown = in_homeTown
    Where trainerID = in_trainerID;
End //


-- Citation: Had chatgpt generate this code for creating a GET route for TrainerBadges
-- Prompt: Create a GET route for TrainerBadges that joins with Trainers and Badges tables 
-- to show trainer names, badge names, and gymlocations instead of just IDs
-- order by trainer ID and date earned
CREATE PROCEDURE GetAllTrainerBadges()
BEGIN
    SELECT
        TrainerBadges.trainerBadgeID,
        Trainers.trainerID,
        Trainers.trainerName,
        Badges.badgeID,
        Badges.badgeName,
        TrainerBadges.dateEarned
    FROM TrainerBadges
    JOIN Trainers ON TrainerBadges.trainerID = Trainers.trainerID
    JOIN Badges ON TrainerBadges.badgeID = Badges.badgeID
    ORDER BY Trainers.trainerID, TrainerBadges.dateEarned;
END //

CREATE PROCEDURE GetTrainerById(
    IN in_trainerID INT
)
BEGIN
    SELECT
        trainerID,
        trainerName,
        homeTown
    FROM Trainers
    WHERE trainerID = in_trainerID;
END //


-- Citation: Had Claude Sonnet 4 generate this code for inserting a new TrainerBadge
-- Prompt: Create InsertTrainerBadge based on the provided frontend and post request
-- Let the UNIQUE constraint handle duplicates
CREATE PROCEDURE InsertTrainerBadges(
    IN in_trainerID INT,
    IN in_badgeID INT,
    IN in_dateEarned DATE
)
BEGIN
    -- Just insert - let the UNIQUE constraint handle duplicates
    INSERT INTO TrainerBadges (trainerID, badgeID, dateEarned) 
    VALUES (in_trainerID, in_badgeID, in_dateEarned);
END //

-- When trainer is deleted, trainerBadges, 
-- Pokemons are deleted due to On Delete Cascade
Create Procedure DeleteTrainerById(In inputTrainerID Int)
Begin
    Delete from Trainers where trainerID = inputTrainerID;
End //


Create Procedure UpdateTrainerBadges(
    In in_trainerBadgeID Int,
    In in_trainerID Int,
    In in_badgeID Int,
    In in_dateEarned Date
)
Begin
    Update TrainerBadges
    Set
        trainerID = in_trainerID,
        badgeID = in_badgeID,
        dateEarned = in_dateEarned
    Where trainerBadgeID = in_trainerBadgeID;
End //

Create Procedure ResetDatabase()
Begin
    -- CS340 Project: Group 16
    -- Names: Julie Kim and Francis Truong
    SET FOREIGN_KEY_CHECKS=0;
    SET AUTOCOMMIT = 0;

    -- Table drops
    DROP TABLE IF EXISTS Trainers;
    DROP TABLE IF EXISTS Pokemons;
    DROP TABLE IF EXISTS PokemonSpecies;
    DROP TABLE IF EXISTS Types;
    DROP TABLE IF EXISTS Badges;
    DROP TABLE IF EXISTS TrainerBadges;

    -- Table for Trainers
    CREATE TABLE Trainers (
        trainerID int(11) auto_increment,
        trainerName varchar(50) Not Null,
        homeTown varchar(50) Not Null,
        Primary Key(trainerID)
    );
    -- Table for Pokemons
    CREATE TABLE Pokemons(
        pokemonID int(11) auto_increment,
        pokemonSpeciesID int(11) Not Null,
        nickname varchar(50),
        level int(11) Not Null,
        trainerID int(11) Not Null,
        dateCaught date Not Null,
        Check (level Between 1 And 100),
        Primary Key(pokemonID),
        Foreign key(trainerID) References Trainers(trainerID) On Delete Cascade,
        Foreign key(pokemonSpeciesID) References PokemonSpecies(pokemonSpeciesID)
    );
    -- Category Table of Species
    CREATE TABLE PokemonSpecies (
        pokemonSpeciesID int(11) auto_increment,
        speciesName varchar(50) Not Null Unique,
        primaryTypeID int(11) Not Null,
        secondaryTypeID int(11),
        Check(primaryTypeID <> secondaryTypeID Or secondaryTypeID is Null),
        Primary Key(pokemonSpeciesID),
        Foreign Key(primaryTypeID) References Types(typeID),
        Foreign Key(secondaryTypeID) References Types(typeID)
    );
    -- Category Table of Types
    CREATE TABLE Types (
        typeID int(11) auto_increment,
        typeName varchar(50) Not Null Unique,
        Primary Key(typeID)
    );
    -- Cateogry Table of Badges
    CREATE TABLE Badges (
        badgeID int(11) auto_increment,
        badgeName varchar(50) Not Null Unique,
        gymLocation varchar(50) Not Null,
        Primary Key(badgeID)
    );
    -- Insersection Table of M:N relationship
    CREATE TABLE TrainerBadges(
        trainerBadgeID int(11) auto_increment,
        badgeID int(11) Not Null,
        trainerID int(11) Not Null,
        dateEarned date Not Null,
        Unique(trainerID, badgeID),
        Primary Key(trainerBadgeID),
        Foreign Key(badgeID) References Badges(badgeID) On Delete Cascade,
        Foreign Key(TrainerID) References Trainers(trainerID) On Delete Cascade
    );

    -- test trainer data
    Insert Into Trainers (trainerName, homeTown) 
    Values 
        ('Ash', 'Pallet Town'),
        ('Misty', 'Cerulean City'),
        ('Brock', 'Pewter City');
    
    -- test data of pokemons
    Insert Into Pokemons (pokemonSpeciesID, level, trainerID, dateCaught) 
    Values
        (1, 12, 1, '2025-07-01'),    -- Ash’s Charmander
        (3, 15, 1, '2025-07-10'),    -- Ash’s Pikachu
        (10, 15, 2, '2025-07-02'), 	 -- Misty's Staryu
        (11, 25, 2, '2025-07-05'); 	 -- Misty's Golduck

    -- first 15 pokemon as test
    Insert Into PokemonSpecies (speciesName, primaryTypeID, secondaryTypeID)
    Values
        ('Bulbasaur', 8, 12),
        ('Ivysaur', 8, 12),
        ('Venusaur', 8, 12),
        ('Charmander', 5, Null),
        ('Charmeleon', 5, Null),
        ('Charizard', 5, 6),
        ('Squirtle', 15, Null),
        ('Wartortle', 15, Null),
        ('Blastoise', 15, Null),
        ('Caterpie', 1, Null),
        ('Metapod', 1, Null),
        ('Butterfree', 1, 6),
        ('Weedle', 1, 12),
        ('Kakuna', 1, 12),
        ('Beedrill', 1, 12);
    -- all types 
    Insert Into Types (typeName) 
    VALUES
        ('Bug'),      --  1
        ('Dragon'),   --  2
        ('Electric'), --  3
        ('Fighting'), --  4
        ('Fire'),     --  5
        ('Flying'),   --  6
        ('Ghost'),    --  7
        ('Grass'),    --  8
        ('Ground'),   --  9
        ('Ice'),      -- 10
        ('Normal'),   -- 11
        ('Poison'),   -- 12
        ('Psychic'),  -- 13
        ('Rock'),     -- 14
        ('Water');    -- 15
        
    -- all badges 
    Insert Into Badges (badgeName, gymLocation) 
    Values
        ('Boulder Badge', 'Pewter City'),
        ('Cascade Badge', 'Cerulean City'),
        ('Thunder Badge', 'Vermilion City'),	
        ('Rainbow Badge', 'Celadon City'),
        ('Soul Badge', 'Fuchsia City'),
        ('Marsh Badge', 'Saffron City'),
        ('Volcano Badge', 'Cinnabar Island'),
        ('Earth Badge', 'Viridian City');

    -- which trainers have which badge test
    Insert Into TrainerBadges (badgeID, trainerID, dateEarned) 
    Values
        (1, 1, '2025-04-10'),  -- Ash has Boulder Badge
        (2, 2, '2024-03-15'),  -- Misty has Cascade Badge
        (1, 2, '2025-04-10'),  -- Ash has Cascade Badge
        (2, 1, '2024-03-15'),  -- Misty has Boulder Badge
        (3, 1, '2025-05-20'),  -- Ash has Thunder Badge
        (4, 2, '2025-06-01');  -- Misty has Rainbow Badge


    SET FOREIGN_KEY_CHECKS=1;
    COMMIT;

    -- Citations
    -- GEN AI with Claude Sonnet 4 was used to generate data to insert into Pokemon Speices and used 
    -- for brain storming test data
    -- Pokémon Red and Blue. Developed by Game Freak, published by Nintendo, 1996.
    -- Serebii. (n.d.). “Generation 1 Pokémon.” Serebii.net. https://www.serebii.net/pokemon/gen1pokemon.shtml. Accessed 1 July 2025.
    -- “Pokémon League.” Pokémon Wiki, Fandom, https://pokemon.fandom.com/wiki/Kanto#Pok%C3%A9mon_League. Accessed 1 July 2025.
End //

DELIMITER ;
