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
import { setKpiRegisLoading, setKpiRegisReload } from 'src/slices/kpiRegisSlice'

const EditKpiRegistration = (props) => {
  const dispatch = useDispatch()
  const [modalVisible, setModalVisible] = React.useState(false)
  const ValidationSchema = yup.object({
    edittarget: yup.number().required('Đây là trường bắt buộc'),
  })

  //console.log(props.inCat)
  const editplan_id = parseInt(props.plan_id)
  const formik = useFormik({
    initialValues: {
      editplan: { plan_id: editplan_id },
      editkpi_template: {
        kpi_template_id: props.inCat.kpi_template.kpi_template_id,
      },
      edittarget: props.inCat.target,
    },
    validationSchema: ValidationSchema,
    validateOnBlur: true,
    onSubmit: (values, { resetForm }) => {
      //console.log(values)
      api
        .post('plans/register-personal-kpi', {
          plan: values.editplan,
          kpi_template: values.editkpi_template,
          target: values.edittarget,
        })
        .then(() => {
          dispatch(
            createAlert({
              message: 'Đăng ký KPI thành công.',
              type: 'success',
            }),
          )
          dispatch(
            setKpiRegisLoading({
              value: true,
            }),
          )
          dispatch(setKpiRegisReload())
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
  })

  return (
    <>
      <IconButton
        id="edit"
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
            <CModalTitle>Chỉnh sửa KPI đăng ký</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CRow className="mt-2 mb-2 mx-2">
              <CCol md={12}>
                <CFormLabel htmlFor="inputKPITarget">Nhập mục tiêu đề ra</CFormLabel>
                <CFormInput
                  type="number"
                  name="edittarget"
                  id="inputKPITarget"
                  value={formik.values.edittarget}
                  onChange={formik.handleChange}
                  invalid={formik.touched.edittarget && formik.errors.edittarget ? true : false}
                  valid={
                    !formik.touched.edittarget ||
                    (formik.touched.edittarget && formik.errors.edittarget)
                      ? false
                      : true
                  }
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

EditKpiRegistration.propTypes = {
  inCat: PropTypes.object,
  plan_id: PropTypes.string,
}

export default EditKpiRegistration
