-- CS340 Project: Group 16
-- Names: Julie Kim and Francis Truong
-- Citations
-- GEN AI with Claude Sonnet 4 was used to generate PL/SQL
-- From existing DML.sql, trainer procedures and reset database procedure were extracted
-- into organized PL.sql file
-- Pokémon Red and Blue. Developed by Game Freak, published by Nintendo, 1996.
-- Serebii. (n.d.). “Generation 1 Pokémon.” Serebii.net. https://www.serebii.net/pokemon/gen1pokemon.shtml. Accessed 1 July 2025.
-- “Pokémon League.” Pokémon Wiki, Fandom, https://pokemon.fandom.com/wiki/Kanto#Pok%C3%A9mon_League. Accessed 1 July 2025.
-- Table structure was designed by Julie Kim and Francis Truong

DELIMITER //

-- Only drop the procedures we're actually creating
DROP PROCEDURE IF EXISTS GetAllTrainers //
DROP PROCEDURE IF EXISTS GetTrainerById //
DROP PROCEDURE IF EXISTS InsertTrainers //
DROP PROCEDURE IF EXISTS UpdateTrainers //
DROP PROCEDURE IF EXISTS DeleteTrainerById //
DROP PROCEDURE IF EXISTS ResetDatabase //

-- Citation: Had claude Sonnet 4 extract essential trainers procedure from DML.sql
-- Prompt: given DML.sql, select essential trainers procedures for PL/SQL

-- Procedures to retrieve for the trainers page
-- Procedure to get ALL Trainers
CREATE PROCEDURE GetAllTrainers()
BEGIN
    SELECT trainerID, trainerName, homeTown
    FROM Trainers
    ORDER BY trainerID;
END //

-- procedure to get trainer by ID
CREATE PROCEDURE GetTrainerById(IN in_trainerID INT)
BEGIN
    SELECT trainerID, trainerName, homeTown
    FROM Trainers
    WHERE trainerID = in_trainerID;
END //

-- Procedure to Insert Trainers
CREATE PROCEDURE InsertTrainers(IN in_trainerName VARCHAR(50), IN in_homeTown VARCHAR(50))
BEGIN
    INSERT INTO Trainers (trainerName, homeTown)
    VALUES (in_trainerName, in_homeTown);
END //

-- Procedure to Update Trainers
CREATE PROCEDURE UpdateTrainers(IN in_trainerID INT, IN in_trainerName VARCHAR(50), IN in_homeTown VARCHAR(50))
BEGIN
    UPDATE Trainers
    SET trainerName = in_trainerName, homeTown = in_homeTown
    WHERE trainerID = in_trainerID;
END //
-- Procedure to Delete Trainers
CREATE PROCEDURE DeleteTrainerById(IN inputTrainerID INT)
BEGIN
    DELETE FROM Trainers WHERE trainerID = inputTrainerID;
END //


-- Reset procedure (contains all the data)
-- with initial example data
CREATE PROCEDURE ResetDatabase()
BEGIN
    SET FOREIGN_KEY_CHECKS=0;
    SET AUTOCOMMIT = 0;
    -- Table drop
    DROP TABLE IF EXISTS Trainers;
    DROP TABLE IF EXISTS Pokemons;
    DROP TABLE IF EXISTS PokemonSpecies;
    DROP TABLE IF EXISTS Types;
    DROP TABLE IF EXISTS Badges;
    DROP TABLE IF EXISTS TrainerBadges;
    -- table for trainers
    CREATE TABLE Trainers (
        trainerID int(11) auto_increment,
        trainerName varchar(50) Not Null,
        homeTown varchar(50) Not Null,
        Primary Key(trainerID)
    );
    -- table for pokemons
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
    -- table for pokemonSpecies
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
    -- table for Types
    CREATE TABLE Types (
        typeID int(11) auto_increment,
        typeName varchar(50) Not Null Unique,
        Primary Key(typeID)
    );
    -- table for Badges
    CREATE TABLE Badges (
        badgeID int(11) auto_increment,
        badgeName varchar(50) Not Null Unique,
        gymLocation varchar(50) Not Null,
        Primary Key(badgeID)
    );
    -- table for TrainerBadges
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
    INSERT INTO Trainers (trainerName, homeTown) VALUES 
        ('Ash', 'Pallet Town'),
        ('Misty', 'Cerulean City'),
        ('Brock', 'Pewter City');
    -- test pokemons data
    INSERT INTO Pokemons (pokemonSpeciesID, level, trainerID, dateCaught) VALUES
        (1, 12, 1, '2025-07-01'),
        (3, 15, 1, '2025-07-10'),
        (10, 15, 2, '2025-07-02'),
        (11, 25, 2, '2025-07-05');
    -- test first 15 pokemonSpecies
    INSERT INTO PokemonSpecies (speciesName, primaryTypeID, secondaryTypeID) VALUES
        ('Bulbasaur', 8, 12), ('Ivysaur', 8, 12), ('Venusaur', 8, 12),
        ('Charmander', 5, Null), ('Charmeleon', 5, Null), ('Charizard', 5, 6),
        ('Squirtle', 15, Null), ('Wartortle', 15, Null), ('Blastoise', 15, Null),
        ('Caterpie', 1, Null), ('Metapod', 1, Null), ('Butterfree', 1, 6),
        ('Weedle', 1, 12), ('Kakuna', 1, 12), ('Beedrill', 1, 12);
    -- all Types test
    INSERT INTO Types (typeName) VALUES
        ('Bug'), ('Dragon'), ('Electric'), ('Fighting'), ('Fire'),
        ('Flying'), ('Ghost'), ('Grass'), ('Ground'), ('Ice'),
        ('Normal'), ('Poison'), ('Psychic'), ('Rock'), ('Water');
    -- all badges test
    INSERT INTO Badges (badgeName, gymLocation) VALUES
        ('Boulder Badge', 'Pewter City'), ('Cascade Badge', 'Cerulean City'),
        ('Thunder Badge', 'Vermilion City'), ('Rainbow Badge', 'Celadon City'),
        ('Soul Badge', 'Fuchsia City'), ('Marsh Badge', 'Saffron City'),
        ('Volcano Badge', 'Cinnabar Island'), ('Earth Badge', 'Viridian City');
    -- test trainerbadges data
    INSERT INTO TrainerBadges (badgeID, trainerID, dateEarned) VALUES
        (1, 1, '2025-04-10'), (2, 2, '2024-03-15'), (1, 2, '2025-04-10'),
        (2, 1, '2024-03-15'), (3, 1, '2025-05-20'), (4, 2, '2025-06-01');

    SET FOREIGN_KEY_CHECKS=1;
    COMMIT;
END //

DELIMITER ;

-- Citation: Used Claude Sonnet 4 to generate PL/SQL
-- Prompt: extract essential stored procedures from existing DML.sql into organized PL.sql file
-- Selected trainer procedures and ResetDatabase to demonstrate core PL/SQL concepts without redundancy