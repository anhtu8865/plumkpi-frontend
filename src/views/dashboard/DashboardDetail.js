import React from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableFoot,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CInputGroup,
  CInputGroupText,
  CFormSelect,
} from '@coreui/react'
import { Avatar, Button, Grid, Pagination, IconButton, Tooltip } from '@mui/material'
import { setDashboardList } from 'src/slices/dashboardSlice'
import SystemAlert from 'src/components/SystemAlert'
import { LoadingCircle } from 'src/components/LoadingCircle'
import { createAlert } from 'src/slices/alertSlice'
import { setLoading, setReload } from 'src/slices/viewSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft'
import EditIcon from '@mui/icons-material/Edit'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import AddIcon from '@mui/icons-material/Add'
import api from 'src/views/axiosConfig'
import PropTypes from 'prop-types'
import AddDashboardButton from './AddDashboardButton'
import { CreateChartButton } from './CreateChartButton'

const DashboardDetail = () => {
  const history = useHistory()
  const dispatch = useDispatch()

  const { reload, loading } = useSelector((state) => state.view)
  const { selectedDashboard } = useSelector((state) => state.dashboardDetail)

  return (
    <>
      <CRow className="mt-4">
        <CCol xs={12} sm={6}>
          <h3>{selectedDashboard}</h3>
        </CCol>
        <CCol xs={12} sm={6} className="d-flex flex-row gap-1 justify-content-end">
          <CreateChartButton />
          <Button
            variant="contained"
            color="primary"
            sx={{ textTransform: 'none', borderRadius: 10 }}
          >
            Tạo báo cáo
          </Button>
        </CCol>
      </CRow>
    </>
  )
}

export default DashboardDetail
