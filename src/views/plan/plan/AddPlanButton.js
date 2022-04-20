import React, { useState } from 'react'
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
import { Button } from '@mui/material'
import { LoadingCircle } from 'src/components/LoadingCircle'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import CheckIcon from '@mui/icons-material/Check'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { createAlert } from 'src/slices/alertSlice'
import { setReload, setLoading } from 'src/slices/viewSlice'
import api from 'src/views/axiosConfig'
import { getYearsList, checkYearOverlap } from 'src/utils/function'

export const AddPlanButton = () => {
  const dispatch = useDispatch()
  const [modalVisible, setModalVisible] = useState(false)
  const { planList } = useSelector((state) => state.plan)
  const yearsList = getYearsList()
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
          return createError({
            message: `Trùng thời gian với kế hoạch ${result.plan_name} ( Năm ${result.year} )`,
          })
        }
      }
      return true
    }),
  })

  const formik = useFormik({
    initialValues: {
      plan_name: '',
      description: null,
      year: new Date().getFullYear(),
    },
    validationSchema: ValidationSchema,
    onSubmit: (values) => {
      api
        .post('/plans', {
          plan_name: values.plan_name,
          description: values.description,
          year: Number(values.year),
        })
        .then(() => {
          dispatch(
            createAlert({
              message: 'Tạo kế hoạch mới thành công',
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
      <Button
        variant="contained"
        color="primary"
        onClick={() => setModalVisible(true)}
        startIcon={<AddCircleIcon />}
        sx={{ textTransform: 'none', borderRadius: 10 }}
      >
        Tạo kế hoạch
      </Button>

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
                <CFormTextarea
                  id="des"
                  rows={3}
                  placeholder="Nhập mô tả"
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
            {/*<CRow className="mt-3">
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
                        </CRow>*/}
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
