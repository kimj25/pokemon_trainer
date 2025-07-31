import { useState, useEffect } from 'react';
import GenericTableRow from '../components/GenericTableRow';

function Trainers({ backendURL }) {
  const [trainers, setTrainers] = useState([]);
  const [formData, setFormData] = useState({
      trainerName: '',
      homeTown: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const getData = async () => {
    try {
      const response = await fetch(`${backendURL}/trainers`);
      const data = await response.json();
      setTrainers(data.trainers || data);
    } catch (error) {
        console.error("Failed to fetch trainers:", error);
        setTrainers([]);
    } finally {
        setLoading(false);
    }
  };
// Citation: Used copilot to add form handling for adding new trainers
// Prompt: Create handlers for form input and submission based on the get, post, and frontend code provided
  const handleInputChange = (e) => {
    setFormData({
        ...formData,
        [e.target.name]: e.target.value
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
        const response = await fetch(`${backendURL}/trainers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert(`Trainer ${formData.trainerName} added successfully!`);
            setFormData({ trainerName: '', homeTown: '' });
            getData();
        } else {
            const errorData = await response.json();
            alert(`Failed to add trainer: ${errorData.error || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Error adding trainer:', error);
        alert('Error adding trainer. Please try again.');
    } finally {
        setSubmitting(false);
    }
  };

  useEffect(() => {getData();}, [backendURL]);

  if (loading) return <p>Loading trainers...</p>;

  // Citation: Used copilot to improve coding for adding new trainers
  // Prompt: Help me improve and correctly handle the form for adding new trainers
  return (
    <>
      <h1>Trainers</h1>

      <table>
        <thead>
          <tr>
            {Object.keys(trainers[0] || {}).map((header, idx) => (
              <th key={idx}>{header}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {trainers.map((trainer, idx) => (
            <GenericTableRow
              key={trainer.trainerID ?? idx}
              rowObject={trainer}
            />
          ))}
        </tbody>
      </table>

      <h2>Add New Trainer</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="trainerName">Trainer Name: </label>
          <input
            type="text"
            id="trainerName"
            name="trainerName"
            value={formData.trainerName}
            onChange={handleInputChange}
            required
          />
        </div>
        <br/>
        <div>
          <label htmlFor="homeTown">Home Town: </label>
          <input
            type="text"
            id="homeTown"
            name="homeTown"
            value={formData.homeTown}
            onChange={handleInputChange}
            required
          />
        </div>
        <br/>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Adding...' : 'Add Trainer'}
        </button>
      </form>
      
      <p>Total trainers: {trainers.length}</p>
    </>
  );
}

export default Trainers;