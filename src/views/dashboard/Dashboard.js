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
import { useHistory } from 'react-router-dom'
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft'
import EditIcon from '@mui/icons-material/Edit'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { setDashboard, setSelectedDashboard } from 'src/slices/dashboardDetailSlice'
import api from 'src/views/axiosConfig'
import PropTypes from 'prop-types'

import AddDashboardButton from './AddDashboardButton'
import DashboardDetail from './DashboardDetail'
import EditDashboardButton from './EditDashboardButton'
import DeleteDashboardButton from './DeleteDashboardButton'

const Dashboard = () => {
  const dispatch = useDispatch()

  const { reload, loading } = useSelector((state) => state.view)
  const { dashboardList } = useSelector((state) => state.dashboard)

  const { selectedDashboard } = useSelector((state) => state.dashboardDetail)

  const [entry, setEntry] = React.useState([])

  React.useEffect(() => {
    api
      .get('/dashboards')
      .then((response) => {
        dispatch(
          setDashboardList({
            value: response.data,
          }),
        )
      })
      .catch((error) => {
        if (error.response) {
          dispatch(
            createAlert({
              message: error.response.data.message,
              type: 'error',
            }),
          )
        }
      })
    dispatch(
      setLoading({
        value: false,
      }),
    )
  }, [reload, dispatch])

  React.useEffect(() => {
    setEntry(dashboardList)
    function getDashBoardId(dashboardList) {
      if (dashboardList.length > 0) {
        dispatch(setSelectedDashboard({ value: Number(dashboardList[0].dashboard_id) }))
      } else {
        return
      }
    }
    getDashBoardId(dashboardList)
  }, [dashboardList])

  const DashBoardViewNav = (props) => {
    return (
      <>
        <CRow className="d-flex justify-content-between">
          <CCol xs={12} sm={4} className="d-flex flex-row">
            <CInputGroup size="sm">
              <CInputGroupText>Dashboard</CInputGroupText>
              <CFormSelect
                value={selectedDashboard}
                onChange={(event) => {
                  dispatch(setSelectedDashboard({ value: Number(event.target.value) }))
                }}
              >
                {/* <option value={null}>---Chọn---</option> */}
                {props.dashboardList.map((item) => (
                  <option value={item.dashboard_id} key={item.dashboard_id}>
                    {item.dashboard_name}
                  </option>
                ))}
              </CFormSelect>
              <AddDashboardButton />
            </CInputGroup>
          </CCol>
          <CCol xs={12} sm={4} xl={3} className="d-flex flex-row justify-content-center">
            {/* <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddBoxIcon />}
                  sx={{ textTransform: 'none', borderRadius: 10 }}
                >
                  Thêm
                </Button> */}
          </CCol>
          <CCol xs={12} sm={4} xl={3} className="d-flex flex-row justify-content-end">
            <EditDashboardButton />
            <DeleteDashboardButton />
          </CCol>
        </CRow>
      </>
    )
  }

  DashBoardViewNav.propTypes = {
    dashboardList: PropTypes.array,
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-col">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol xs={12}>
            <CCard>
              <CCardBody className="p-5">
                <DashBoardViewNav dashboardList={entry} />
                <DashboardDetail />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
      <SystemAlert />
    </div>
  )
}

export default Dashboard
