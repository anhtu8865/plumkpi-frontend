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
  CFormSelect,
  CFormTextarea,
} from '@coreui/react'
import PropTypes from 'prop-types'
import { Button, IconButton } from '@mui/material'
import { LoadingCircle } from 'src/components/LoadingCircle'
import CheckIcon from '@mui/icons-material/Check'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { createAlert } from 'src/slices/alertSlice'
import { setReload, setLoading } from 'src/slices/viewSlice'
import api from 'src/views/axiosConfig'
import { getYearsList, checkYearOverlap } from 'src/utils/function'
import EditIcon from '@mui/icons-material/Edit'

export const EditPlanButton = (props) => {
  const dispatch = useDispatch()
  const [modalVisible, setModalVisible] = React.useState(false)
  const yearsList = getYearsList()
  const { planList } = useSelector((state) => state.plan)
  const ValidationSchema = yup.object({
    plan_name: yup
      .string()
      .min(6, 'Để đảm bảo tên có ý nghĩa, độ dài tên cần từ 6 kí tự trở lên')
      .required('Đây là trường bắt buộc'),
    year: yup.number().test('checkdate', 'Kiểm tra ngày', function (value, { createError }) {
      if (!value) {
        return true
      } else {
        const result = checkYearOverlap(value, planList)
        if (!(Object.keys(result).length === 0 && result.constructor === Object)) {
          if (result.plan_id !== props.inPlan.plan_id) {
            return createError({
              message: `Trùng thời gian với kế hoạch ${result.plan_name} ( Năm ${result.year} )`,
            })
          }
        }
      }
      return true
    }),
  })

  const formik = useFormik({
    initialValues: {
      plan_name: props.inPlan.plan_name,
      description: props.inPlan.description,
      year: props.inPlan.year,
    },
    validationSchema: ValidationSchema,
    onSubmit: (values) => {
      api
        .put(`/plans/${props.inPlan.plan_id}`, {
          plan_name: values.plan_name,
          description: values.description,
          year: Number(values.year),
        })
        .then(() => {
          dispatch(
            createAlert({
              message: 'Chỉnh sửa kế hoạch thành công',
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
          if (error.response) {
            dispatch(
              createAlert({
                message: error.response.data.message,
                type: 'error',
              }),
            )
          }
        })
        .finally(() => {
          formik.setSubmitting(false)
        })
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
        size="small"
      >
        <EditIcon fontSize="small" />
      </IconButton>
      <form onSubmit={formik.handleSubmit}>
        <CModal
          alignment="center"
          scrollable
          size="lg"
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        >
          <CModalHeader>
            <CModalTitle>Thay đổi kế hoạch KPI</CModalTitle>
          </CModalHeader>
          <CModalBody className="mx-4 mb-3">
            <CRow>
              <CCol>
                <CFormLabel htmlFor="name">Tên kế hoạch</CFormLabel>
                <CFormInput
                  id="name"
                  placeholder="Nhập tên kế hoạch mới..."
                  {...formik.getFieldProps('plan_name')}
                  invalid={formik.touched.plan_name && formik.errors.plan_name ? true : false}
                />
                <CFormFeedback invalid>{formik.errors.plan_name}</CFormFeedback>
              </CCol>
            </CRow>
            <CRow className="mt-3">
              <CCol>
                <CFormLabel htmlFor="des">Mô tả</CFormLabel>
                <CFormTextarea
                  id="des"
                  rows={3}
                  placeholder="Nhập mô tả..."
                  {...formik.getFieldProps('description')}
                />
              </CCol>
            </CRow>
            <CRow className="mt-3">
              <CCol xs={12} sm={6}>
                <CFormLabel htmlFor="year">Năm thực hiện</CFormLabel>
                <CFormSelect
                  id="year"
                  {...formik.getFieldProps('year')}
                  invalid={formik.errors.year ? true : false}
                >
                  {yearsList.map((item, index) => (
                    <option value={item} key={index}>
                      {item}
                    </option>
                  ))}
                </CFormSelect>
                <CFormFeedback invalid>{formik.errors.year}</CFormFeedback>
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

EditPlanButton.propTypes = {
  inPlan: PropTypes.object,
}
