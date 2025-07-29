import React from 'react';

const TrainerBadges = () => {
  return (
    <div>
      <h1>Trainer Badges Information</h1>
      <p> Shows Trainer's Current Badge Status </p>
      
      <table border="1">
        <tr>
          <th>Trainers badge ID</th>
          <th>Trainer Name</th>
          <th>Badge Name</th>
          <th>Date Earned</th>
        </tr>
        <tr>
          <td>1</td>
          <td>Ash Ketchum</td>
          <td>Boulder Badge</td>
          <td>2024-04-10</td>
        </tr>
        <tr>
          <td>2</td>
          <td>Misty</td>
          <td>Cascade Badge</td>
          <td>2024-03-15</td>
        </tr>
      </table>
      
      <br/>
      
      <h2>Award Badge to Trainer</h2>
      <form>
        <label>Select Trainer: </label>
        <select>
          <option value="">Choose trainer...</option>
          <option value="1">Ash Ketchum</option>
          <option value="2">Misty</option>
        </select>
        <br/>
        
        <label>Select Badge: </label>
        <select>
          <option value="">Choose badge...</option>
          <option value="1">Boulder Badge</option>
          <option value="2">Cascade Badge</option>
          <option value="3">Thunder Badge</option>
          <option value="4">Rainbow Badge</option>
          <option value="5">Soul Badge</option>
          <option value="6">Marsh Badge</option>
          <option value="7">Volcano Badge</option>
          <option value="8">Earth Badge</option>          

        </select>
        <br/>
        
        <label>Date Earned: </label>
        <input type="date" />
        <br/>
        
        <button type="button">Award Badge</button>
      </form>
    </div>
  );
};

export default TrainerBadges;