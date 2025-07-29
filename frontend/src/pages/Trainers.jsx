import React from 'react';

const Trainers = () => {
  return (
    <div>
      <h1>Trainers</h1>
      
      <table border="1">
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Town</th>
        </tr>
        <tr>
          <td>1</td>
          <td>Ash</td>
          <td>Pallet Town</td>
        </tr>
        <tr>
          <td>2</td>
          <td>Misty</td>
          <td>Cerulean City</td>
        </tr>
      </table>
      
      <br/>
      
      <form>
        <label>Trainer Name: </label>
        <input type="text" />
        <br/>
        <label>Home Town: </label>
        <input type="text" />
        <br/>
        <button type="button">Add Trainer</button>
      </form>
    </div>
  );
};

export default Trainers;