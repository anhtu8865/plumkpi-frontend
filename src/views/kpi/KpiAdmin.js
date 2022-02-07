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
import { Tabs, Tab, Box, Button, IconButton } from '@mui/material'
import { TabPanel, a11yProps } from 'src/components/TabPanel'
import { LoadingCircle } from 'src/components/LoadingCircle'
import EditIcon from '@mui/icons-material/Edit'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import AddBoxIcon from '@mui/icons-material/AddBox'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import CheckIcon from '@mui/icons-material/Check'
import { KpiAdminTable } from './KpiAdminTable'
import api from 'src/views/axiosConfig'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useDispatch } from 'react-redux'
import SystemAlert from 'src/components/SystemAlert'
import { createAlert } from 'src/store'

const KpiAdmin = () => {
  const [addCatVisible, setAddCatVisible] = useState(false)
  const [value, setValue] = React.useState(0)
  const [kpiCatList, setKpiCatList] = React.useState([])
  const [editCatModal, setEditCatModal] = React.useState(false)
  const [catId, setCatId] = React.useState(0)
  const [catName, setCatName] = React.useState('')
  const [reload, setReload] = React.useState(true)
  const [deleteCatId, setDeleteCatId] = React.useState(0)
  const [deleteCatModal, setDeleteCatModal] = React.useState(false)
  const [loading, setLoading] = React.useState(true)

  const dispatch = useDispatch()

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  React.useEffect(() => {
    api
      .get('/kpi-categories')
      .then((response) => {
        setKpiCatList(response.data.items)
      })
      .catch((error) => {
        dispatch(
          createAlert({
            message: error.response.data.message,
            type: 'error',
          }),
        )
      })
    setReload(false)
    setLoading(false)
  }, [reload, dispatch])

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
            dispatch(
              createAlert({
                message: 'Cập nhật danh mục thành công.',
                type: 'success',
              }),
            )
            setLoading(true)
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
                <CFormLabel htmlFor="editcat">Nhập tên mới cho danh mục</CFormLabel>
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
                <CFormFeedback invalid>{formik.errors.editcat}</CFormFeedback>
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
            dispatch(
              createAlert({
                message: 'Tạo danh mục mới thành công.',
                type: 'success',
              }),
            )
            setLoading(true)
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
                <CFormLabel htmlFor="editcat">Nhập tên danh mục mới</CFormLabel>
                <CFormInput
                  id="addcat"
                  placeholder="Tên danh mục mới"
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
                <CFormFeedback invalid>{formik.errors.addcat}</CFormFeedback>
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
            {formik.isSubmitting && <LoadingCircle />}
          </CModalFooter>
        </CModal>
      </form>
    )
  }

  const DeleteCategoryModal = () => {
    const formik = useFormik({
      initialValues: { deletedelete: '' },
      onSubmit: (values) => {
        // assume that we already login
        api
          .delete(`/kpi-categories/${deleteCatId}`)
          .then(() => {
            dispatch(
              createAlert({
                message: 'Xóa danh mục thành công.',
                type: 'success',
              }),
            )
            setLoading(true)
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
          .finally(() => {
            formik.setSubmitting(false)
            setDeleteCatModal(false)
            setDeleteCatId(0)
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
                    <IconButton
                      id="cat-delete"
                      color="error"
                      onClick={() => {
                        setDeleteCatModal(true)
                        setDeleteCatId(catItem.kpi_category_id)
                      }}
                    >
                      <DeleteForeverIcon />
                      <CModal
                        alignment="center"
                        scrollable
                        visible={deleteCatModal}
                        onClose={() => setDeleteCatModal(false)}
                      >
                        <CModalHeader>
                          <CModalTitle>Xóa danh mục</CModalTitle>
                        </CModalHeader>
                        <CModalBody>
                          <CRow className="mt-2 mb-2 mx-2">
                            <CCol xs>
                              Bạn có chắc muốn xóa danh mục {catItem.kpi_category_name}?
                            </CCol>
                          </CRow>
                        </CModalBody>
                        <DeleteCategoryModal />
                      </CModal>
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
                <div className="mt-3">
                  <ViewTabs />
                </div>
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

export default KpiAdmin
