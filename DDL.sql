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
--Insersection Table of M:N relationship
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
    ('Misty', 'Cerulean City');

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