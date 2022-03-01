import {
  CCol,
  CFormFeedback,
  CFormSelect,
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
import CheckIcon from '@mui/icons-material/Check'

const AddKpiRegistration = () => {
  const [modalVisible, setModalVisible] = React.useState(false)
  // const [modalVisible2, setModalVisible2] = React.useState(false)
  const [personalKpisList, setPersonalKpisList] = React.useState([])

  return (
    <>
      <CCol md={12}>
        <CFormLabel htmlFor="inputEmail4">Nhập mục tiêu đề ra</CFormLabel>
        <CFormInput type="email" id="inputEmail4" value="Đây là thông tin" disabled />
      </CCol>
    </>
  )
}

export default AddKpiRegistration
