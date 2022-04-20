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
  CFormTextarea,
} from '@coreui/react'
import AddIcon from '@mui/icons-material/Add'
import AddBoxIcon from '@mui/icons-material/AddBox'
import { Button, IconButton } from '@mui/material'
import { useFormik } from 'formik'
import React from 'react'
import { useDispatch } from 'react-redux'
import { LoadingCircle } from 'src/components/LoadingCircle'
import { createAlert } from 'src/slices/alertSlice'
import { setLoading, setReload } from 'src/slices/viewSlice'
import api from 'src/views/axiosConfig'
import * as yup from 'yup'

const AddDashboardButton = () => {
  const dispatch = useDispatch()
  const [modalVisible, setModalVisible] = React.useState(false)

  const validationSchema = yup.object({
    dashboard_name: yup.string().required('Đây là trường bắt buộc'),
  })

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      dashboard_name: '',
      description: '',
    },
    validateOnBlur: true,
    onSubmit: (values) => {
      // console.log(values)
      api
        .post('dashboards', {
          dashboard_name: values.dashboard_name,
          description: values.description,
        })
        .then(() => {
          dispatch(
            createAlert({
              message: 'Tạo bảng điều khiển mới thành công.',
              type: 'success',
            }),
          )
          dispatch(
            setLoading({
              value: true,
            }),
          )
          dispatch(setReload())
          setModalVisible(false)
        })
        .catch((error) => {
          dispatch(
            createAlert({
              message: error.response.data.message,
              type: 'error',
            }),
          )
        })
        .finally(() => {
          formik.setSubmitting(false)
        })

      //resetForm()
    },
    validationSchema: validationSchema,
  })
  return (
    <>
      <IconButton id="add" color="primary" size="small" onClick={() => setModalVisible(true)}>
        <AddIcon fontSize="small" />
      </IconButton>
      <form onSubmit={formik.handleSubmit}>
        <CModal
          alignment="center"
          scrollable
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        >
          <CModalHeader>
            <CModalTitle>Thêm bảng điều khiển</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CRow className="mt-2">
              <CCol>
                <CFormLabel htmlFor="inputFirstName">Tên dashboard</CFormLabel>
                <CFormInput
                  id="inputFirstName"
                  {...formik.getFieldProps('dashboard_name')}
                  invalid={
                    formik.touched.dashboard_name && formik.errors.dashboard_name ? true : false
                  }
                  valid={
                    !formik.touched.dashboard_name ||
                    (formik.touched.dashboard_name && formik.errors.dashboard_name)
                      ? false
                      : true
                  }
                />

                <CFormFeedback invalid>{formik.errors.dashboard_name}</CFormFeedback>
              </CCol>
            </CRow>
            <CRow className="mt-4">
              <CCol>
                <CFormLabel htmlFor="inputDes">Mô tả</CFormLabel>
                <CFormTextarea
                  id="inputDes"
                  rows={2}
                  type="text"
                  {...formik.getFieldProps('description')}
                  invalid={formik.touched.description && formik.errors.description ? true : false}
                  valid={
                    !formik.touched.description ||
                    (formik.touched.description && formik.errors.description)
                      ? false
                      : true
                  }
                />

                <CFormFeedback invalid>{formik.errors.description}</CFormFeedback>
              </CCol>
            </CRow>
          </CModalBody>
          <CModalFooter>
            <Button
              variant="contained"
              color="success"
              startIcon={<AddBoxIcon />}
              type="submit"
              onClick={formik.submitForm}
              disabled={formik.isSubmitting}
              sx={{ textTransform: 'none', borderRadius: 10 }}
            >
              Thêm
            </Button>
            {formik.isSubmitting && <LoadingCircle />}
          </CModalFooter>
        </CModal>
      </form>
    </>
  )
}

export default AddDashboardButton
