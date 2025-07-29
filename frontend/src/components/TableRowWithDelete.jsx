import { useNavigate } from 'react-router-dom';

const TableRowWithDelete = ({ rowObject, backendURL, refreshData, DeleteFormComponent }) => {
    const navigate = useNavigate();

    const handleEdit = () => {
        // Assuming the route is /pokemon/edit/:pokemonID
        navigate(`/pokemon/${rowObject.pokemonID}`);
    };

    return (
        <tr>
            {Object.values(rowObject).map((value, index) => (
                <td key={index}>{value}</td>
            ))}
            {/*Using flexbox to keep Edit and Delete buttons side-by-side with spacing asked GPT for styling guide to stop them from stacking*/}
            <td style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button onClick={handleEdit} style={{ margin: '0.5rem' }}>
                    Edit
                </button>
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
