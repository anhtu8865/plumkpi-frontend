import React, { useState, useEffect, useCallback } from 'react'
import { CCard, CCardBody, CCol, CContainer, CRow } from '@coreui/react'
import { Paper } from '@mui/material'
import { ViewState } from '@devexpress/dx-react-scheduler'
import {
  Scheduler,
  MonthView,
  Appointments,
  AppointmentTooltip,
  Toolbar,
  DateNavigator,
} from '@devexpress/dx-react-scheduler-material-ui'
import { LoadingCircle } from 'src/components/LoadingCircle'
import api from 'src/views/axiosConfig'
import { useDispatch, useSelector } from 'react-redux'
import SystemAlert from 'src/components/SystemAlert'
import { setLoading } from 'src/slices/viewSlice'
import { createAlert } from 'src/slices/alertSlice'

const NotifScheduler = () => {
  const dispatch = useDispatch()
  const [entry, setEntry] = useState([])
  const { loading } = useSelector((state) => state.view)
  const { today } = useSelector((state) => state.today)

  const getNotif = useCallback(async () => {
    const array = []
    const response = await api.get(`notifs/user/scheduler`)
    response.data.items.map((item) =>
      array.push({
        title: item.content,
        startDate: new Date(today.time.slice(0, 4), item.month - 1, item.day, 0, 0),
        endDate: new Date(today.time.slice(0, 4), item.month - 1, item.day, 23, 59),
      }),
    )
    return array
  }, [today.time])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getNotif()
        setEntry(result)
      } catch (error) {
        if (error.response) {
          dispatch(
            createAlert({
              message: error.response.data.message,
              type: 'error',
            }),
          )
        }
      } finally {
        dispatch(
          setLoading({
            value: false,
          }),
        )
      }
    }

    fetchData()
  }, [dispatch, getNotif])

  const Table = () => {
    return (
      <Paper>
        <Scheduler data={entry} firstDayOfWeek={1}>
          <ViewState defaultCurrentDate={today.time} />
          <MonthView />
          <Toolbar />
          <DateNavigator />
          <Appointments />
          <AppointmentTooltip />
        </Scheduler>
      </Paper>
    )
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-col">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol xs={12}>
            <CCard>
              <CCardBody className="p-5">
                <CRow className="mt-4">
                  <CCol xs={12} sm={6}>
                    <h3>
                      <b>Lịch trình kế hoạch</b>
                    </h3>
                  </CCol>
                </CRow>
                <CRow className="mt-2">
                  <Table />
                </CRow>
                {loading && <LoadingCircle />}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
      <SystemAlert />
    </div>
  )
}

export default NotifScheduler
