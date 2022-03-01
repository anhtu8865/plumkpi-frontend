import {
  CCol,
  CFormFeedback,
  CFormInput,
  CFormLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CFormCheck,
  CRow,
} from '@coreui/react'
import AddBoxIcon from '@mui/icons-material/AddBox'
import { Button } from '@mui/material'
import { Field, FormikProvider, useFormik } from 'formik'
import React from 'react'
import { useDispatch } from 'react-redux'
import { LoadingCircle } from 'src/components/LoadingCircle'
import { createAlert } from 'src/slices/alertSlice'
import { setUserLoading, setUserReload } from 'src/slices/userSlice'
import api from 'src/views/axiosConfig'
import * as yup from 'yup'

const AddUser = () => {
  const [deptList, setDeptList] = React.useState([])
  const [deptVisible, setDeptVisible] = React.useState(false)

  const dispatch = useDispatch()
  const [modalVisible, setModalVisible] = React.useState(false)

  async function fetchDeptList() {
    api
      .get('/depts')
      .then((response) => {
        setDeptList(response.data.items)
      })
      .catch((error) => {})
  }

  fetchDeptList()

  const validationSchema = yup.object({
    user_name: yup.string().required('Đây là trường bắt buộc'),
    email: yup.string().email().required('Đây là trường bắt buộc'),
    password: yup
      .string()
      .min(6, 'Mật khẩu luôn có độ dài ít nhất 6 kí tự')
      .required('Đây là trường bắt buộc'),
    role: yup.string().required('Đây là trường bắt buộc'),
    //dept: yup.required('Đây là trường bắt buộc'),
  })

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      user_name: '',
      email: '',
      password: '',
      role: '',
      dept: { dept_id: null },
      manage: { dept_id: null },
    },
    validateOnBlur: true,
    onSubmit: (values, { resetForm }) => {
      if (values.role === 'Admin' || values.role === 'Director') {
        api
          .post('users', {
            user_name: values.user_name,
            email: values.email,
            password: values.password,
            role: values.role,
          })
          .then(() => {
            dispatch(
              createAlert({
                message: 'Tạo người dùng mới thành công.',
                type: 'success',
              }),
            )
            dispatch(
              setUserLoading({
                value: true,
              }),
            )
            dispatch(setUserReload())
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
      } else if (values.role === 'Employee') {
        //console.log(values)
        api
          .post('users', {
            user_name: values.user_name,
            email: values.email,
            password: values.password,
            role: values.role,
            dept: values.dept,
          })
          .then(() => {
            dispatch(
              createAlert({
                message: 'Tạo người dùng mới thành công.',
                type: 'success',
              }),
            )
            dispatch(
              setUserLoading({
                value: true,
              }),
            )
            dispatch(setUserReload())
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
      } else if (values.role === 'Manager') {
        let tmp = parseInt(values.dept.dept_id)
        values.dept.dept_id = tmp
        values.manage.dept_id = tmp

        console.log(values)
        api
          .post('users', {
            user_name: values.user_name,
            email: values.email,
            password: values.password,
            role: values.role,
            dept: values.dept,
            manage: values.dept,
          })
          .then(() => {
            dispatch(
              createAlert({
                message: 'Tạo người dùng mới thành công.',
                type: 'success',
              }),
            )
            dispatch(
              setUserLoading({
                value: true,
              }),
            )
            dispatch(setUserReload())
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
      }

      //resetForm()
    },
    validationSchema: validationSchema,
  })
  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddBoxIcon />}
        onClick={() => setModalVisible(true)}
      >
        Thêm người dùng
      </Button>

      <form onSubmit={formik.handleSubmit}>
        <CModal
          alignment="center"
          scrollable
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        >
          <CModalHeader>
            <CModalTitle>Thêm người dùng mới</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <h6>Nhập thông tin cá nhân</h6>
            <div>
              <CRow className="mt-2">
                <CCol>
                  <CFormLabel htmlFor="inputFirstName">Họ và tên</CFormLabel>
                  <CFormInput
                    id="inputFirstName"
                    {...formik.getFieldProps('user_name')}
                    invalid={formik.touched.user_name && formik.errors.user_name ? true : false}
                    valid={
                      !formik.touched.user_name ||
                      (formik.touched.user_name && formik.errors.user_name)
                        ? false
                        : true
                    }
                  />

                  <CFormFeedback invalid>{formik.errors.user_name}</CFormFeedback>
                </CCol>
              </CRow>
              <CRow className="mt-4">
                <CCol>
                  <CFormLabel htmlFor="inputEmail">Email</CFormLabel>
                  <CFormInput
                    id="inputEmail"
                    type="email"
                    {...formik.getFieldProps('email')}
                    invalid={formik.touched.email && formik.errors.email ? true : false}
                    valid={
                      !formik.touched.email || (formik.touched.email && formik.errors.email)
                        ? false
                        : true
                    }
                  />

                  <CFormFeedback invalid>{formik.errors.email1}</CFormFeedback>
                </CCol>
              </CRow>
              <CRow className="mt-4">
                <CCol>
                  <CFormLabel htmlFor="inputPassword">Mật khẩu</CFormLabel>
                  <CFormInput
                    id="inputPassword"
                    type="password"
                    {...formik.getFieldProps('password')}
                    invalid={formik.touched.password && formik.errors.password ? true : false}
                    valid={
                      !formik.touched.password ||
                      (formik.touched.password && formik.errors.password)
                        ? false
                        : true
                    }
                  />
                  <CFormFeedback invalid>{formik.errors.password}</CFormFeedback>
                </CCol>
              </CRow>
            </div>
            <hr />
            <div>
              <h6>Vai trò và quyền hạn</h6>
              <fieldset className="row mb-3">
                <legend className="col-form-label col-sm-5 pt-0">Chọn vai trò</legend>
                <CCol sm={7}>
                  <FormikProvider value={formik}>
                    <div className="form-check">
                      <Field
                        className="form-check-input"
                        type="radio"
                        name="role"
                        value="Employee"
                        onClick={() => {
                          setDeptVisible(true)
                        }}
                      />
                      <label className="form-check-label">Nhân viên</label>
                    </div>
                    <div className="form-check">
                      <Field
                        className="form-check-input"
                        type="radio"
                        name="role"
                        value="Manager"
                        onClick={() => {
                          setDeptVisible(true)
                        }}
                      />
                      <label className="form-check-label">Quản lý</label>
                    </div>
                    <div className="form-check">
                      <Field
                        className="form-check-input"
                        type="radio"
                        name="role"
                        value="Giám đốc"
                        onClick={() => {
                          setDeptVisible(false)
                        }}
                      />
                      <label className="form-check-label">Giám đốc</label>
                    </div>
                    <div className="form-check">
                      <Field
                        className="form-check-input"
                        type="radio"
                        name="role"
                        value="Admin"
                        onClick={() => {
                          setDeptVisible(false)
                        }}
                      />
                      <label className="form-check-label">Quản trị viên</label>
                    </div>
                  </FormikProvider>
                </CCol>
              </fieldset>
            </div>
            {deptVisible && (
              <div className="userform-item mt-4">
                <hr />
                <h6>Gán người dùng vào phòng ban</h6>
                <CRow>
                  <CCol>
                    <CFormLabel htmlFor="inputDept">Phòng ban</CFormLabel>
                    <FormikProvider value={formik}>
                      <Field as="select" name="dept.dept_id" className="form-select">
                        <option value="" label="Chọn phòng ban" />
                        {deptList.map((row) => (
                          <option value={row.dept_id} key={row.dept_id}>
                            {row.dept_name}
                          </option>
                        ))}
                      </Field>
                    </FormikProvider>
                    <CFormFeedback invalid>{formik.errors.dept}</CFormFeedback>
                  </CCol>
                </CRow>
              </div>
            )}
          </CModalBody>
          <CModalFooter>
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
          </CModalFooter>
        </CModal>
      </form>
    </>
  )
}

export default AddUser
