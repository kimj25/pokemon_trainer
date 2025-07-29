import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import PokeDex from './pages/PokeDex';
import Pokemon from './pages/Pokemons';
import Types from './pages/Types';
import UpdatePokemonForm from './components/UpdatePokemonForm';

// Components
import Navigation from './components/Navigation';

// Define the backend port and URL for API requests
const backendPort = 35729;  // Use the port you assigned to the backend server, this would normally go in a .env file
const backendURL = `http://classwork.engr.oregonstate.edu:${backendPort}`;

function App() {

    return (
        <>
            <Navigation />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/pokemon" element={<Pokemon backendURL={backendURL} />} />
                <Route path="/species" element={<PokeDex backendURL={backendURL} />} />
                <Route path="/types" element={<Types backendURL={backendURL} />} />
                <Route path="/pokemon/:id" element={<UpdatePokemonForm backendURL={backendURL} />} />
            </Routes>
        </>
    );

} 

export default App;