import { Link } from 'react-router-dom';

function Navigation() {
    return (
        <nav>
            Navigation:
            <Link to="/">Home</Link>
            <Link to="/pokemon">Pokemon</Link>
            <Link to="/species">PokeDex</Link>
            <Link to="/types">Types</Link>
            <Link to="/trainers">Trainers</Link>
            <Link to="/badges">Badges</Link>
            <Link to="/trainerbadges">Trainer Badges</Link> 
        </nav>
    );
}

export default Navigation;