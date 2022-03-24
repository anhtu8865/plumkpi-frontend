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
    },
    validationSchema: ValidationSchema,
    onSubmit: (values) => {
      api
        .put(`/kpi-categories/${props.inCat.kpi_category_id}`, {
          kpi_category_name: values.editcat,
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
      >
        <EditIcon />
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
            <CRow className="mt-2 mb-2 mx-2">
              <CCol xs>
                <CFormLabel htmlFor="editcat">Nhập tên mới cho danh mục</CFormLabel>
                <CFormInput
                  id="editcat"
                  placeholder="Tên danh mục"
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
          </CModalBody>
          <CModalFooter>
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckIcon />}
              type="submit"
              onClick={formik.submitForm}
              disabled={formik.isSubmitting}
              sx={{ textTransform: 'none' }}
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
