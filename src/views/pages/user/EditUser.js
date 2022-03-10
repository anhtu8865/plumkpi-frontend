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
import { Button, IconButton } from '@mui/material'
import { LoadingCircle } from 'src/components/LoadingCircle'
import EditIcon from '@mui/icons-material/Edit'
import CheckIcon from '@mui/icons-material/Check'
import api from 'src/views/axiosConfig'
import { useFormik, Field, FormikProvider } from 'formik'
import * as yup from 'yup'
import { useDispatch } from 'react-redux'
import { createAlert } from 'src/slices/alertSlice'
import { setUserLoading, setUserReload } from 'src/slices/userSlice'

const EditUser = (props) => {
  const [deptList, setDeptList] = React.useState([])
  const [deptVisible, setDeptVisible] = React.useState(false)

  const dispatch = useDispatch()
  const [modalVisible, setModalVisible] = React.useState(false)

  React.useEffect(() => {
    async function fetchDeptList() {
      api
        .get('/depts/all')
        .then((response) => {
          setDeptList(response.data)
        })
        .catch((error) => {})
    }

    fetchDeptList()
  }, [])

  const ValidationSchema = yup.object({
    editusername: yup.string().required('Đây là trường bắt buộc'),
    editemail: yup.string().email().required('Đây là trường bắt buộc'),
  })

  const formik = useFormik({
    initialValues: {
      editusername: props.inCat.user_name,
      editemail: props.inCat.email,
      editrole: '',
      editdept: { dept_id: null },
      editmanage: { dept_id: null },
    },
    validationSchema: ValidationSchema,
    onSubmit: (values) => {
      // assume that we already login
      //block director, admin
      if (values.editrole === 'Admin' || values.editrole === 'Director') {
        values.editdept.dept_id = null
        api
          .put(`/users/${props.inCat.user_id}`, {
            user_name: values.editusername,
            email: values.editemail,
            role: values.editrole,
            dept: values.editdept,
          })
          .then(() => {
            dispatch(
              createAlert({
                message: 'Cập nhật người dùng thành công.',
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
      } else if (values.editrole === 'Employee') {
        api
          .put(`/users/${props.inCat.user_id}`, {
            user_name: values.editusername,
            email: values.editemail,
            role: values.editrole,
            dept: values.editdept,
          })
          .then(() => {
            dispatch(
              createAlert({
                message: 'Cập nhật người dùng thành công.',
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
      } else {
        let tmp = parseInt(values.editdept.dept_id)
        values.editdept.dept_id = tmp
        values.editmanage.dept_id = tmp
        console.log(values)
        api
          .put(`/users/${props.inCat.user_id}`, {
            user_name: values.editusername,
            email: values.editemail,
            role: values.editrole,
            dept: values.editdept,
            manage: values.editmanage,
          })
          .then(() => {
            dispatch(
              createAlert({
                message: 'Cập nhật người dùng thành công.',
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
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        >
          <CModalHeader>
            <CModalTitle>Chỉnh sửa người dùng</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <h6>Nhập thông tin cá nhân</h6>
            <div>
              <CRow className="mt-2">
                <CCol>
                  <CFormLabel htmlFor="editusername">Họ và tên</CFormLabel>
                  <CFormInput
                    id="editusername"
                    value={formik.values.editusername}
                    onChange={formik.handleChange}
                    invalid={
                      formik.touched.editusername && formik.errors.editusername ? true : false
                    }
                    valid={
                      !formik.touched.editusername ||
                      (formik.touched.editusername && formik.errors.editusername)
                        ? false
                        : true
                    }
                  />

                  <CFormFeedback invalid>{formik.errors.editusername}</CFormFeedback>
                </CCol>
              </CRow>
              <CRow className="mt-4">
                <CCol>
                  <CFormLabel htmlFor="editemail">Email</CFormLabel>
                  <CFormInput
                    id="editemail"
                    type="email"
                    value={formik.values.editemail}
                    onChange={formik.handleChange}
                    invalid={formik.touched.editemail && formik.errors.editemail ? true : false}
                    valid={
                      !formik.touched.editemail ||
                      (formik.touched.editemail && formik.errors.editemail)
                        ? false
                        : true
                    }
                  />

                  <CFormFeedback invalid>{formik.errors.editemail}</CFormFeedback>
                </CCol>
              </CRow>
            </div>
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
                        name="editrole"
                        value="Nhân viên"
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
                        name="editrole"
                        value="Quản lý"
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
                        name="editrole"
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
                        name="editrole"
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
                <h6>Gán người dùng vào phòng ban</h6>
                <CRow>
                  <CCol>
                    <CFormLabel htmlFor="inputDept">Phòng ban</CFormLabel>
                    <FormikProvider value={formik}>
                      <Field as="select" name="editdept.dept_id" className="form-select">
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

EditUser.propTypes = {
  inCat: PropTypes.object,
}

export default EditUser
