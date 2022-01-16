import React from 'react'
import { IconButton } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableFooter from '@mui/material/TableFooter'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import { TablePaginationActions } from 'src/components/TablePaginationActions'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}))

function createData(name, description, unit) {
  return { name, description, unit }
}

const rows = [
  createData('Tên KPI', 'Mô tả', 'VND'),
  createData('Tên KPI', 'Mô tả', 'VND'),
  createData('Tên KPI', 'Mô tả', 'VND'),
  createData('Tên KPI', 'Mô tả', 'VND'),
  createData('Tên KPI', 'Mô tả', 'VND'),
  createData('Tên KPI', 'Mô tả', 'VND'),
  createData('Tên KPI', 'Mô tả', 'VND'),
  createData('Tên KPI', 'Mô tả', 'VND'),
  createData('Tên KPI', 'Mô tả', 'VND'),
  createData('Tên KPI', 'Mô tả', 'VND'),
  createData('Tên KPI', 'Mô tả', 'VND'),
  createData('Tên KPI', 'Mô tả', 'VND'),
  createData('Tên KPI', 'Mô tả', 'VND'),
  createData('Tên KPI', 'Mô tả', 'VND'),
  createData('Tên KPI', 'Mô tả', 'VND'),
  createData('Tên KPI', 'Mô tả', 'VND'),
]

export const KpiAdminTable = () => {
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell sx={{ fontWeight: 'bold' }}>TÊN KPI</StyledTableCell>
            <StyledTableCell sx={{ fontWeight: 'bold' }}>MÔ TẢ</StyledTableCell>
            <StyledTableCell sx={{ fontWeight: 'bold' }}>ĐƠN VỊ</StyledTableCell>
            <StyledTableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row) => (
            <StyledTableRow key={row.name}>
              <StyledTableCell component="th" scope="row">
                {row.name}
              </StyledTableCell>
              <StyledTableCell>{row.description}</StyledTableCell>
              <StyledTableCell>{row.unit}</StyledTableCell>
              <StyledTableCell width={120}>
                <IconButton id="kpi-edit" color="primary">
                  <EditIcon />
                </IconButton>
                <IconButton id="kpi-delete" color="error">
                  <DeleteForeverIcon />
                </IconButton>
              </StyledTableCell>
            </StyledTableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={8} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={4}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  'aria-label': 'rows per page',
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  )
}
