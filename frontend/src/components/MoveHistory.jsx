import React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const MoveHistory = ({ chess }) => {
    let moves = chess.history();
    const rows = [];
    for (let i = 0; i < moves.length; i += 2) {
        let data = {};
        data.id = i + 1;
        data.white = moves[i];
        if (i + 1 < moves.length) data.black = moves[i + 1];
        rows.push(data);
    }

    const columns = [
        { field: 'id', headerName: 'No', width: 90 },
        { field: 'white', headerName: 'White', width: 100, editable: false },
        { field: 'black', headerName: 'Black', width: 100, editable: false },
    ];

    return (
        <div style={{ height: 400, width: '100%', backgroundColor: 'white',overflow: 'hidden' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                pagination={false} // Disable pagination
                disableColumnMenu // Disable column menu
                disableSelectionOnClick // Disable row selection
                hideFooterPagination
                hideFooterSelectedRowCount
                hideFooter
            />
        </div>
    );
};

export default MoveHistory;
