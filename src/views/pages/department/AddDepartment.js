import {
  CContainer,
  CForm,
  CRow,
  CCol,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CFormCheck,
  CButton,
  CFormFloating,
  CFormFeedback,
} from '@coreui/react'
import React, { Component } from 'react'

import {
  Tabs,
  Tab,
  Box,
  Button,
  IconButton,
  Snackbar,
  Alert,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material'
import { LoadingCircle } from 'src/components/LoadingCircle'
import AddBoxIcon from '@mui/icons-material/AddBox'

import { useFormik, Field, FormikProvider } from 'formik'

import * as yup from 'yup'
import api from 'src/views/axiosConfig'
import axios from 'axios'

const AddDepartment = () => {
  const validationSchema = yup.object({
    dept_name: yup.string().required('Đây là trường bắt buộc'),
  })

  const formik = useFormik({
    initialValues: { dept_name: '', description: '' },
    validateOnBlur: true,
    onSubmit: (values) => {
      console.log(values)
      api
        .post('depts', { dept_name: values.dept_name, description: values.description })
        .then((res) => {
          alert('Thành công')
          /*setSuccessMessage('Thêm phòng ban thành công')
          setSuccess(true)
          setLoading(true)*/
          //history.push('/user')
          //console.log(res.data)
        })
        .catch((error) => {
          alert('Thất bại')
          /*setErrorMessage(error.response.data.message)
          setError(true)*/
        })
        .finally(() => formik.setSubmitting(false))
    },
    validationSchema: validationSchema,
  })
  return (
    <div className="px-5 pb-3">
      <CForm onSubmit={formik.handleSubmit}>
        <h6>Thêm phòng ban mới</h6>
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
                !formik.touched.dept_name || (formik.touched.dept_name && formik.errors.dept_name)
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
              name="dept_name"
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
        <div className="text-end">
          <Button
            variant="contained"
            color="success"
            startIcon={<AddBoxIcon />}
            type="submit"
            disabled={!formik.isValid}
          >
            Thêm
          </Button>
          {formik.isSubmitting && <LoadingCircle />}
        </div>
      </CForm>
    </div>
  )
}

export default AddDepartment
