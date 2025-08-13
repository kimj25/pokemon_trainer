// GenericTableRow as resuable component to map over rowObjects from the db
const GenericTableRow = ({ rowObject }) => {
  return (
    <tr>
      {Object.values(rowObject).map((value, index) => (
        <td key={index}>{value}</td>
      ))}
    </tr>
  );
};

export default GenericTableRow;
