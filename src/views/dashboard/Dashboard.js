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
import AddIcon from '@mui/icons-material/Add'
import api from 'src/views/axiosConfig'
import PropTypes from 'prop-types'

const Dashboard = () => {
  const history = useHistory()
  const dispatch = useDispatch()

  const { reload, loading } = useSelector((state) => state.view)
  const { dashboardList } = useSelector((state) => state.dashboard)

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
  }, [dashboardList])

  const NoDashBoardView = () => {
    return (
      <>
        <CCard>
          <CCardBody className="p-5">
            <CRow className="mt-5">
              <CCol xs={12} className="text-center">
                <h2 style={{ marginBottom: '20px' }}>
                  <>Người dùng chưa có số liệu để tạo dashboard</>
                </h2>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<KeyboardDoubleArrowLeftIcon />}
                  onClick={() => {
                    history.push(`plan`)
                  }}
                  sx={{ textTransform: 'none', borderRadius: 10 }}
                >
                  Nhập số liệu
                </Button>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </>
    )
  }

  const HasDashBoardView = (props) => {
    return (
      <>
        <CCard>
          <CCardBody className="p-5">
            <CRow className="d-flex justify-content-between">
              <CCol xs={12} sm={4} xl={3} className="d-flex flex-row">
                <CInputGroup size="sm">
                  <CInputGroupText>Dashboard</CInputGroupText>
                  <CFormSelect
                  // value={selectedMonth}
                  // onChange={(event) => {
                  //   dispatch(setSelectedMonth({ value: Number(event.target.value) }))
                  // }}
                  >
                    {entry.map((item) => (
                      <option value={item.dashboard_id} key={item.dashboard_id}>
                        {item.dashboard_name}
                      </option>
                    ))}
                  </CFormSelect>
                  <IconButton id="edit" color="primary" size="small">
                    <AddIcon fontSize="small" />
                  </IconButton>
                </CInputGroup>
              </CCol>
              <CCol xs={12} sm={4} xl={3} className="d-flex flex-row justify-content-center">
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ textTransform: 'none', borderRadius: 10 }}
                >
                  Thêm biểu đồ
                </Button>
              </CCol>
              <CCol xs={12} sm={4} xl={3} className="d-flex flex-row justify-content-end">
                <Tooltip title="Chỉnh sửa dashboard">
                  <IconButton id="edit" color="primary" size="small">
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Xóa dashboard">
                  <IconButton id="delete" color="error" size="small">
                    <DeleteForeverIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </>
    )
  }

  HasDashBoardView.propTypes = {
    dashboardList: PropTypes.array,
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-col">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol xs={12}>
            <HasDashBoardView dashboardList={entry} />
          </CCol>
        </CRow>
      </CContainer>
      <SystemAlert />
    </div>
  )
}

export default Dashboard
