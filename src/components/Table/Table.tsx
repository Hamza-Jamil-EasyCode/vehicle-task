'use client';
import React, { useState } from 'react';
import { AllCommunityModule, DomLayoutType, ModuleRegistry, themeMaterial, themeQuartz } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';

import './Table.scss';
import { Box, InputAdornment, TextField, useTheme } from '@mui/material';
import colors from '@common/colors';
import SearchIcon from '@mui/icons-material/Search';

ModuleRegistry.registerModules([AllCommunityModule]);

interface TableInterface {
    data: Array<any>;
    columns: Array<any>;
}

const Table: React.FC<TableInterface> = ({ data, columns }) => {
    const isSmallScreen = window.innerWidth <= 1200;
    const [quickFilterText, setQuickFilterText] = useState('')
    const paginationPageSize = 10;
    const theme = useTheme();

    function getGridOptions() {
        const gridOptions = {
            domLayout: 'autoHeight' as DomLayoutType,
            suppressAutoSize: true,
            suppressColumnVirtualisation: false,
            suppressPaginationPanel: false,
            overlayLoadingTemplate: 'Loading...',
            embedFullWidthRows: true,
            suppressRowTransform: true,
            overlayNoRowsTemplate: '<span>No data found</span>',
            defaultColDef: {}
        };

        if (!isSmallScreen) {
            gridOptions.defaultColDef = {
                flex: 1,
                resizable: true
            };
        }

        return gridOptions;
    }

    const gridOptions = getGridOptions();

    const isDarkMode = theme.palette.mode === 'dark';

    const lightTheme = themeMaterial.withParams({
        backgroundColor: colors.lightPaperColor,
        foregroundColor: '#000',
        headerTextColor: '#000',
        headerBackgroundColor: 'rgb(0, 0, 0, 0.03)',
        oddRowBackgroundColor: 'rgb(0, 0, 0, 0.03)'
    });

    const darkTheme = themeMaterial.withParams({
        backgroundColor: colors.darkPaperColor,
        foregroundColor: '#fff',
        headerTextColor: '#fff',
        headerBackgroundColor: colors.darkBackgroundColor,
        oddRowBackgroundColor: colors.darkBackgroundColor
    });

    return (
        <Box>
            <TextField
                placeholder="Search..."
                size="small"
                value={quickFilterText}
                onChange={(e) => setQuickFilterText(e.target.value)}
                sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: theme.palette.background.paper
                    }
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    )
                }}
                inputProps={{ 'aria-label': 'Search table' }}
            />
            <AgGridReact
                rowData={data}
                theme={isDarkMode ? darkTheme : lightTheme}
                columnDefs={columns}
                pagination
                paginationPageSize={paginationPageSize}
                paginationPageSizeSelector={[paginationPageSize, paginationPageSize * 2, paginationPageSize * 3]}
                gridOptions={gridOptions}
                quickFilterText={quickFilterText}
            />
        </Box>
    );
};

export default Table;
