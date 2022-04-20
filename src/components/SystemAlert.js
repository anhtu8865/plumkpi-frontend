import React, { useState, useEffect } from 'react'
import { Snackbar, Alert } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { clearAlert } from 'src/slices/alertSlice'

const SystemAlert = () => {
  const { alerts } = useSelector((state) => state.notifications)
  const [alert, setAlert] = useState({ type: '', message: '' })
  const [show, setShow] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    if (alerts.length > 0) {
      setAlert(alerts[alerts.length - 1])
      setShow(true)
      dispatch(clearAlert())
    }
  }, [alerts, dispatch])

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setShow(false)
  }

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={show}
      autoHideDuration={3000}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity={alert.type} sx={{ width: '100%' }} variant="filled">
        {alert.message}
      </Alert>
    </Snackbar>
  )
}

export default SystemAlert
