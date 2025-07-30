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
Drop Procedure If Exists InsertTrainers //
Drop Procedure If Exists GetAllTrainerBadges //

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


DELIMITER ;
