import { useState, useEffect, use } from 'react';


function TrainerBadges({ backendURL }) {
    const [trainerBadges, setTrainerBadges] = useState([]);
    const [trainers, setTrainers] = useState([]); // for dropdown menu in the form
    const [badges, setBadges] = useState([]);
    const [formData, setFormData] = useState({
        trainerID: '',
        badgeID: '',
        dateEarned: ''
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

  // Formatter helper function to format date as MM/DD/YYYY
    const formatDate = (isoDate) => {
        if (!isoDate) return "NULL";
        const date = new Date(isoDate);
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const yyyy = date.getFullYear();
        return `${mm}/${dd}/${yyyy}`;
};

    // Fetch trainer badges data
    const getTrainerBadgesData = async () => {
      try {
          const response = await fetch(`${backendURL}/trainerbadges`);
          const data = await response.json();
          setTrainerBadges(data.trainerBadges || data);
      } catch (error) {
          console.error("Failed to fetch trainer badges:", error);
          setTrainerBadges([]);
      } finally {
          setLoading(false);  
    }}


    // Fetch trainers data for dropdown
    const getTrainersData = async () => {
        try {
            const response = await fetch(`${backendURL}/trainers`);
            const data = await response.json();
            setTrainers(data.trainers || data);
        } catch (error) {
            console.error("Failed to fetch trainers:", error);
            setTrainers([]);
        }
    };

    // Fetch badges data for dropdown
    const getBadgesData = async () => {
        try {
            const response = await fetch(`${backendURL}/badges`);
            const data = await response.json();
            setBadges(data.badges || data);
        } catch (error) {
            console.error("Failed to fetch badges:", error);
            setBadges([]);
        }
    };
    
    //fetch all data simultaneously
    const getData = async () => {
        await Promise.all([
            getTrainerBadgesData(),
            getTrainersData(),
            getBadgesData()
        ]);
    }
    
    // Handle form inputs
    const handleInputChange = (e) => {
      setFormData({
          ...formData,  //keep existing form data
          [e.target.name]: e.target.value // update target field
      });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const response = await fetch(`${backendURL}/trainerbadges`, {
              method: 'POST', 
              headers: {
                  'content-type': 'application/json',
              },
              body: JSON.stringify(formData)
              });
            
            if (response.ok) {
              alert('Trainer badge record added successfully!');
              setFormData({ trainerID: '', badgeID: '', dateEarned: '' });
              getTrainerBadgesData();
            }else {
              const errorData = await response.json();
              alert(`Failed to add trainer badge: ${errorData.error || 'Unknown error'}`);
            }
          } catch (error) {
            console.error('Error cannot add trainer badge:', error);
            alert('Error adding trainer badge. Please try again.');
          } finally { 
            setSubmitting(false);
          }
        };

      const handleDelete = async (trainerBadgeID) => {
    if (window.confirm('Delete this trainer badge record?')) {
        try {
            const response = await fetch(`${backendURL}/trainerbadges/${trainerBadgeID}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Trainer badge record deleted successfully!');
                getTrainerBadgesData(); // Refresh the data
            } else {
                alert('Failed to delete trainer badge record');
            }
        } catch (error) {
            console.error('Error deleting trainer badge:', error);
            alert('Error deleting trainer badge record');
        }
    }
        };

      useEffect(() => {
        getData();
    }, [backendURL]);
  
  return (

    <div>
      <h1>Trainer Badges Information</h1>
      <p> Shows Trainer's Current Badge Status </p>
      
    <table border="1">
    <thead>
      <tr>
        <th>Trainer Badge ID</th>
        <th>Trainer Name</th>
        <th>Badge Name</th>
        <th>Date Earned</th>
        <th>Actions</th>
      </tr>
    </thead>

    <tbody>
      {trainerBadges.map((trainerBadge, idx) => (
        <tr key={trainerBadge.trainerBadgeID || idx}>
          <td>{trainerBadge.trainerBadgeID}</td>
          <td>{trainerBadge.trainerName}</td>
          <td>{trainerBadge.badgeName}</td>
          <td>{formatDate(trainerBadge.dateEarned)}</td>
          <td>
            <button onClick={() => handleEdit(trainerBadge.trainerBadgeID)}>Edit</button>
            <button onClick={() => handleDelete(trainerBadge.trainerBadgeID)}>Delete</button>
          </td>
        </tr>
      ))}
    </tbody>
    </table>
      
      <br/>
      
      <h2>Award Badge to Trainer</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="trainerID">Trainer: </label>
                    <select
                        id="trainerID"
                        name="trainerID"
                        value={formData.trainerID}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Select a trainer...</option>
                        {trainers.map(trainer => (
                            <option key={trainer.trainerID} value={trainer.trainerID}>
                                {trainer.trainerName} - {trainer.homeTown}
                            </option>
                        ))}
                    </select>
                </div>
                <br/>
                
                <div>
                    <label htmlFor="badgeID">Badge: </label>
                    <select
                        id="badgeID"
                        name="badgeID"
                        value={formData.badgeID}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Select a badge...</option>
                        {badges.map(badge => (
                            <option key={badge.badgeID} value={badge.badgeID}>
                                {badge.badgeName}
                            </option>
                        ))}
                    </select>
                </div>
                <br/>
                
                <div>
                    <label htmlFor="dateEarned">Date Earned: </label>
                    <input
                        type="date"
                        id="dateEarned"
                        name="dateEarned"
                        value={formData.dateEarned}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <br/>
                
                <button type="submit" disabled={submitting}>
                    {submitting ? 'Adding...' : 'Award Badge'}
                </button>
            </form>
            
            <p>Total trainer badge records: {trainerBadges.length}</p>
        </div>
    );
}

export default TrainerBadges;