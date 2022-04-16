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
import PropTypes from 'prop-types'
import { Button, IconButton } from '@mui/material'
import { LoadingCircle } from 'src/components/LoadingCircle'
import EditIcon from '@mui/icons-material/Edit'
import CheckIcon from '@mui/icons-material/Check'
import api from 'src/views/axiosConfig'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useDispatch } from 'react-redux'
import { createAlert } from 'src/slices/alertSlice'
import { setReload, setLoading } from 'src/slices/viewSlice'

export const EditCategoryButton = (props) => {
  const dispatch = useDispatch()
  const [modalVisible, setModalVisible] = React.useState(false)
  const ValidationSchema = yup.object({
    editcat: yup.string().required('Đây là trường bắt buộc'),
  })

  const formik = useFormik({
    initialValues: {
      editcat: props.inCat.kpi_category_name,
      description: props.inCat.description,
    },
    validationSchema: ValidationSchema,
    onSubmit: (values) => {
      api
        .put(`/kpi-categories/${props.inCat.kpi_category_id}`, {
          kpi_category_name: values.editcat,
          description: values.description,
        })
        .then(() => {
          dispatch(
            createAlert({
              message: 'Cập nhật danh mục thành công.',
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
      <IconButton
        id="cat-name-edit"
        color="primary"
        onClick={() => {
          setModalVisible(true)
        }}
        size="small"
      >
        <EditIcon fontSize="small" />
      </IconButton>

      <form onSubmit={formik.handleSubmit}>
        <CModal
          alignment="center"
          scrollable
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        >
          <CModalHeader>
            <CModalTitle>Chỉnh sửa danh mục KPI</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CRow className="mt-2 mb-2">
              <CCol xs>
                <CFormLabel htmlFor="editcat">Tên danh mục</CFormLabel>
                <CFormInput
                  id="editcat"
                  placeholder="Nhập tên danh mục..."
                  value={formik.values.editcat}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  invalid={formik.touched.editcat && formik.errors.editcat ? true : false}
                  valid={
                    !formik.touched.editcat || (formik.touched.editcat && formik.errors.editcat)
                      ? false
                      : true
                  }
                />
                <CFormFeedback invalid>{formik.errors.editcat}</CFormFeedback>
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
              Xác nhận
            </Button>
            {formik.isSubmitting && <LoadingCircle />}
          </CModalFooter>
        </CModal>
      </form>
    </>
  )
}

EditCategoryButton.propTypes = {
  inCat: PropTypes.object,
}
