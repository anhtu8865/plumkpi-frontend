import {
  CFormInput,
  CRow,
  CCol,
  CFormFloating,
  CFormLabel,
  CForm,
  CFormFeedback,
} from '@coreui/react'
import React, { Component } from 'react'
import { Button } from '@mui/material'

import AddBoxIcon from '@mui/icons-material/AddBox'

import './Department.css'
import DeptTable from './DepartmentTable'

import { useFormik } from 'formik'
import * as yup from 'yup'
import api from 'src/views/axiosConfig'
import axios from 'axios'

import { useHistory } from 'react-router-dom'

const validationSchema = yup.object({
  dept_name: yup.string().required('Đây là trường bắt buộc'),
})

const Department = () => {
  const history = useHistory()
  const onSubmit = (values) => {
    console.log(values)
    api
      .post('depts', { dept_name: values.dept_name })
      .then((res) => {
        alert('Thành công')
        history.push('/user')
        //console.log(res.data)
      })
      .catch((error) => {
        alert('Thất bại')
      })
      .finally(() => formik.setSubmitting(false))
  }

  const formik = useFormik({
    initialValues: { dept_name: '' },
    validateOnBlur: true,
    onSubmit,
    validationSchema: validationSchema,
  })

  return (
    <div className="px-5 pb-3">
      <CForm onSubmit={formik.handleSubmit}>
        <h6>Thêm phòng ban mới</h6>
        <CRow className="mt-2 mb-2">
          <CCol>
            <CFormFloating>
              <CFormInput
                name="dept_name"
                id="inputDeptName"
                placeholder="deptName"
                value={formik.values.dept_name}
                onChange={formik.handleChange}
                invalid={formik.touched.dept_name && formik.errors.dept_name ? true : false}
                valid={
                  !formik.touched.dept_name || (formik.touched.dept_name && formik.errors.dept_name)
                    ? false
                    : true
                }
              />
              <CFormLabel htmlFor="inputDeptName">Tên phòng ban</CFormLabel>
            </CFormFloating>
            <CFormFeedback invalid>{formik.errors.email}</CFormFeedback>
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
        </div>
      </CForm>
      <h6 className="mt-4">Danh sách phòng ban hiện tại</h6>
      <DeptTable />
    </div>
  )
}

export default Department
