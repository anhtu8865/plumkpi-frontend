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
import { setDepartmentLoading, setDepartmentReload } from 'src/slices/departmentSlice'

const EditDepartment = (props) => {
  const dispatch = useDispatch()
  const [modalVisible, setModalVisible] = React.useState(false)

  const [userList, setUserList] = React.useState([])

  React.useEffect(() => {
    async function fetchUserList() {
      api
        .get(`/depts/${props.inCat.dept_id}`)
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

    fetchUserList()
  }, [])

  const ValidationSchema = yup.object({
    editdept: yup.string().required('Đây là trường bắt buộc'),
  })

  const formik = useFormik({
    initialValues: {
      editdept: props.inCat.dept_name,
      editdes: props.inCat.description,
      editmanager: null,
    },
    validationSchema: ValidationSchema,
    onSubmit: (values) => {
      // assume that we already login
      api
        .put(`/depts/${props.inCat.dept_id}`, {
          dept_name: values.editdept,
          description: values.editdes,
          manager: values.editmanager,
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
      <IconButton
        id="edit"
        color="primary"
        onClick={() => {
          setModalVisible(true)
        }}
        size="small"
      >
        <EditIcon fontSize="small" />
      </IconButton>
      <form onSubmit={formik.handleSubmit}>
        <CModal
          alignment="center"
          scrollable
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
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
            <CRow className="mt-2 mb-2 mx-2">
              <CCol>
                <CFormLabel htmlFor="inputDept">Chọn quản lý</CFormLabel>
                <FormikProvider value={formik}>
                  <Field as="select" name="editmanager.user_id" className="form-select">
                    <option value={null} label="Chọn nhân viên" />
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
          </CModalBody>
          <CModalFooter>
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckIcon />}
              type="submit"
              onClick={formik.submitForm}
              disabled={formik.isSubmitting}
              sx={{ textTransform: 'none' }}
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

EditDepartment.propTypes = {
  inCat: PropTypes.object,
}

export default EditDepartment
