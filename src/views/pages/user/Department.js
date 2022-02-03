import {
  CFormInput,
  CRow,
  CCol,
  CFormFloating,
  CFormLabel,
  CForm,
  CFormFeedback,
  CTable,
  CTableBody,
  CTableHead,
  CTableDataCell,
  CTableHeaderCell,
  CTableRow,
  CModalFooter,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
} from '@coreui/react'
import React, { Component } from 'react'

import { Button, Snackbar, Alert } from '@mui/material'

import { LoadingCircle } from 'src/components/LoadingCircle'

import AddBoxIcon from '@mui/icons-material/AddBox'
import { IconButton } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import CheckIcon from '@mui/icons-material/Check'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'

import './Department.css'
//import DeptTable from './DepartmentTable'

import { useFormik } from 'formik'
import * as yup from 'yup'
import api from 'src/views/axiosConfig'
import axios from 'axios'

import { useHistory } from 'react-router-dom'

const Department = () => {
  const history = useHistory()

  const [value, setValue] = React.useState(0)

  const [deptList, setDeptList] = React.useState([])

  const [error, setError] = React.useState(false)

  const [success, setSuccess] = React.useState(false)

  const [successMessage, setSuccessMessage] = React.useState('')

  const [errorMessage, setErrorMessage] = React.useState('')

  const [reload, setReload] = React.useState(true)

  const [loading, setLoading] = React.useState(true)

  const [deleteDeptId, setDeleteDeptId] = React.useState(0)

  const [deleteDeptModal, setDeleteDeptModal] = React.useState(false)

  const [editDeptModal, setEditDeptModal] = React.useState(false)

  const [editDeptId, setEditDeptId] = React.useState(0)

  const [deptName, setDeptName] = React.useState('')

  React.useEffect(() => {
    //assume that we already login
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
    setReload(false)
    setLoading(false)
  }, [reload])

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

  const validationSchema = yup.object({
    dept_name: yup.string().required('Đây là trường bắt buộc'),
  })

  const formik = useFormik({
    initialValues: { dept_name: '' },
    validateOnBlur: true,
    onSubmit: (values) => {
      console.log(values)
      api
        .post('depts', { dept_name: values.dept_name })
        .then((res) => {
          //alert('Thành công')
          setSuccessMessage('Thêm phòng ban thành công')
          setSuccess(true)
          setLoading(true)
          //history.push('/user')
          //console.log(res.data)
        })
        .catch((error) => {
          //alert('Thất bại')
          setErrorMessage(error.response.data.message)
          setError(true)
        })
        .finally(() => formik.setSubmitting(false))
    },
    validationSchema: validationSchema,
  })

  const DeleteDeptModal = () => {
    const formik = useFormik({
      initialValues: { deletedelete: '' },
      onSubmit: (values) => {
        // assume that we already login
        api
          .delete(`/depts/${deleteDeptId}`)
          .then(() => {
            setSuccessMessage('Xóa phòng ban thành công.')
            setSuccess(true)
            setLoading(true)
          })
          .catch((error) => {
            setErrorMessage(error.response.data.message)
            setError(true)
          })
          .finally(() => {
            formik.setSubmitting(false)
            setDeleteDeptModal(false)
            setDeleteDeptId(0)
          })
      },
    })

    return (
      <form onSubmit={formik.handleSubmit}>
        <CModalFooter>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteForeverIcon />}
            type="submit"
            onClick={formik.submitForm}
            disabled={formik.isSubmitting}
          >
            Xóa bỏ
          </Button>
          {formik.isSubmitting && <LoadingCircle />}
        </CModalFooter>
      </form>
    )
  }

  const EditDeptModal = () => {
    const ValidationSchema = yup.object({
      editdept: yup.string().required('Đây là trường bắt buộc'),
    })

    const formik = useFormik({
      initialValues: {
        editdept: `${deptName}`,
      },
      validationSchema: ValidationSchema,
      onSubmit: (values) => {
        // assume that we already login
        api
          .put(`/depts/${editDeptId}`, {
            dept_name: values.editdept,
          })
          .then(() => {
            setSuccessMessage('Cập nhật phòng ban thành công')
            setSuccess(true)
            setLoading(true)
          })
          .catch((error) => {
            setErrorMessage(error.response.data.message)
            setError(true)
          })
          .finally(() => {
            formik.setSubmitting(false)
            setEditDeptModal(false)
            setEditDeptId(0)
            setDeptName('')
          })
      },
    })

    return (
      <form onSubmit={formik.handleSubmit}>
        <CModal
          alignment="center"
          scrollable
          visible={editDeptModal}
          onClose={() => setEditDeptModal(false)}
        >
          <CModalHeader>
            <CModalTitle>Chỉnh sửa phòng ban</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CRow className="mt-2 mb-2 mx-2">
              <CCol xs>
                <CFormFloating>
                  <CFormInput
                    id="editdept"
                    placeholder="Tên phòng ban"
                    value={formik.values.editdept}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    invalid={formik.touched.editdept && formik.errors.editdept ? true : false}
                    valid={
                      !formik.touched.editdept ||
                      (formik.touched.editdept && formik.errors.editdept)
                        ? false
                        : true
                    }
                  />
                  <CFormLabel htmlFor="editdept">Nhập tên mới cho phòng ban</CFormLabel>
                  <CFormFeedback invalid>{formik.errors.editdept}</CFormFeedback>
                </CFormFloating>
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
    )
  }

  const DepartmentTable = () => {
    return (
      <>
        <CTable align="middle" className="mb-0 border table-bordered" hover responsive striped>
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell>PHÒNG BAN</CTableHeaderCell>
              <CTableHeaderCell />
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {deptList.map((row) => (
              <CTableRow v-for="item in tableItems" key={row.dept_id}>
                <CTableDataCell>{row.dept_name}</CTableDataCell>
                <CTableDataCell className="text-center">
                  <IconButton
                    id="edit"
                    color="primary"
                    onClick={() => {
                      setEditDeptModal(true)
                      setEditDeptId(row.dept_id)
                      setDeptName(row.dept_name)
                    }}
                  >
                    <EditIcon />
                    <EditDeptModal />
                  </IconButton>

                  <IconButton
                    id="delete"
                    color="error"
                    onClick={() => {
                      setDeleteDeptModal(true)
                      setDeleteDeptId(row.dept_id)
                    }}
                  >
                    <DeleteForeverIcon />
                    <CModal
                      alignment="center"
                      scrollable
                      visible={deleteDeptModal}
                      onClose={() => setDeleteDeptModal(false)}
                    >
                      <CModalHeader>
                        <CModalTitle>Xóa danh mục</CModalTitle>
                      </CModalHeader>
                      <CModalBody>
                        <CRow className="mt-2 mb-2 mx-2">
                          <CCol xs>Bạn có chắc muốn xóa danh mục ?</CCol>
                        </CRow>
                      </CModalBody>
                      <DeleteDeptModal />
                    </CModal>
                  </IconButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </>
    )
  }

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
          {formik.isSubmitting && <LoadingCircle />}
        </div>
      </CForm>
      <SuccessErrorToast />
      <h6 className="mt-4">Danh sách phòng ban hiện tại</h6>
      <DepartmentTable />
    </div>
  )
}

export default Department
