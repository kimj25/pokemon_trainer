

const TableRowWithDelete = ({ rowObject, backendURL, refreshData, DeleteFormComponent }) => {
  return (
    <tr>
      {Object.values(rowObject).map((value, index) => (
        <td key={index}>{value}</td>
      ))}
      <td>
        {DeleteFormComponent && (
          <DeleteFormComponent
            rowObject={rowObject}
            backendURL={backendURL}
            refreshData={refreshData}
          />
        )}
      </td>
    </tr>
  );
};

export default TableRowWithDelete;
