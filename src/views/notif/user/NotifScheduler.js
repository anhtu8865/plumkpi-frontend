import React, { useState, useEffect } from 'react'
import { CCard, CCardBody, CCol, CContainer, CRow } from '@coreui/react'
import { Paper } from '@mui/material'
import { ViewState } from '@devexpress/dx-react-scheduler'
import {
  Scheduler,
  MonthView,
  Appointments,
  AppointmentTooltip,
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

  const getNotif = async () => {
    const array = []
    const response = await api.get(`notifs/user`)
    response.data.items.map((item) =>
      array.push({
        title: item.content,
        startDate: new Date(today.time.slice(0, 4), item.month - 1, item.day, 0, 0),
        endDate: new Date(today.time.slice(0, 4), item.month - 1, item.day, 23, 59),
      }),
    )
    return array
  }

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
  }, [])

  const Table = () => {
    return (
      <Paper>
        <Scheduler data={entry}>
          <ViewState currentDate={today.time} />
          <MonthView />
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
                <CRow className="mt-5">
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
