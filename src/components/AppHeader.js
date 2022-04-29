import React, { useEffect, useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { IconButton, TextField } from '@mui/material'
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import api from 'src/views/axiosConfig'
import { cilMenu } from '@coreui/icons'
import { AppHeaderDropdown } from './header/index'
import { logo } from 'src/assets/brand/logo'
import { setSidebarShow } from 'src/slices/sidebarSlice'
import { createAlert } from 'src/slices/alertSlice'
import { setTime } from 'src/slices/timeSlice'
import { formatDate, convertNameOfDay } from 'src/utils/function'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import DatePicker from '@mui/lab/DatePicker'
import { NotifDropdown } from 'src/views/notif/user/NotifDropdown'

const AppHeader = () => {
  const dispatch = useDispatch()
  const { today } = useSelector((state) => state.today)
  const { user } = useSelector((state) => state.user)
  const [reload, setReload] = useState(false)
  const [timeValue, setTimeValue] = useState('2000-01-01')
  const [isEdit, setIsEdit] = useState(false)

  const getTime = useCallback(async () => {
    const response = await api.get(`notifs/time`)
    return response.data
  }, [])

  const putTime = async (time) => {
    await api.put(`notifs/time`, { time })
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getTime()
        dispatch(
          setTime({
            value: res,
          }),
        )
        setTimeValue(res.time)
      } catch (error) {
        if (error.response && error.response.status !== 401) {
          dispatch(
            createAlert({
              message: error.response.data.message,
              type: 'error',
            }),
          )
        }
      }
    }

    fetchData()
  }, [reload, getTime, dispatch])

  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderToggler className="ps-1" onClick={() => dispatch(setSidebarShow())}>
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderBrand className="mx-auto d-md-none" to="/">
          <CIcon icon={logo} height={48} alt="Logo" />
        </CHeaderBrand>
        <div className="ms-auto me-5 d-flex align-items-center">
          {!isEdit ? (
            <>
              <div className="me-1">
                {convertNameOfDay(
                  new Date(today.time).toLocaleDateString('en-US', { weekday: 'long' }),
                )}
                {', '}
                {formatDate(today.time)}
              </div>
              <IconButton
                onClick={() => {
                  setIsEdit(true)
                }}
                size="small"
              >
                <CalendarTodayIcon fontSize="inherit" />
              </IconButton>
            </>
          ) : (
            <>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  inputFormat="dd/MM/yyyy"
                  value={timeValue}
                  onChange={(date) => {
                    setTimeValue(date.toLocaleDateString())
                  }}
                  renderInput={(params) => <TextField size="small" {...params} />}
                />
              </LocalizationProvider>
              <IconButton
                onClick={async () => {
                  try {
                    await putTime(timeValue)
                    setIsEdit(false)
                    dispatch(
                      createAlert({
                        message: 'Thay đổi thời gian hệ thống thành công',
                        type: 'success',
                      }),
                    )
                    setReload(!reload)
                  } catch (error) {
                    if (error.response && error.response.status !== 401) {
                      dispatch(
                        createAlert({
                          message: error.response.data.message,
                          type: 'error',
                        }),
                      )
                    }
                  }
                }}
                color="success"
                size="small"
                className="ms-1"
              >
                <CheckCircleIcon fontSize="inherit" />
              </IconButton>
              <IconButton
                onClick={() => {
                  setIsEdit(false)
                }}
                color="error"
                size="small"
              >
                <CancelIcon fontSize="inherit" />
              </IconButton>
            </>
          )}
        </div>
        <CHeaderNav className="d-none d-md-flex">
          {['Giám đốc', 'Quản lý', 'Nhân viên'].includes(user.role) && (
            <CNavItem>
              <CNavLink>
                <NotifDropdown />
              </CNavLink>
            </CNavItem>
          )}
        </CHeaderNav>
        <CHeaderNav>
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
