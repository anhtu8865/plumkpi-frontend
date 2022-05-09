import React from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CRow,
  CFormFeedback,
  CFormTextarea,
} from '@coreui/react'
import { Tabs, Tab, Box, Button, Avatar, TextField } from '@mui/material'
import ArticleIcon from '@mui/icons-material/Article'
import LockIcon from '@mui/icons-material/Lock'
import CheckIcon from '@mui/icons-material/Check'
import { TabPanel, a11yProps } from 'src/components/TabPanel'
import { LoadingCircle } from 'src/components/LoadingCircle'
import { useFormik } from 'formik'
import * as yup from 'yup'
import api from 'src/views/axiosConfig'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from 'src/slices/userSlice'
import SystemAlert from 'src/components/SystemAlert'
import { createAlert } from 'src/slices/alertSlice'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import DatePicker from '@mui/lab/DatePicker'

const UserInfo = () => {
  const { user } = useSelector((state) => state.user)
  const [reload, setReload] = React.useState(true)
  const [loading, setLoading] = React.useState(false)
  const [value, setValue] = React.useState(0)

  const dispatch = useDispatch()

  React.useEffect(() => {
    api
      .get('authentication')
      .then((response) => {
        dispatch(setUser({ value: response.data }))
      })
      .catch((error) => {
        if (error.response && error.response.status !== 401) {
          dispatch(
            createAlert({
              message: error.response.data.message,
              type: 'error',
            }),
          )
        }
      })
    setLoading(false)
    setReload(false)
  }, [reload, dispatch])

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const AvatarUpload = () => {
    const [selectedFile, setSelectedFile] = React.useState(null)

    const changeHandle = (event) => {
      setSelectedFile(event.target.files[0])
    }

    const submitHandle = () => {
      setLoading(true)
      const formData = new FormData()

      formData.append('file', selectedFile)
      api
        .post('authentication/avatar', formData)
        .then(() => {
          dispatch(
            createAlert({
              message: 'Thay đổi avatar thành công.',
              type: 'success',
            }),
          )
          window.location.reload()
        })
        .catch((error) => {
          dispatch(
            createAlert({
              message: error.response.data.message,
              type: 'error',
            }),
          )
          setLoading(false)
        })
    }

    const deleteHandle = () => {
      setLoading(true)
      api
        .delete('authentication/avatar')
        .then(() => {
          dispatch(
            createAlert({
              message: 'Xóa avatar thành công.',
              type: 'success',
            }),
          )
          window.location.reload()
        })
        .catch((error) => {
          dispatch(
            createAlert({
              message: error.response.data.message,
              type: 'error',
            }),
          )
          setLoading(false)
        })
    }

    return (
      <CRow className="mt-2">
        <CCol xs={3} lg={1}>
          <Avatar src={user.avatar ? user.avatar.url : null} sx={{ width: 68, height: 68 }} />
        </CCol>
        <CCol xs={8} lg={11}>
          <CCol xs={12}>
            <div className="d-grid gap-2 d-md-flex ms-4">
              <input
                //accept="image/*"
                type="file"
                onChange={changeHandle}
              />
              <Button
                onClick={submitHandle}
                variant="contained"
                sx={{ textTransform: 'none', borderRadius: 10 }}
              >
                Tải lên
              </Button>
              <Button
                variant="outlined"
                onClick={() => deleteHandle()}
                sx={{ textTransform: 'none', borderRadius: 10 }}
              >
                Xóa Avatar
              </Button>
            </div>
          </CCol>
          <CCol xs={12}>
            <p className="text-small-emphasis ms-4 mt-2">Ảnh tải lên cần có định dạng .JPG, .PNG</p>
          </CCol>
        </CCol>
      </CRow>
    )
  }

  const InfoForm = () => {
    const ValidationSchema = yup.object({
      username: yup.string().required('Đây là trường bắt buộc'),
      email: yup.string().email('Không đúng định dạng email').required('Đây là trường bắt buộc'),
      phone: yup.number().typeError('Trường này bắt buộc nhập số'),
    })

    const formik = useFormik({
      initialValues: {
        username: user.user_name,
        email: user.email,
        dob: user.dob,
        gender: user.gender,
        address: user.address,
        phone: user.phone,
      },
      validationSchema: ValidationSchema,
      onSubmit: (values) => {
        api
          .put('authentication/update', {
            user_name: values.username,
            email: values.email,
            phone: values.phone,
            gender: values.gender,
            address: values.address,
            dob: values.dob,
          })
          .then(() => {
            dispatch(
              createAlert({
                message: 'Chỉnh sửa thông tin thành công.',
                type: 'success',
              }),
            )
            setReload(true)
            //setLoading(true)
          })
          .catch((error) => {
            dispatch(
              createAlert({
                message: error.response.data.message,
                type: 'error',
              }),
            )
          })
          .finally(() => formik.setSubmitting(false))
      },
    })

    return (
      <>
        <form onSubmit={formik.handleSubmit}>
          <CRow className="mt-3">
            <CCol xs={12} sm={6}>
              <CFormLabel htmlFor="username">Họ và tên</CFormLabel>
              <CFormInput
                id="username"
                placeholder="Nhập họ và tên..."
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                invalid={formik.touched.username && formik.errors.username ? true : false}
                valid={
                  !formik.touched.username || (formik.touched.username && formik.errors.username)
                    ? false
                    : true
                }
              />
              <CFormFeedback invalid>{formik.errors.username}</CFormFeedback>
            </CCol>
            <CCol xs={12} sm={6}>
              <CFormLabel htmlFor="email">Email</CFormLabel>
              <CFormInput
                type="email"
                id="email"
                placeholder="Nhập email..."
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                invalid={formik.touched.email && formik.errors.email ? true : false}
                valid={
                  !formik.touched.email || (formik.touched.email && formik.errors.email)
                    ? false
                    : true
                }
              />
              <CFormFeedback invalid>{formik.errors.email}</CFormFeedback>
            </CCol>
          </CRow>
          <CRow className="mt-4">
            <CCol xs>
              <CRow>
                <CFormLabel htmlFor="dob">Ngày sinh</CFormLabel>
              </CRow>
              <CRow className="px-2 pt-2">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    id="dob"
                    inputFormat="dd/MM/yyyy"
                    value={formik.values.dob}
                    onChange={(date) => {
                      formik.setFieldValue('dob', date.toLocaleDateString())
                    }}
                    renderInput={(params) => <TextField size="small" {...params} />}
                  />
                </LocalizationProvider>
              </CRow>
            </CCol>
          </CRow>
          <CRow className="mt-4">
            <CCol xs={12} sm={6}>
              <CFormLabel htmlFor="gender">Giới tính</CFormLabel>
              <CFormSelect
                id="gender"
                placeholder="Chọn giới tính..."
                {...formik.getFieldProps('gender')}
                invalid={formik.touched.gender && formik.errors.gender ? true : false}
                valid={
                  !formik.touched.gender || (formik.touched.gender && formik.errors.gender)
                    ? false
                    : true
                }
              >
                <option value="Không">Không</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </CFormSelect>
            </CCol>
            <CCol xs={12} sm={6}>
              <CFormLabel htmlFor="phone">Số điện thoại</CFormLabel>
              <CFormInput
                id="phone"
                placeholder="Nhập số điện thoại..."
                {...formik.getFieldProps('phone')}
                invalid={formik.touched.phone && formik.errors.phone ? true : false}
                valid={
                  !formik.touched.phone || (formik.touched.phone && formik.errors.phone)
                    ? false
                    : true
                }
              />
              <CFormFeedback invalid>{formik.errors.phone}</CFormFeedback>
            </CCol>
          </CRow>
          <CRow className="mt-4">
            <CCol xs>
              <CFormLabel htmlFor="address">Địa chỉ</CFormLabel>
              <CFormTextarea
                id="address"
                rows={3}
                placeholder="Nhập địa chỉ..."
                {...formik.getFieldProps('address')}
                invalid={formik.touched.address && formik.errors.address ? true : false}
                valid={
                  !formik.touched.address || (formik.touched.address && formik.errors.address)
                    ? false
                    : true
                }
              />
              <CFormFeedback invalid>{formik.errors.address}</CFormFeedback>
            </CCol>
          </CRow>
          <CRow className="mt-4">
            <CCol xs={12} sm={6}>
              <div>Phòng ban: {user.dept ? user.dept.dept_name : 'Không'}</div>
            </CCol>
            <CCol xs={12} sm={6}>
              <div>Vai trò: {user.role}</div>
            </CCol>
          </CRow>
          <div className="d-grid d-md-flex mt-4">
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckIcon />}
              type="submit"
              onClick={formik.submitForm}
              disabled={formik.isSubmitting}
              sx={{ textTransform: 'none', borderRadius: 10 }}
            >
              Xác nhận
            </Button>
            {formik.isSubmitting && <LoadingCircle />}
          </div>
        </form>
      </>
    )
  }

  const InfoTab = () => {
    return (
      <>
        <AvatarUpload />
        <InfoForm />
      </>
    )
  }

  const PasswordTab = () => {
    const pwValidationSchema = yup.object({
      oldpw: yup
        .string()
        .min(6, 'Mật khẩu luôn có độ dài ít nhất 6 kí tự')
        .required('Đây là trường bắt buộc'),
      newpw: yup
        .string()
        .min(6, 'Mật khẩu mới phải có độ dài ít nhất 6 kí tự')
        .required('Đây là trường bắt buộc'),
      retypepw: yup
        .string()
        .required('Đây là trường bắt buộc')
        .test('passwords-match', 'Không trùng khớp với mật khẩu mới', function (value) {
          return this.parent.newpw === value
        }),
    })

    const formik = useFormik({
      initialValues: {
        oldpw: '',
        newpw: '',
        retypepw: '',
      },
      validationSchema: pwValidationSchema,
      onSubmit: (values) => {
        // assume that we already login
        api
          .put('authentication/password', { oldPassword: values.oldpw, newPassword: values.newpw })
          .then(() => {
            dispatch(
              createAlert({
                message: 'Thay đổi mật khẩu thành công.',
                type: 'success',
              }),
            )
            setReload(true)
          })
          .catch((error) => {
            dispatch(
              createAlert({
                message: error.response.data.message,
                type: 'error',
              }),
            )
          })
          .finally(() => formik.setSubmitting(false))
      },
    })

    return (
      <>
        <form onSubmit={formik.handleSubmit}>
          <CRow>
            <CCol xs={12}>
              <CFormLabel htmlFor="oldpw">Mật khẩu hiện tại</CFormLabel>
              <CFormInput
                type="password"
                id="oldpw"
                value={formik.values.oldpw}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                invalid={formik.touched.oldpw && formik.errors.oldpw ? true : false}
                valid={
                  !formik.touched.oldpw || (formik.touched.oldpw && formik.errors.oldpw)
                    ? false
                    : true
                }
              />
              <CFormFeedback invalid>{formik.errors.oldpw}</CFormFeedback>
            </CCol>
          </CRow>
          <CRow className="mt-4">
            <CCol xs={12}>
              <CFormLabel htmlFor="newpw">Mật khẩu mới</CFormLabel>
              <CFormInput
                type="password"
                id="newpw"
                value={formik.values.newpw}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                invalid={formik.touched.newpw && formik.errors.newpw ? true : false}
                valid={
                  !formik.touched.newpw || (formik.touched.newpw && formik.errors.newpw)
                    ? false
                    : true
                }
              />
              <CFormFeedback invalid>{formik.errors.newpw}</CFormFeedback>
            </CCol>
          </CRow>
          <CRow className="mt-4">
            <CCol xs={12}>
              <CFormLabel htmlFor="retypepw">Nhập lại mật khẩu mới</CFormLabel>
              <CFormInput
                type="password"
                id="retypepw"
                value={formik.values.retypepw}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                invalid={formik.touched.retypepw && formik.errors.retypepw ? true : false}
                valid={
                  !formik.touched.retypepw || (formik.touched.retypepw && formik.errors.retypepw)
                    ? false
                    : true
                }
              />
              <CFormFeedback invalid>{formik.errors.retypepw}</CFormFeedback>
            </CCol>
          </CRow>
          <div className="d-grid d-md-flex mt-4">
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckIcon />}
              type="submit"
              disabled={formik.isSubmitting}
              sx={{ textTransform: 'none', borderRadius: 10 }}
            >
              Xác nhận
            </Button>
          </div>
          {formik.isSubmitting && <LoadingCircle />}
        </form>
      </>
    )
  }

  const ViewTabs = () => {
    return (
      <Box sx={{ width: '100%' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab
            label="Thông tin cá nhân"
            icon={<ArticleIcon />}
            iconPosition="start"
            sx={{ textTransform: 'none' }}
            {...a11yProps(0)}
          />
          <Tab
            label="Mật khẩu"
            icon={<LockIcon />}
            iconPosition="start"
            sx={{ textTransform: 'none' }}
            {...a11yProps(1)}
          />
        </Tabs>
        <TabPanel value={value} index={0}>
          <InfoTab />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <PasswordTab />
        </TabPanel>
      </Box>
    )
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-col">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol xs={12}>
            <CCard>
              <CCardBody className="p-5">
                <h3>
                  <b>Tài khoản</b>
                </h3>
                <ViewTabs />
                {loading && <LoadingCircle />}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
      <SystemAlert />
    </div>
  )
}

export default UserInfo
