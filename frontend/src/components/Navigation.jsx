import { Link } from 'react-router-dom';

function Navigation({ backendURL }) {
    // Function to handle database reset
    // This function will call the backend endpoint to reset the database
    // Citation: GitHub Copilot suggestion for handleReset
    const handleReset = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${backendURL}/reset`, {
                method: 'POST',
            });
            if (response.ok) {
                alert('Database reset successfully!');
                window.location.reload(); // Reload the page to reflect changes
            } else {
                alert('Failed to reset database');
            }
        } catch (err) {
            alert('Error resetting database');
        }
    };

    // Navigation component renders links to different pages and reset button has an onClick handler
    // The links are styled with flexbox for better layout
    return (
        <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            Navigation:
            <Link to="/">Home</Link>
            <Link to="/pokemon">Pokemon</Link>
            <Link to="/species">PokeDex</Link>
            <Link to="/types">Types</Link>
            <Link to="/trainers">Trainers</Link>
            <Link to="/badges">Badges</Link>
            <Link to="/trainerbadges">Trainer Badges</Link>
            <button onClick={handleReset}>Reset Database</button>
        </nav>
    );
}

export default Navigation;