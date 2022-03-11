import {
  CCol,
  CFormFeedback,
  CFormLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import AddBoxIcon from '@mui/icons-material/AddBox'
import CheckIcon from '@mui/icons-material/Check'
import { Button } from '@mui/material'
import { Field, FormikProvider, useFormik } from 'formik'
import PropTypes from 'prop-types'
import React from 'react'
import { useDispatch } from 'react-redux'
import { LoadingCircle } from 'src/components/LoadingCircle'
import { createAlert } from 'src/slices/alertSlice'
import { setDepartmentLoading, setDepartmentReload } from 'src/slices/departmentSlice'
import api from 'src/views/axiosConfig'
import * as yup from 'yup'

const AddManager = (props) => {
  const [userList, setUserList] = React.useState([])

  const dispatch = useDispatch()
  const [modalVisible, setModalVisible] = React.useState(false)

  React.useEffect(() => {
    async function fetchDeptList() {
      api
        .get(`depts/${props.dept_id}`)
        .then((response) => {
          setUserList(response.data.users)
        })
        .catch((error) => {
          dispatch(
            createAlert({
              message: error.response.data.message,
              type: 'error',
            }),
          )
        })
    }

    fetchDeptList()
  }, [])

  const ValidationSchema = yup.object({})

  const formik = useFormik({
    initialValues: {
      manager: {
        user_id: null,
      },
    },
    validationSchema: ValidationSchema,
    onSubmit: (values) => {
      // assume that we already login
      //block director, admin
      api
        .put(`depts/${props.dept_id}`, {
          manager: values.manager,
        })
        .then(() => {
          dispatch(
            createAlert({
              message: 'Cập nhật phòng ban thành công.',
              type: 'success',
            }),
          )
          dispatch(
            setDepartmentLoading({
              value: true,
            }),
          )
          dispatch(setDepartmentReload())
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
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddBoxIcon />}
        onClick={() => setModalVisible(true)}
      >
        Thêm quản lý
      </Button>

      <form onSubmit={formik.handleSubmit}>
        <CModal
          alignment="center"
          scrollable
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        >
          <CModalHeader>
            <CModalTitle>Gán quản lý phòng ban</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <div className="userform-item mt-4">
              <h6>Chọn một nhân viên trở thành quản lý</h6>
              <CRow>
                <CCol>
                  <CFormLabel htmlFor="inputDept">Nhân viên</CFormLabel>
                  <FormikProvider value={formik}>
                    <Field as="select" name="manager.user_id" className="form-select">
                      <option value="" label="Chọn nhân viên" />
                      {userList.map((row) => (
                        <option value={row.user_id} key={row.user_id}>
                          {row.user_name}
                        </option>
                      ))}
                    </Field>
                  </FormikProvider>
                  <CFormFeedback invalid>{formik.errors.dept}</CFormFeedback>
                </CCol>
              </CRow>
            </div>
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

AddManager.propTypes = {
  dept_id: PropTypes.string,
}

export default AddManager
