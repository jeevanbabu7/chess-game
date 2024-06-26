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
        { field: 'white', headerName: 'White', width: 120, editable: false },
        { field: 'black', headerName: 'Black', width: 120, editable: false },
    ];

    return (
        <div style={{ height: 400, width: '100%',overflow: 'hidden'}}>
            <DataGrid
                rows={rows}
                columns={columns}
                disableColumnMenu // Disable column menu
                disableSelectionOnClick // Disable row selection
                hideFooterPagination
                hideFooterSelectedRowCount
                hideFooter
                
                sx={{
                    '& .MuiDataGrid-columnHeader': {
                        backgroundColor: "#302E2B",
                        color: "white",
                        fontWeight: 700,
                        border: "1px solid #1A1A18",
                    },
                    '& .MuiDataGrid-cell': {
                        border: "1px solid #1A1A18",
                    },
                    "& .MuiDataGrid-row": {
                        border: "1px solid #1A1A18",
                        borderRadius: "5px",
                        width: "calc(100% - 2px)",
                    },
                    '.MuiDataGrid-columnSeparator': {
                        display: 'none',
                    },
                    '& .MuiDataGrid-row:nth-child(even)': {
                        backgroundColor: '#302E2B',
                    },
                    color: "white" // If you want to set a default color for text, place it outside the specific class selectors.
                }}
                
               
            />
        </div>
    );
};

export default MoveHistory;
