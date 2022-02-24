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
  const [modalVisible2, setModalVisible2] = React.useState(false)
  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddBoxIcon />}
        onClick={() => {
          setModalVisible(true)
        }}
      >
        Đăng kí KPI
      </Button>
      <form>
        <CModal
          alignment="center"
          scrollable
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        >
          <CModalHeader>
            <CModalTitle>Đăng ký KPI cá nhân</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CCol md={12}>
              <CFormLabel htmlFor="inputEmail4">Chọn kế hoạch</CFormLabel>
              <CFormSelect id="inputState">
                <option>Choose...</option>
                <option>Plan 1</option>
              </CFormSelect>
            </CCol>
            <CCol md={12}>
              <CFormLabel htmlFor="inputEmail4">Chọn KPI</CFormLabel>
              <CFormSelect id="inputState">
                <option>Choose...</option>
                <option>KPI template 1</option>
              </CFormSelect>
            </CCol>
            <CCol md={12}>
              <CFormLabel htmlFor="inputEmail4">Nhập mục tiêu đề ra</CFormLabel>
              <CFormInput type="email" id="inputEmail4" />
            </CCol>
          </CModalBody>
          <CModalFooter>
            <Button
              variant="contained"
              color="success"
              startIcon={<AddBoxIcon />}
              type="submit"
              onClick={() => {
                setModalVisible2(true)
              }}
              // disabled={formik.isSubmitting}
            >
              Next
            </Button>
            {/* {formik.isSubmitting && <LoadingCircle />} */}
          </CModalFooter>
        </CModal>
      </form>
    </>
  )
}

export default AddKpiRegistration
