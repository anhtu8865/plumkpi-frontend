import React from 'react'
import {
  CCol,
  CFormLabel,
  CFormInput,
  CRow,
  CModal,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CModalHeader,
  CFormFeedback,
  CFormTextarea,
} from '@coreui/react'
import { Button } from '@mui/material'
import { LoadingCircle } from 'src/components/LoadingCircle'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import CheckIcon from '@mui/icons-material/Check'
import api from 'src/views/axiosConfig'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useDispatch } from 'react-redux'
import { createAlert } from 'src/slices/alertSlice'
import { setReload, setLoading } from 'src/slices/viewSlice'

export const AddCategoryButton = () => {
  const dispatch = useDispatch()
  const [modalVisible, setModalVisible] = React.useState(false)
  const ValidationSchema = yup.object({
    addcat: yup.string().required('Đây là trường bắt buộc'),
  })

  const formik = useFormik({
    initialValues: {
      addcat: '',
      description: '',
    },
    validationSchema: ValidationSchema,
    onSubmit: (values) => {
      api
        .post(`/kpi-categories/`, {
          kpi_category_name: values.addcat,
          description: values.description,
        })
        .then(() => {
          dispatch(
            createAlert({
              message: 'Tạo danh mục mới thành công.',
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
    },
  })

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setModalVisible(true)}
        startIcon={<AddCircleIcon />}
        sx={{ textTransform: 'none', borderRadius: 10 }}
      >
        Tạo danh mục KPI
      </Button>

      <form onSubmit={formik.handleSubmit}>
        <CModal
          alignment="center"
          scrollable
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        >
          <CModalHeader>
            <CModalTitle>Tạo danh mục KPI mới</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CRow className="mt-2">
              <CCol xs>
                <CFormLabel htmlFor="editcat">Tên danh mục</CFormLabel>
                <CFormInput
                  id="addcat"
                  placeholder="Nhập tên danh mục mới..."
                  value={formik.values.addcat}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  invalid={formik.touched.addcat && formik.errors.addcat ? true : false}
                  valid={
                    !formik.touched.addcat || (formik.touched.addcat && formik.errors.addcat)
                      ? false
                      : true
                  }
                />
                <CFormFeedback invalid>{formik.errors.addcat}</CFormFeedback>
              </CCol>
            </CRow>
            <CRow className="mt-3 mb-2">
              <CCol>
                <CFormLabel htmlFor="description">Mô tả</CFormLabel>
                <CFormTextarea
                  id="description"
                  placeholder="Nhập mô tả danh mục..."
                  rows={2}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </CCol>
            </CRow>
          </CModalBody>
          <CModalFooter>
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckIcon />}
              type="submit"
              onClick={formik.submitForm}
              disabled={formik.isSubmitting}
              sx={{ textTransform: 'none', borderRadius: 10 }}
            >
              Tạo mới
            </Button>
            {formik.isSubmitting && <LoadingCircle />}
          </CModalFooter>
        </CModal>
      </form>
    </>
  )
}
