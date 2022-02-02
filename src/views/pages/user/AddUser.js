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

import { Tabs, Tab, Box, Button, IconButton, Snackbar, Alert } from '@mui/material'
import { LoadingCircle } from 'src/components/LoadingCircle'
import AddBoxIcon from '@mui/icons-material/AddBox'

import './AddUser.css'

import { useFormik, Field } from 'formik'

import * as yup from 'yup'
import api from 'src/views/axiosConfig'
import axios from 'axios'

const AddUser = (props) => {
  const [deptList, setDeptList] = React.useState([])

  const [error, setError] = React.useState(false)

  const [success, setSuccess] = React.useState(false)

  const [successMessage, setSuccessMessage] = React.useState('')

  const [errorMessage, setErrorMessage] = React.useState('')

  const [reload, setReload] = React.useState(true)

  const [loading, setLoading] = React.useState(true)

  api
    .get('/depts')
    .then((response) => {
      setDeptList(response.data.items)
    })
    .catch((error) => {
      setErrorMessage(error.response.data.message)
      setError(true)
      setSuccess(false)
    })

  //console.log(deptList)

  const SuccessErrorToast = () => {
    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return
      }
      if (success === true) {
        setSuccess(false)
        setReload(true)
      } else {
        setError(false)
      }
    }

    return (
      <>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={error}
          autoHideDuration={3000}
          onClose={handleClose}
        >
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }} variant="filled">
            {errorMessage}
          </Alert>
        </Snackbar>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={success}
          autoHideDuration={1000}
          onClose={handleClose}
        >
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }} variant="filled">
            {successMessage}
          </Alert>
        </Snackbar>
      </>
    )
  }

  //console.log(deptList)

  const validationSchema = yup.object({
    user_name: yup.string().required('Đây là trường bắt buộc'),
    email: yup.string().email().required('Đây là trường bắt buộc'),
    password: yup
      .string()
      .min(6, 'Mật khẩu luôn có độ dài ít nhất 6 kí tự')
      .required('Đây là trường bắt buộc'),
    //dept: yup.required('Đây là trường bắt buộc'),
  })

  const formik = useFormik({
    initialValues: { user_name: '', email: '', password: '', role: '', dept: { dept_id: '' } },
    validateOnBlur: true,
    onSubmit: (values) => {
      console.log('Đây là form')
      console.log(values)
      api
        .post('users', {
          user_name: values.user_name,
          email: values.email,
          password: values.password,
          role: values.role,
          dept: values.dept,
        })
        .then((res) => {
          alert('Thành công')
          setSuccessMessage('Thêm người dùng thành công')
          setSuccess(true)
          setLoading(true)
          //history.push('/user')
          //console.log(res.data)
        })
        .catch((error) => {
          alert('Thất bại')
          setErrorMessage(error.response.data.message)
          setError(true)
        })
        .finally(() => formik.setSubmitting(false))
    },
    validationSchema: validationSchema,
  })
  return (
    <div>
      <form className="px-5" onSubmit={formik.handleSubmit}>
        <h6>Nhập thông tin cá nhân</h6>
        <div>
          <CRow className="mt-2">
            <CCol>
              <CFormFloating>
                <CFormInput
                  id="inputFirstName"
                  name="user_name"
                  placeholder="Họ tên"
                  value={formik.values.user_name}
                  onChange={formik.handleChange}
                  invalid={formik.touched.user_name && formik.errors.user_name ? true : false}
                  valid={
                    !formik.touched.user_name ||
                    (formik.touched.user_name && formik.errors.user_name)
                      ? false
                      : true
                  }
                />
                <CFormLabel htmlFor="inputFirstName">Họ và tên</CFormLabel>
                <CFormFeedback invalid>{formik.errors.user_name}</CFormFeedback>
              </CFormFloating>
            </CCol>
          </CRow>
          <CRow className="mt-4">
            <CCol>
              <CFormFloating>
                <CFormInput
                  id="inputEmail"
                  name="email"
                  placeholder="email"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  invalid={formik.touched.email && formik.errors.email ? true : false}
                  valid={
                    !formik.touched.email || (formik.touched.email && formik.errors.email)
                      ? false
                      : true
                  }
                />
                <CFormLabel htmlFor="inputEmail">Email</CFormLabel>
                <CFormFeedback invalid>{formik.errors.email1}</CFormFeedback>
              </CFormFloating>
            </CCol>
          </CRow>
          <CRow className="mt-4">
            <CCol>
              <CFormFloating>
                <CFormInput
                  id="inputPassword"
                  placeholder="password"
                  type="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  invalid={formik.touched.password && formik.errors.password ? true : false}
                  valid={
                    !formik.touched.password || (formik.touched.password && formik.errors.password)
                      ? false
                      : true
                  }
                />
                <CFormLabel htmlFor="inputPassword">Mật khẩu</CFormLabel>
                <CFormFeedback invalid>{formik.errors.password}</CFormFeedback>
              </CFormFloating>
            </CCol>
          </CRow>
        </div>
        <div className="userform-item mt-4">
          <h6>Gán người dùng vào phòng ban</h6>
          <CRow>
            <CCol>
              <CFormFloating>
                <CFormSelect id="inputDept">
                  <option value="" label="Chọn phòng ban" />
                  {deptList.map((row) => (
                    <option value={row.dept_id} key={row.dept_id}>
                      {row.dept_name}
                    </option>
                  ))}
                </CFormSelect>
                <CFormLabel htmlFor="inputDept">Phòng ban</CFormLabel>
                <CFormFeedback invalid>{formik.errors.dept}</CFormFeedback>
              </CFormFloating>
            </CCol>
          </CRow>
        </div>
        <div>
          <h6>Vai trò và quyền hạn</h6>
          <fieldset className="row mb-3">
            <legend className="col-form-label col-sm-5 pt-0">Chọn vai trò</legend>
            <CCol sm={7}>
              <CFormCheck
                type="radio"
                name="role"
                id="Employee"
                value="Employee"
                label="Nhân viên"
                defaultChecked
              />
              <CFormCheck type="radio" name="role" id="Manager" value="Manager" label="Quản lý" />
              <CFormCheck
                type="radio"
                name="role"
                id="Director"
                value="Director"
                label="Giám đốc"
              />
              <CFormCheck type="radio" name="role" id="Admin" value="Admin" label="Quản trị viên" />
            </CCol>
          </fieldset>
        </div>
        <div className="text-end">
          <Button
            variant="contained"
            color="success"
            startIcon={<AddBoxIcon />}
            type="submit"
            onClick={formik.submitForm}
            disabled={formik.isSubmitting}
          >
            Thêm
          </Button>
          {formik.isSubmitting && <LoadingCircle />}
        </div>
        <SuccessErrorToast />
      </form>
    </div>
  )
}
export default AddUser
