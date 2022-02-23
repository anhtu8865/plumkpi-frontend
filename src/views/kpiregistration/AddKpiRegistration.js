import {
  CCol,
  CFormFeedback,
  CFormInput,
  CFormLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import AddBoxIcon from '@mui/icons-material/AddBox'
import { Button } from '@mui/material'
import { Field, FormikProvider, useFormik } from 'formik'
import React from 'react'
import { useDispatch } from 'react-redux'
import { LoadingCircle } from 'src/components/LoadingCircle'
import { createAlert } from 'src/slices/alertSlice'
import { setUserLoading, setUserReload } from 'src/slices/userSlice'
import api from 'src/views/axiosConfig'
import * as yup from 'yup'

const AddKpiRegistration = () => {
  return (
    <>
      <Button variant="contained" color="primary" startIcon={<AddBoxIcon />}>
        Đăng kí KPI
      </Button>
    </>
  )
}

export default AddKpiRegistration
