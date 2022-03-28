import {
  CCol,
  CForm,
  CFormFeedback,
  CFormInput,
  CFormLabel,
  CRow,
  CModal,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CModalHeader,
} from '@coreui/react'
import AddBoxIcon from '@mui/icons-material/AddBox'
import { Button } from '@mui/material'
import { useFormik } from 'formik'
import React from 'react'
import { LoadingCircle } from 'src/components/LoadingCircle'
import api from 'src/views/axiosConfig'
import * as yup from 'yup'
import { useDispatch } from 'react-redux'
import { createAlert } from 'src/slices/alertSlice'
import { setDepartmentLoading, setDepartmentReload } from 'src/slices/departmentSlice'

const AddDepartment = () => {
  const dispatch = useDispatch()
  const [modalVisible, setModalVisible] = React.useState(false)
  const validationSchema = yup.object({
    dept_name: yup.string().required('Đây là trường bắt buộc'),
  })

  const formik = useFormik({
    initialValues: { dept_name: '', description: '' },
    validateOnBlur: true,
    onSubmit: (values, { resetForm }) => {
      api
        .post('depts', { dept_name: values.dept_name, description: values.description })
        .then(() => {
          dispatch(
            createAlert({
              message: 'Tạo phòng ban mới thành công.',
              type: 'success',
            }),
          )
          dispatch(
            setDepartmentLoading({
              value: true,
            }),
          )
          dispatch(setDepartmentReload())
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
      resetForm()
    },
    validationSchema: validationSchema,
  })
  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddBoxIcon />}
        onClick={() => setModalVisible(true)}
        sx={{ textTransform: 'none', borderRadius: 10 }}
      >
        Thêm phòng ban
      </Button>

      <form onSubmit={formik.handleSubmit}>
        <CModal
          alignment="center"
          scrollable
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        >
          <CModalHeader>
            <CModalTitle>Thêm phòng ban mới</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CRow className="mt-2 mb-2">
              <CCol>
                <CFormLabel htmlFor="inputDeptName">Tên phòng ban</CFormLabel>
                <CFormInput
                  name="dept_name"
                  id="inputDeptName"
                  value={formik.values.dept_name}
                  onChange={formik.handleChange}
                  invalid={formik.touched.dept_name && formik.errors.dept_name ? true : false}
                  valid={
                    !formik.touched.dept_name ||
                    (formik.touched.dept_name && formik.errors.dept_name)
                      ? false
                      : true
                  }
                />
                <CFormFeedback invalid>{formik.errors.dept_name}</CFormFeedback>
              </CCol>
            </CRow>
            <CRow className="mt-2 mb-2">
              <CCol>
                <CFormLabel htmlFor="inputDeptName">Mô tả</CFormLabel>
                <CFormInput
                  name="description"
                  id="inputDeptName"
                  value={formik.values.description}
                  onChange={formik.handleChange}
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

export default AddDepartment
