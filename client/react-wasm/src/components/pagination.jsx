import React, { useState } from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';



function PaginationRecords({ data, setVisibleData,setStartIndex }) {

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 100;

    //pagination
    const totalPages = Math.ceil(data.length / pageSize);

    const handlePageChange = (event, value) => {
        setCurrentPage(value); // Update the current page
        const startIndex = (value - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        setVisibleData(data.slice(startIndex, endIndex));
        setStartIndex(startIndex)
    }
    return (
        <Stack spacing={pageSize}>
             <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                showFirstButton
                showLastButton
            />

        </Stack>

    )

}

export default PaginationRecords