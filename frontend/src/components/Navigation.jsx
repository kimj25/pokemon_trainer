import { Link } from 'react-router-dom';

function Navigation() {
    return (
        <nav>
            Navigation:
            <Link to="/">Home</Link>
            <Link to="/pokemon">Pokemon</Link>
            <Link to="/pokedex">PokeDex</Link>
            <Link to="/types">Types</Link>
        </nav>
    );
}

export default Navigation;