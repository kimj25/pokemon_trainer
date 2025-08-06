import { useState, useEffect } from 'react';

function Trainers({ backendURL }) {
  const [trainers, setTrainers] = useState([]);
  const [formData, setFormData] = useState({
      trainerName: '',
      homeTown: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // State for inline editing
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

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
//Citation: Used Claude Sonnet 4 to help write inline editing function
//Prompt: Write Edit function for Trainers.JSX that allows inline editing for trainers
//Also incorporate existing delete function. 
  const startEdit = (trainer) => {
    setEditingId(trainer.trainerID);
    setEditData({
      trainerName: trainer.trainerName,
      homeTown: trainer.homeTown
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleEditChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  const saveEdit = async (trainerID) => {
    try {
      const response = await fetch(`${backendURL}/trainers/${trainerID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData)
      });

      if (response.ok) {
        alert('Trainer updated successfully!');
        setEditingId(null);
        setEditData({});
        getData(); // Refresh the data
      } else {
        const errorData = await response.json();
        alert(`Failed to update trainer: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating trainer:', error);
      alert('Error updating trainer. Please try again.');
    }
  };

  const handleDelete = async (trainerID) => {
    if (window.confirm('Delete this trainer record?')) {
        try {
            const response = await fetch(`${backendURL}/trainers/${trainerID}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Trainer record deleted successfully!');
                getData();
            } else {
                alert('Failed to delete trainer record');
            }
        } catch (error) {
            console.error('Error deleting trainer:', error);
            alert('Error deleting trainer record');
        }
    }
  };

  useEffect(() => { getData(); }, [backendURL]);

  if (loading) return <p>Loading trainers...</p>;

// Citation: Used copilot to improve coding for adding, deleting new trainers
// Prompt: Help me improve and correctly handle the form for adding, editing, deleting new trainers
// using inline editing abd deleting for trainers
  return (
    <>
      <h1>Trainers</h1>

      <table>
        <thead>
          <tr>
            <th>Trainer ID</th>
            <th>Trainer Name</th>
            <th>Home Town</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {trainers.map((trainer) => (
            <tr key={trainer.trainerID}>
              <td>{trainer.trainerID}</td>
              
              <td>
                {editingId === trainer.trainerID ? (
                  <input
                    type="text"
                    name="trainerName"
                    value={editData.trainerName}
                    onChange={handleEditChange}
                  />
                ) : (
                  trainer.trainerName
                )}
              </td>
              
              <td>
                {editingId === trainer.trainerID ? (
                  <input
                    type="text"
                    name="homeTown"
                    value={editData.homeTown}
                    onChange={handleEditChange}
                  />
                ) : (
                  trainer.homeTown
                )}
              </td>
              
              <td>
                {editingId === trainer.trainerID ? (
                  <>
                    <button onClick={() => saveEdit(trainer.trainerID)}>
                      Save
                    </button>
                    <button onClick={cancelEdit}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(trainer)}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(trainer.trainerID)}>
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
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