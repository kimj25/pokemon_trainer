import { useState, useEffect } from 'react';
import GenericTableRow from '../components/GenericTableRow';

function Trainers({ backendURL }) {
  const [trainers, setTrainers] = useState([]);

  const getData = async () => {
    try {
        console.log('📡 Fetching trainers data from:', `${backendURL}/trainers`);
      const response = await fetch(`${backendURL}/trainers`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const { trainers } = await response.json();
      setTrainers(trainers ?? []);
    } catch (error) {
      console.error("Failed to fetch trainers data:", error);
      setTrainers([]);
    }
  };

  useEffect(() => {
    getData();
  }, [backendURL]);

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
    </>
  );
}

export default Trainers;
