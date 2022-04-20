import React from 'react'
import { Button } from '@mui/material'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import CheckIcon from '@mui/icons-material/Check'
import {
  CCol,
  CFormLabel,
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
import { useDispatch } from 'react-redux'
import { createAlert } from 'src/slices/alertSlice'
import api from 'src/views/axiosConfig'
import { Form, Formik } from 'formik'
import * as yup from 'yup'
import { LoadingCircle } from 'src/components/LoadingCircle'
import { setReload, setLoading } from 'src/slices/viewSlice'
import { dayArray, monthArray } from 'src/utils/constant'

export const AddNotifButton = () => {
  const dispatch = useDispatch()
  const [modalVisible, setModalVisible] = React.useState(false)

  const initialValues = {
    content: '',
    day: 1,
    month: 1,
    role: 'Giám đốc',
  }

  const validationSchema = yup.object({
    content: yup
      .string()
      .min(6, 'Để đảm bảo thông báo có ý nghĩa, độ dài thông báo cần từ 6 kí tự trở lên')
      .required('Đây là trường bắt buộc'),
  })

  const addNotif = async (values) => {
    await api.post(`/notifs`, {
      content: values.content,
      day: Number(values.day),
      month: Number(values.month),
      role: values.role,
    })
  }

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setModalVisible(true)}
        startIcon={<AddCircleIcon />}
        sx={{ textTransform: 'none', borderRadius: 10 }}
      >
        Tạo thông báo
      </Button>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          try {
            await addNotif(values)
            dispatch(
              createAlert({
                message: 'Tạo thông báo mới thành công.',
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
          } catch (error) {
            if (error.response) {
              dispatch(
                createAlert({
                  message: error.response.data.error,
                  type: 'error',
                }),
              )
            }
          }
        }}
      >
        {({ values, touched, errors, handleChange, handleBlur, isSubmitting, submitForm }) => (
          <>
            <CModal
              alignment="center"
              size="lg"
              scrollable
              visible={modalVisible}
              onClose={() => {
                setModalVisible(false)
              }}
            >
              <CModalHeader>
                <CModalTitle>Tạo thông báo</CModalTitle>
              </CModalHeader>
              <CModalBody className="mx-4 mb-3">
                <Form>
                  {isSubmitting && <LoadingCircle />}
                  <CRow>
                    <CCol>
                      <CFormLabel htmlFor="content">Nội dung thông báo</CFormLabel>
                      <CFormTextarea
                        id="content"
                        placeholder="Nhập nội dung thông báo..."
                        rows={4}
                        value={values.content}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        invalid={touched.content && errors.content ? true : false}
                        valid={
                          !touched.content || (touched.content && errors.content) ? false : true
                        }
                      />
                      <CFormFeedback invalid>{errors.content}</CFormFeedback>
                    </CCol>
                  </CRow>
                  <CRow className="mt-3">
                    <CCol xs={12} sm={6}>
                      <div>Thời gian thông báo:</div>
                    </CCol>
                  </CRow>
                  <CRow className="mt-2">
                    <CCol xs={12} sm={6}>
                      <CFormLabel htmlFor="day">Ngày</CFormLabel>
                      <CFormSelect
                        id="day"
                        htmlSize={3}
                        value={values.day}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        {dayArray().map((item, index) => {
                          return (
                            <option key={index} value={item}>
                              {item}
                            </option>
                          )
                        })}
                      </CFormSelect>
                    </CCol>
                    <CCol xs={12} sm={6}>
                      <CFormLabel htmlFor="month">Tháng</CFormLabel>
                      <CFormSelect
                        id="month"
                        htmlSize={3}
                        value={values.month}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        {monthArray.map((item, index) => {
                          return (
                            <option key={index} value={item}>
                              {item}
                            </option>
                          )
                        })}
                      </CFormSelect>
                    </CCol>
                  </CRow>
                  <CRow className="mt-3">
                    <CCol xs={12} sm={6}>
                      <CFormLabel htmlFor="role">Gửi đến người dùng có vai trò</CFormLabel>
                      <CFormSelect
                        id="role"
                        value={values.role}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        <option value="Giám đốc">Giám đốc</option>
                        <option value="Quản lý">Quản lý</option>
                        <option value="Nhân viên">Nhân viên</option>
                      </CFormSelect>
                    </CCol>
                  </CRow>
                </Form>
              </CModalBody>
              <CModalFooter>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<CheckIcon />}
                  type="submit"
                  onClick={submitForm}
                  disabled={isSubmitting}
                  sx={{ textTransform: 'none', borderRadius: 10 }}
                >
                  Tạo mới
                </Button>
              </CModalFooter>
            </CModal>
          </>
        )}
      </Formik>
    </>
  )
}
