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

const DashboardDetail = () => {
  const history = useHistory()
  const dispatch = useDispatch()

  const { reload, loading } = useSelector((state) => state.view)
  const { selectedDashboard } = useSelector((state) => state.dashboardDetail)

  return (
    <>
      <h1>{selectedDashboard}</h1>
    </>
  )
}

export default DashboardDetail
