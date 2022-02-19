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
import { Button, TextField, IconButton } from '@mui/material'
import { LoadingCircle } from 'src/components/LoadingCircle'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import CheckIcon from '@mui/icons-material/Check'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { createAlert } from 'src/slices/alertSlice'
import { setReload, setLoading } from 'src/slices/viewSlice'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import DatePicker from '@mui/lab/DatePicker'
import api from 'src/views/axiosConfig'
import { checkTimeRange } from 'src/utils/function'
import EditIcon from '@mui/icons-material/Edit'

export const EditPlanButton = (props) => {
  const dispatch = useDispatch()
  const [modalVisible, setModalVisible] = React.useState(false)
  const today = new Date().toLocaleDateString('en-CA')
  const { planList } = useSelector((state) => state.plan)
  const ValidationSchema = yup.object({
    plan_name: yup
      .string()
      .min(6, 'Để đảm bảo tên có ý nghĩa, độ dài tên cần từ 6 kí tự trở lên')
      .required('Đây là trường bắt buộc'),
    start_date: yup
      .string()
      .required('Đây là trường bắt buộc')
      .test('checkstartdate', 'Kiểm tra ngày', function (value, { createError }) {
        if (!value || !this.parent.end_date) {
          return true
        } else if (value >= this.parent.end_date) {
          return createError({ message: 'Ngày bắt đầu phải trước ngày kết thúc' })
        } else if (this.parent.end_date < today) {
          return createError({ message: 'Ngày kết thúc kế hoạch phải là một ngày trong tương lai' })
        } else {
          const result = checkTimeRange(value, this.parent.end_date, planList)
          if (!(Object.keys(result).length === 0 && result.constructor === Object)) {
            if (result.plan_id === props.inPlan.plan_id) {
              return true
            }
            return createError({
              message: `Trùng thời gian với kế hoạch ${result.plan_name} (${result.start_date} - ${result.end_date})`,
            })
          }
        }
        return true
      }),
    end_date: yup.string().required('Đây là trường bắt buộc'),
  })

  const formik = useFormik({
    initialValues: {
      plan_name: props.inPlan.plan_name,
      description: props.inPlan.description,
      start_date: props.inPlan.start_date,
      end_date: props.inPlan.end_date,
    },
    validationSchema: ValidationSchema,
    onSubmit: (values) => {
      api
        .put(`/plans/${props.inPlan.plan_id}`, values)
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
      >
        <EditIcon />
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
            <CModalTitle>Tạo kế hoạch KPI mới</CModalTitle>
          </CModalHeader>
          <CModalBody className="mx-4 mb-3">
            <CRow>
              <CCol>
                <CFormLabel htmlFor="name">Tên kế hoạch</CFormLabel>
                <CFormInput
                  id="name"
                  placeholder="Nhập tên kế hoạch mới"
                  {...formik.getFieldProps('plan_name')}
                  invalid={formik.touched.plan_name && formik.errors.plan_name ? true : false}
                />
                <CFormFeedback invalid>{formik.errors.plan_name}</CFormFeedback>
              </CCol>
            </CRow>
            <CRow className="mt-3">
              <CCol>
                <CFormLabel htmlFor="des">Mô tả</CFormLabel>
                <CFormInput
                  id="des"
                  placeholder="Nhập mô tả"
                  {...formik.getFieldProps('description')}
                />
              </CCol>
            </CRow>
            <CRow className="mt-3">
              <CCol xs={12} sm={6}>
                <CRow>
                  <CFormLabel htmlFor="start">Ngày bắt đầu</CFormLabel>
                </CRow>
                <CRow className="px-2 pt-2">
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      id="start"
                      inputFormat="dd/MM/yyyy"
                      value={formik.values.start_date}
                      onChange={(date) => {
                        formik.setFieldValue(
                          'start_date',
                          date ? date.toLocaleDateString('en-CA') : '',
                        )
                      }}
                      renderInput={(params) => (
                        <TextField
                          size="small"
                          helperText={
                            formik.errors.start_date &&
                            formik.errors.start_date === 'Đây là trường bắt buộc'
                              ? formik.errors.start_date
                              : null
                          }
                          {...params}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </CRow>
              </CCol>
              <CCol xs={12} sm={6}>
                <CRow>
                  <CFormLabel htmlFor="end">Ngày kết thúc</CFormLabel>
                </CRow>
                <CRow className="px-2 pt-2">
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      id="end"
                      inputFormat="dd/MM/yyyy"
                      value={formik.values.end_date}
                      onChange={(date) => {
                        formik.setFieldValue(
                          'end_date',
                          date ? date.toLocaleDateString('en-CA') : '',
                        )
                      }}
                      renderInput={(params) => (
                        <TextField
                          size="small"
                          helperText={
                            formik.errors.end_date &&
                            formik.errors.end_date === 'Đây là trường bắt buộc'
                              ? formik.errors.end_date
                              : null
                          }
                          {...params}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </CRow>
              </CCol>
            </CRow>
            <CRow className="mt-1">
              <div className="text-danger">
                <small>
                  {formik.errors.start_date && formik.errors.start_date !== 'Đây là trường bắt buộc'
                    ? formik.errors.start_date
                    : null}
                </small>
              </div>
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

EditPlanButton.propTypes = {
  inPlan: PropTypes.object,
}
