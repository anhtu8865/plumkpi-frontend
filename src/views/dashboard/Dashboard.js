import {
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import PropTypes from 'prop-types'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Select from 'react-select'
import SystemAlert from 'src/components/SystemAlert'
import { createAlert } from 'src/slices/alertSlice'
import { setSelectedDashboard } from 'src/slices/dashboardDetailSlice'
import { setDashboardList } from 'src/slices/dashboardSlice'
import { setLoading } from 'src/slices/viewSlice'
import api from 'src/views/axiosConfig'
import AddDashboardButton from './AddDashboardButton'
import DashboardDetail from './DashboardDetail'
import DeleteDashboardButton from './DeleteDashboardButton'
import EditDashboardButton from './EditDashboardButton'

const Dashboard = () => {
  const dispatch = useDispatch()

  const { reload } = useSelector((state) => state.view)
  const { dashboardList } = useSelector((state) => state.dashboard)

  const { selectedDashboard } = useSelector((state) => state.dashboardDetail)

  const [entry, setEntry] = React.useState([])

  const [options, setOptions] = React.useState([])
  const [dashboard, setDashboard] = React.useState(null)

  const getDashBoardOptions = (dashboardList) => {
    const array = []
    if (dashboardList.length > 0) {
      for (let i = 0; i < dashboardList.length; i++) {
        let optionTmp = {}
        optionTmp.value = dashboardList[i].dashboard_id
        optionTmp.label = dashboardList[i].dashboard_name
        array.push(optionTmp)
      }
      return array
    } else {
      return
    }
  }

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

    setOptions(getDashBoardOptions(dashboardList))
  }, [dashboardList])

  React.useEffect(() => {
    function getDashBoardId(dashboard) {
      if (dashboard) {
        dispatch(setSelectedDashboard({ value: Number(dashboard.value) }))
      } else {
        return
      }
    }
    getDashBoardId(dashboard)
  }, [dashboard, dispatch])

  const DashBoardViewNav = (props) => {
    return (
      <>
        <CRow className="d-flex justify-content-between">
          <CCol xs={12} sm={6} className="d-flex flex-row">
            <CInputGroup size="sm">
              <CInputGroupText>Dashboard</CInputGroupText>
              <Select
                options={options}
                defaultValue={dashboard}
                onChange={setDashboard}
                isSearchable
                placeholder="Chọn dashboard..."
              />
              <AddDashboardButton />
            </CInputGroup>
          </CCol>
          <CCol xs={12} sm={6} className="d-flex flex-row justify-content-end">
            {selectedDashboard && (
              <>
                <EditDashboardButton />
                <DeleteDashboardButton />
              </>
            )}
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
