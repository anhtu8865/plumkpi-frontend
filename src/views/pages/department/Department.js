import {
  CContainer,
  CCard,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CModalFooter,
  CCol,
  CRow,
  CCardBody,
  CAvatar,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableFoot,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CFormCheck,
  CFormFloating,
  CForm,
  CFormFeedback,
} from '@coreui/react'

import { Tabs, Tab, Box, Button, IconButton, Snackbar, Alert } from '@mui/material'
import AddBoxIcon from '@mui/icons-material/AddBox'
import EditIcon from '@mui/icons-material/Edit'
import CheckIcon from '@mui/icons-material/Check'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import CorporateFareIcon from '@mui/icons-material/CorporateFare'

import { LoadingCircle } from 'src/components/LoadingCircle'

import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

import { useFormik, FormikProvider, Field } from 'formik'
import * as yup from 'yup'
import api from 'src/views/axiosConfig'
import axios from 'axios'

import PropTypes from 'prop-types'

const Department = () => {
  const [showAddDepartmentForm, setshowAddDepartmentForm] = React.useState(false)
  const [showDepartment, setshowDepartment] = React.useState(false)

  const [error, setError] = React.useState(false)

  const [success, setSuccess] = React.useState(false)

  const [successMessage, setSuccessMessage] = React.useState('')

  const [errorMessage, setErrorMessage] = React.useState('')

  const [reload, setReload] = React.useState(true)

  const [loading, setLoading] = React.useState(true)

  const [deptList, setDeptList] = React.useState([])

  const [deleteDeptId, setDeleteDeptId] = React.useState(0)

  const [deleteDeptModal, setDeleteDeptModal] = React.useState(false)

  const [editDeptModal, setEditDeptModal] = React.useState(false)

  const [editDeptId, setEditDeptId] = React.useState(0)

  const [deptName, setDeptName] = React.useState('')

  const [deptDes, setDeptDes] = React.useState('')

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

  const AddDepartment = (props) => {
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
                name="description"
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

  const EditDeptModal = () => {
    const ValidationSchema = yup.object({
      editdept: yup.string().required('Đây là trường bắt buộc'),
    })

    const formik = useFormik({
      initialValues: {
        editdept: `${deptName}`,
        editdes: `${deptDes}`,
      },
      validationSchema: ValidationSchema,
      onSubmit: (values) => {
        // assume that we already login
        api
          .put(`/depts/${editDeptId}`, {
            dept_name: values.editdept,
            description: values.editdes,
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
                <CFormLabel htmlFor="editdept">Nhập tên mới cho phòng ban</CFormLabel>
                <CFormInput
                  id="editdept"
                  placeholder="Tên phòng ban"
                  value={formik.values.editdept}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  invalid={formik.touched.editdept && formik.errors.editdept ? true : false}
                  valid={
                    !formik.touched.editdept || (formik.touched.editdept && formik.errors.editdept)
                      ? false
                      : true
                  }
                />
                <CFormFeedback invalid>{formik.errors.editdept}</CFormFeedback>
              </CCol>
            </CRow>
            <CRow className="mt-2 mb-2 mx-2">
              <CCol xs>
                <CFormLabel htmlFor="editdept">Mô tả</CFormLabel>
                <CFormInput
                  id="editdes"
                  placeholder="Mô tả"
                  value={formik.values.editdes}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  invalid={formik.touched.editdes && formik.errors.editdes ? true : false}
                  valid={
                    !formik.touched.editdes || (formik.touched.editdes && formik.errors.editdes)
                      ? false
                      : true
                  }
                />
                <CFormFeedback invalid>{formik.errors.editdes}</CFormFeedback>
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

  const DeptTable = (props) => {
    return (
      <>
        <CTable align="middle" className="mb-0 border table-bordered" hover responsive striped>
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell>ID</CTableHeaderCell>
              <CTableHeaderCell>PHÒNG BAN</CTableHeaderCell>
              <CTableHeaderCell>MÔ TẢ</CTableHeaderCell>
              <CTableHeaderCell />
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {props.temList.map((row) => (
              <CTableRow v-for="item in tableItems" key={row.dept_name}>
                <CTableDataCell>{row.dept_id}</CTableDataCell>
                <CTableDataCell>{row.dept_name}</CTableDataCell>
                <CTableDataCell>{row.description}</CTableDataCell>
                <CTableDataCell className="text-center">
                  <IconButton
                    id="edit"
                    color="primary"
                    onClick={() => {
                      setEditDeptModal(true)
                      setEditDeptId(row.dept_id)
                      setDeptName(row.dept_name)
                      setDeptDes(row.description)
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

  DeptTable.propTypes = {
    temList: PropTypes.array,
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-col">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol xs={12}>
            <CCard>
              <CCardBody className="p-4">
                <CRow>
                  <CCol xs={6}>
                    <h4>Phòng ban</h4>
                  </CCol>
                  <CCol xs={6}>
                    <div className="d-grid gap-3 d-md-flex justify-content-end">
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddBoxIcon />}
                        onClick={() => setshowAddDepartmentForm(true)}
                      >
                        Thêm phòng ban
                      </Button>
                    </div>
                  </CCol>
                </CRow>

                <CModal
                  scrollable
                  alignment="center"
                  size="lg"
                  visible={showDepartment}
                  onClose={() => setshowDepartment(false)}
                >
                  <CModalHeader>
                    <CModalTitle>Quản lý phòng ban</CModalTitle>
                  </CModalHeader>
                  <CModalBody></CModalBody>
                </CModal>
                <CModal
                  scrollable
                  alignment="center"
                  size="lg"
                  visible={showAddDepartmentForm}
                  onClose={() => setshowAddDepartmentForm(false)}
                >
                  <CModalHeader>
                    <CModalTitle>Thêm phòng ban</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <AddDepartment />
                  </CModalBody>
                  <CModalFooter></CModalFooter>
                </CModal>
                <SuccessErrorToast />
                {/*Table*/}
                <div className="mt-2 p-4">
                  <DeptTable temList={deptList} />
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Department
