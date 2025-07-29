Delimiter //

-- Drops all procedures if they exist
-- This is useful for development to ensure we can recreate procedures without conflicts
Drop Procedure If Exists GetAllPokemons //
Drop Procedure If Exists GetAllTypes //
Drop Procedure If Exists GetAllSpecies //
Drop Procedure If Exists GetSpeciesByTypeWithPagination //
Drop Procedure If Exists DeletePokemonById //

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

Delimiter ;
