import React, { useState, useEffect, useCallback } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CRow,
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
} from '@coreui/react'
import { Pagination, Button } from '@mui/material'
import { LoadingCircle } from 'src/components/LoadingCircle'
import { AddNotifButton } from './AddNotifButton'
import api from 'src/views/axiosConfig'
import { useFormik } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import SystemAlert from 'src/components/SystemAlert'
import { createAlert } from 'src/slices/alertSlice'
import { setLoading } from 'src/slices/viewSlice'
import { EditNotifButton } from './EditNotifButton'
import { DeleteNotifButton } from './DeleteNotifButton'
import SearchIcon from '@mui/icons-material/Search'
import { dayArray, monthArray } from 'src/utils/constant'
import ShowMoreText from 'react-show-more-text'

const Notif = () => {
  const dispatch = useDispatch()
  const { reload, loading } = useSelector((state) => state.view)
  const entryPerPage = 10
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const [entry, setEntry] = useState([])
  const [searchVisible, setSearchVisible] = useState(false)
  const [oldSearchValue, setOldSearchValue] = useState({
    content: '',
    day: 'Tất cả',
    month: 'Tất cả',
    role: 'Tất cả',
  })

  const getNotifList = useCallback(
    async (values) => {
      let paramsObject = {
        offset: (page - 1) * entryPerPage,
        limit: entryPerPage,
      }
      if (values.content !== '') {
        paramsObject.content = values.content
      }
      if (values.day !== 'Tất cả') {
        paramsObject.day = Number(values.day)
      }
      if (values.month !== 'Tất cả') {
        paramsObject.month = Number(values.month)
      }
      if (values.role !== 'Tất cả') {
        paramsObject.role = values.role
      }
      if (
        values.content !== oldSearchValue.content ||
        values.day !== oldSearchValue.day ||
        values.month !== oldSearchValue.month ||
        values.role !== oldSearchValue.role
      ) {
        paramsObject.offset = 0
        setPage(1)
        setOldSearchValue(values)
      }

      const response = await api.get('/notifs/', {
        params: paramsObject,
      })
      return response.data
    },
    [oldSearchValue.content, oldSearchValue.day, oldSearchValue.month, oldSearchValue.role, page],
  )

  const formik = useFormik({
    initialValues: {
      content: '',
      day: 'Tất cả',
      month: 'Tất cả',
      role: 'Tất cả',
    },
    onSubmit: (values) => {},
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getNotifList(formik.values)
        if (result) {
          setTotalPage(Math.ceil(result.count / entryPerPage))
          setEntry(result.items)
        }
      } catch (error) {
        if (error.response) {
          dispatch(
            createAlert({
              message: error.response.data.message,
              type: 'error',
            }),
          )
        }
      } finally {
        dispatch(
          setLoading({
            value: false,
          }),
        )
      }
    }

    fetchData()
  }, [reload, page, formik.values, dispatch, getNotifList])

  const Table = () => {
    return (
      <>
        {entry.length !== 0 ? (
          <>
            <CTable align="middle" className="mb-0 border" hover responsive striped>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell className="w-50">Nội dung</CTableHeaderCell>
                  <CTableHeaderCell>Ngày gửi</CTableHeaderCell>
                  <CTableHeaderCell>Tháng gửi</CTableHeaderCell>
                  <CTableHeaderCell>Gửi đến</CTableHeaderCell>
                  <CTableHeaderCell />
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {entry.map((item) => (
                  <CTableRow v-for="item in tableItems" key={item.notif_id}>
                    <CTableDataCell className="w-50">
                      <ShowMoreText lines={1} more=" Xem thêm" less=" Thu gọn" expanded={false}>
                        {item.content}
                      </ShowMoreText>
                    </CTableDataCell>
                    <CTableDataCell>{item.day}</CTableDataCell>
                    <CTableDataCell>{item.month}</CTableDataCell>
                    <CTableDataCell>{item.role}</CTableDataCell>
                    <CTableDataCell className="text-center">
                      <div className="d-flex flex-row justify-content-center">
                        <EditNotifButton inNotif={item} />
                        <DeleteNotifButton inNotif={item} />
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
              <CTableFoot>
                <CTableRow>
                  <CTableDataCell colSpan={5}>
                    <div className="d-flex flex-row justify-content-end">
                      <Pagination
                        page={page}
                        count={totalPage}
                        showFirstButton
                        showLastButton
                        size="small"
                        onChange={(event, page) => {
                          setPage(page)
                        }}
                      />
                    </div>
                  </CTableDataCell>
                </CTableRow>
              </CTableFoot>
            </CTable>
          </>
        ) : (
          <div>Không có thông báo trong hệ thống.</div>
        )}
      </>
    )
  }

  const SearchInput = () => {
    return (
      <>
        <CCol xs={12} sm={6} lg={6}>
          <CFormLabel htmlFor="content">Nội dung</CFormLabel>
          <CFormInput
            id="content"
            placeholder="Tìm theo nội dung..."
            value={formik.values.content}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </CCol>
        <CCol xs={12} sm={3} lg={2}>
          <CFormLabel htmlFor="day">Ngày</CFormLabel>
          <CFormSelect
            id="day"
            htmlSize={3}
            value={formik.values.day}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="Tất cả">Tất cả</option>
            {dayArray().map((item, index) => {
              return (
                <option key={index} value={item}>
                  {item}
                </option>
              )
            })}
          </CFormSelect>
        </CCol>
        <CCol xs={12} sm={3} lg={2}>
          <CFormLabel htmlFor="month">Tháng</CFormLabel>
          <CFormSelect
            id="month"
            htmlSize={3}
            value={formik.values.month}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="Tất cả">Tất cả</option>
            {monthArray.map((item, index) => {
              return (
                <option key={index} value={item}>
                  {item}
                </option>
              )
            })}
          </CFormSelect>
        </CCol>
        <CCol xs={12} sm={6} lg={2}>
          <CFormLabel htmlFor="role">Gửi đến</CFormLabel>
          <CFormSelect
            id="role"
            value={formik.values.role}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="Tất cả">Tất cả</option>
            <option value="Giám đốc">Giám đốc</option>
            <option value="Quản lý">Quản lý</option>
            <option value="Nhân viên">Nhân viên</option>
          </CFormSelect>
        </CCol>
      </>
    )
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-col">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol xs={12}>
            <CCard>
              <CCardBody className="p-5">
                <CRow className="mt-4">
                  <CCol xs={12} sm={6}>
                    <h3>
                      <b>Thông báo hệ thống</b>
                    </h3>
                  </CCol>
                  <CCol xs={12} sm={6}>
                    <div className="d-flex flex-row gap-2 justify-content-end">
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<SearchIcon />}
                        onClick={() => {
                          if (searchVisible) {
                            formik.setFieldValue('content', '')
                            formik.setFieldValue('day', 'Tất cả')
                            formik.setFieldValue('month', 'Tất cả')
                            formik.setFieldValue('role', 'Tất cả')
                          }
                          setSearchVisible(!searchVisible)
                        }}
                        sx={{ textTransform: 'none', borderRadius: 10 }}
                      >
                        Tìm kiếm
                      </Button>
                      <AddNotifButton />
                    </div>
                  </CCol>
                </CRow>
                {searchVisible && <CRow className="mt-2">{SearchInput()}</CRow>}
                <CRow className="mt-5">
                  <Table />
                </CRow>
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

export default Notif
