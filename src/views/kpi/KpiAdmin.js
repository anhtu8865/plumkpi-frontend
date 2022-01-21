import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CFormLabel,
  CFormInput,
  CRow,
  CModal,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CModalHeader,
  CFormFloating,
  CFormFeedback,
} from '@coreui/react'
import {
  Tabs,
  Tab,
  Box,
  Button,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material'
import { TabPanel, a11yProps } from 'src/components/TabPanel'
import EditIcon from '@mui/icons-material/Edit'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import AddBoxIcon from '@mui/icons-material/AddBox'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import CheckIcon from '@mui/icons-material/Check'
import { KpiAdminTable } from './KpiAdminTable'
import api from 'src/views/axiosConfig'
import { useFormik } from 'formik'
import * as yup from 'yup'

const KpiAdmin = () => {
  const [addCatVisible, setAddCatVisible] = useState(false)

  const [value, setValue] = React.useState(0)

  const [kpiCatList, setKpiCatList] = React.useState([])

  const [editCatModal, setEditCatModal] = React.useState(false)

  const [catId, setCatId] = React.useState(0)

  const [catName, setCatName] = React.useState('')

  const [error, setError] = React.useState(false)

  const [success, setSuccess] = React.useState(false)

  const [successMessage, setSuccessMessage] = React.useState('')

  const [errorMessage, setErrorMessage] = React.useState('')

  const [reload, setReload] = React.useState(false)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  React.useEffect(() => {
    //get kpi categories to create tabs
    //assume that we already login
    api
      .get('/kpi-categories')
      .then((response) => {
        setKpiCatList(response.data.items)
      })
      .catch((error) => {
        setErrorMessage(error.response.data.message)
        setError(true)
        setSuccess(false)
      })
    setReload(false)
  }, [reload])

  const SuccessErrorToast = () => {
    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return
      }
      success ? setSuccess(false) : setError(false)
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
          autoHideDuration={3000}
          onClose={handleClose}
        >
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }} variant="filled">
            {successMessage}
          </Alert>
        </Snackbar>
      </>
    )
  }

  const EditCategoryModal = () => {
    const ValidationSchema = yup.object({
      editcat: yup.string().required('Đây là trường bắt buộc'),
    })

    const formik = useFormik({
      initialValues: {
        editcat: `${catName}`,
      },
      validationSchema: ValidationSchema,
      onSubmit: (values) => {
        // assume that we already login
        api
          .put(`/kpi-categories/${catId}`, {
            kpi_category_name: values.editcat,
          })
          .then(() => {
            //bug toast hiện nhiều lần khi vừa toast vừa reload
            //setSuccessMessage('Cập nhật danh mục thành công')
            //setSuccess(true)
            //setError(false)
            setReload(true)
          })
          .catch((error) => {
            setErrorMessage(error.response.data.message)
            setError(true)
            setSuccess(false)
          })
          .finally(() => {
            formik.setSubmitting(false)
            setEditCatModal(false)
            setCatId(0)
            setCatName('')
          })
      },
    })

    return (
      <form onSubmit={formik.handleSubmit}>
        <CModal
          alignment="center"
          scrollable
          visible={editCatModal}
          onClose={() => setEditCatModal(false)}
        >
          <CModalHeader>
            <CModalTitle>Chỉnh sửa danh mục KPI</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CRow className="mt-2 mb-2 mx-2">
              <CCol xs>
                <CFormFloating>
                  <CFormInput
                    id="editcat"
                    placeholder="Tên danh mục"
                    value={formik.values.editcat}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    invalid={formik.touched.editcat && formik.errors.editcat ? true : false}
                    valid={
                      !formik.touched.editcat || (formik.touched.editcat && formik.errors.editcat)
                        ? false
                        : true
                    }
                  />
                  <CFormLabel htmlFor="editcat">Nhập tên mới cho danh mục</CFormLabel>
                  <CFormFeedback invalid>{formik.errors.editcat}</CFormFeedback>
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
            {formik.isSubmitting && (
              <CircularProgress
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                }}
              />
            )}
          </CModalFooter>
        </CModal>
      </form>
    )
  }

  const AddCategoryModal = () => {
    const ValidationSchema = yup.object({
      addcat: yup.string().required('Đây là trường bắt buộc'),
    })

    const formik = useFormik({
      initialValues: {
        addcat: '',
      },
      validationSchema: ValidationSchema,
      onSubmit: (values) => {
        // assume that we already login
        api
          .post(`/kpi-categories/`, {
            kpi_category_name: values.addcat,
          })
          .then(() => {
            //bug toast hiện nhiều lần khi vừa toast vừa reload
            //setSuccessMessage('Tạo danh mục mới thành công.')
            //setSuccess(true)
            //setError(false)
            setReload(true)
          })
          .catch((error) => {
            setErrorMessage(error.response.data.message)
            setError(true)
            setSuccess(false)
          })
          .finally(() => {
            formik.setSubmitting(false)
            setAddCatVisible(false)
          })
      },
    })

    return (
      <form onSubmit={formik.handleSubmit}>
        <CModal
          alignment="center"
          scrollable
          visible={addCatVisible}
          onClose={() => setAddCatVisible(false)}
        >
          <CModalHeader>
            <CModalTitle>Tạo danh mục KPI mới</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CRow className="mt-2 mb-2 mx-2">
              <CCol xs>
                <CFormFloating>
                  <CFormInput
                    id="addcat"
                    placeholder="Tên danh mục"
                    value={formik.values.addcat}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    invalid={formik.touched.addcat && formik.errors.addcat ? true : false}
                    valid={
                      !formik.touched.addcat || (formik.touched.addcat && formik.errors.addcat)
                        ? false
                        : true
                    }
                  />
                  <CFormLabel htmlFor="editcat">Nhập tên danh mục mới</CFormLabel>
                  <CFormFeedback invalid>{formik.errors.addcat}</CFormFeedback>
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
              Tạo mới
            </Button>
            {formik.isSubmitting && (
              <CircularProgress
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                }}
              />
            )}
          </CModalFooter>
        </CModal>
      </form>
    )
  }

  const AddCategoryButton = () => {
    return (
      <>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setAddCatVisible(true)}
          startIcon={<AddBoxIcon />}
        >
          Tạo danh mục KPI
        </Button>
        <AddCategoryModal />
      </>
    )
  }

  const AddKpiButton = () => {
    return (
      <>
        <Button
          variant="contained"
          color="primary"
          //onClick={() => setVisible(true)}
          startIcon={<AddCircleIcon />}
        >
          Tạo KPI mới
        </Button>
        {/*<CModal
          alignment="center"
          size="lg"
          scrollable
          visible={visible}
          onClose={() => setVisible(false)}
        >
          <CModalHeader>
            <CModalTitle>Tạo KPI mới</CModalTitle>
          </CModalHeader>
          <CModalBody className="mx-4 mb-3">
            <CRow>
              <CFormLabel htmlFor="kpiname">Tên KPI</CFormLabel>
              <CFormInput id="kpiname" placeholder="Nhập tên KPI" />
            </CRow>
            <CRow className="mt-2">
              <CFormLabel htmlFor="kpides">Mô tả KPI</CFormLabel>
              <CFormInput id="kpides" placeholder="Nhập mô tả KPI" />
            </CRow>
            <CRow className="mt-2">
              <CCol xs={4}>
                <CFormLabel htmlFor="freq">Tần suất</CFormLabel>
                <CFormSelect id="freq">
                  <option>Tuần</option>
                  <option>Tháng</option>
                  <option>Quý</option>
                  <option>Năm</option>
                </CFormSelect>
              </CCol>
              <CCol xs={4}>
                <CFormLabel htmlFor="direction">Hướng</CFormLabel>
                <CFormSelect id="direction">
                  <option>Lên</option>
                  <option>Xuống</option>
                </CFormSelect>
              </CCol>
              <CCol xs={4}>
                <CFormLabel htmlFor="category">Danh mục</CFormLabel>
                <CFormSelect id="category">
                  <option>Sales</option>
                  <option>Marketing</option>
                  <option>Chăm sóc khách hàng</option>
                </CFormSelect>
              </CCol>
            </CRow>
            <CRow className="mt-2">
              <CCol xs={4}>
                <CFormLabel htmlFor="unit">Đơn vị tính</CFormLabel>
                <CFormInput id="unit" placeholder="Nhập đơn vị tính" />
              </CCol>
              <CCol xs={4}>
                <CFormLabel htmlFor="how">Cách tính</CFormLabel>
                <CFormSelect id="how">
                  <option>Tổng</option>
                  <option>Trung bình</option>
                </CFormSelect>
              </CCol>
            </CRow>
            <CRow className="mt-2">
              <CFormLabel htmlFor="formula">Nhập công thức tính</CFormLabel>
              <CFormInput id="formula" placeholder="Nhập công thức tính" />
            </CRow>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setVisible(false)}>
              Hủy
            </CButton>
            <CButton color="success">Tạo mới</CButton>
          </CModalFooter>
        </CModal>*/}
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
          {kpiCatList
            .sort((a, b) => a.kpi_category_id - b.kpi_category_id)
            .map((catItem, index) => (
              <Tab
                key={catItem.kpi_category_id}
                label={catItem.kpi_category_name}
                {...a11yProps(index)}
              />
            ))}
        </Tabs>
        {kpiCatList.map((catItem, index) => {
          return (
            <TabPanel key={catItem.kpi_category_id} value={value} index={index}>
              <CRow>
                <div className="d-flex align-items-center flex-row mb-2">
                  <h5 className="me-3">{catItem.kpi_category_name}</h5>
                  <div className="mb-2">
                    <IconButton
                      id="cat-name-edit"
                      color="primary"
                      onClick={() => {
                        setEditCatModal(true)
                        setCatId(catItem.kpi_category_id)
                        setCatName(catItem.kpi_category_name)
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <EditCategoryModal />
                  </div>
                  <div className="mb-2">
                    <IconButton id="cat-delete" color="error">
                      <DeleteForeverIcon />
                    </IconButton>
                  </div>
                </div>
              </CRow>
              <KpiAdminTable />
            </TabPanel>
          )
        })}
      </Box>
    )
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
                    <h4>Quản lý KPI mẫu</h4>
                  </CCol>
                  <CCol xs={6}>
                    <div className="d-grid gap-3 d-md-flex justify-content-end">
                      <AddKpiButton />
                      <AddCategoryButton />
                    </div>
                  </CCol>
                </CRow>
                <ViewTabs />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
      <SuccessErrorToast />
    </div>
  )
}

export default KpiAdmin
