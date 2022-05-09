import React, { useState, useCallback } from 'react'
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
} from '@coreui/react'
import { Pagination, Button } from '@mui/material'
import { LoadingCircle } from 'src/components/LoadingCircle'
import { AddKpiButton } from './AddKpiButton'
import api from 'src/views/axiosConfig'
import { useDispatch, useSelector } from 'react-redux'
import SystemAlert from 'src/components/SystemAlert'
import { createAlert } from 'src/slices/alertSlice'
import { setLoading } from 'src/slices/viewSlice'
import { useParams, useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import { EditKpiButton } from './EditKpiButton'
import { DeleteKpiButton } from './DeleteKpiButton'
import { setCategoryList } from 'src/slices/kpiCategorySlice'
import SearchIcon from '@mui/icons-material/Search'
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft'
import { KpiInfoButton } from 'src/views/plan/planDetail/KpiInfoButton'

const KpiTemplate = () => {
  const { id } = useParams()
  const history = useHistory()
  const [catItem, setCatItem] = useState({ kpi_category_id: null, kpi_category_name: null })
  const dispatch = useDispatch()
  const { reload, loading } = useSelector((state) => state.view)
  const { categoryList } = useSelector((state) => state.kpiCategory)
  const { user } = useSelector((state) => state.user)
  const entryPerPage = 10
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const [entry, setEntry] = useState([])
  const [searchVisible, setSearchVisible] = useState(false)
  const [name, setName] = useState('')
  const [oldSearchValue, setOldSearchValue] = useState({ name: '' })

  const getTemplateList = useCallback(
    async (name) => {
      let paramsObject = {
        offset: (page - 1) * entryPerPage,
        limit: entryPerPage,
      }
      if (id) {
        paramsObject.kpi_category_id = id
      }
      if (name !== '') {
        paramsObject.name = name
      }
      if (name !== oldSearchValue.name) {
        paramsObject.offset = 0
        setPage(1)
        setOldSearchValue({ name: name })
      }

      const response = await api.get('/kpi-templates/', {
        params: paramsObject,
      })
      return response.data
    },
    // eslint-disable-next-line
    [id, page],
  )

  const getAllCategories = async () => {
    const response = await api.get('/kpi-categories/all')
    return response.data
  }

  const getCategory = async (catId) => {
    const response = await api.get(`/kpi-categories/${catId}`)
    return response.data
  }

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAllCategories()
        dispatch(setCategoryList({ value: result }))
        if (id) {
          if (user.role === 'Admin') {
            const res = await getCategory(id)
            setCatItem(res)
          } else {
            setCatItem(result.find((item) => item.kpi_category_id === Number(id)))
          }
        } else {
          setCatItem(result[0])
        }
      } catch (error) {
        if (error.response && error.response.status !== 401) {
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
  }, [dispatch, id, user.role])

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getTemplateList(name)
        if (result) {
          setTotalPage(Math.ceil(result.count / entryPerPage))
          setEntry(result.items)
        }
      } catch (error) {
        if (error.response && error.response.status !== 401) {
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
  }, [reload, page, name, id, dispatch, getTemplateList])

  const ViewTabs = () => {
    return (
      <>
        <KpiAdminTable inCat={catItem} temList={entry} />
      </>
    )
  }

  const KpiAdminTable = (props) => {
    return (
      <>
        {entry.length !== 0 ? (
          <>
            <CTable align="middle" className="mb-0 border" hover responsive striped>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell>STT</CTableHeaderCell>
                  <CTableHeaderCell>KPI</CTableHeaderCell>
                  <CTableHeaderCell>Công thức tổng hợp</CTableHeaderCell>
                  <CTableHeaderCell>Đơn vị</CTableHeaderCell>
                  {!id && <CTableHeaderCell>Danh mục</CTableHeaderCell>}
                  <CTableHeaderCell className="w-25" />
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {entry.map((temItem, index) => (
                  <CTableRow v-for="item in tableItems" key={temItem.kpi_template_id}>
                    <CTableDataCell>{(page - 1) * entryPerPage + index + 1}</CTableDataCell>
                    <CTableDataCell>{temItem.kpi_template_name}</CTableDataCell>
                    <CTableDataCell>{temItem.aggregation}</CTableDataCell>
                    <CTableDataCell>{temItem.unit}</CTableDataCell>
                    {!id && (
                      <CTableDataCell>{temItem.kpi_category.kpi_category_name}</CTableDataCell>
                    )}
                    <CTableDataCell className="w-25 text-center">
                      <div className="d-flex flex-row justify-content-center">
                        {user.role === 'Admin' && (
                          <>
                            <EditKpiButton inTem={temItem} />
                            <DeleteKpiButton inTem={temItem} />
                          </>
                        )}
                        <KpiInfoButton kpiItem={{ kpi_template: temItem }} />
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
              <CTableFoot>
                <CTableRow>
                  <CTableDataCell colSpan={id ? 5 : 6}>
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
          <div>Không có KPI.</div>
        )}
      </>
    )
  }

  KpiAdminTable.propTypes = {
    inCat: PropTypes.object,
    temList: PropTypes.array,
  }

  const SearchInput = () => {
    return (
      <CCol xs={12} sm={6} lg={4}>
        <CFormLabel htmlFor="search">KPI</CFormLabel>
        <CFormInput
          id="search"
          placeholder="Tìm theo tên KPI..."
          value={name}
          onChange={(event) => {
            setName(event.target.value)
          }}
        />
      </CCol>
    )
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-col">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol xs={12}>
            <CCard>
              <CCardBody className="p-5">
                {id && (
                  <CRow>
                    <CCol xs={12} sm={6}>
                      <Button
                        variant="outlined"
                        startIcon={<KeyboardDoubleArrowLeftIcon />}
                        onClick={() => {
                          history.push(`/kpicategory`)
                        }}
                        sx={{ textTransform: 'none', borderRadius: 10 }}
                      >
                        Quay lại danh mục KPI mẫu
                      </Button>
                    </CCol>
                  </CRow>
                )}
                <CRow className="mt-4">
                  <CCol xs={12} sm={6}>
                    <h3>
                      <b>{id ? catItem.kpi_category_name : 'KPI mẫu'}</b>
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
                            setName('')
                          }
                          setSearchVisible(!searchVisible)
                        }}
                        sx={{ textTransform: 'none', borderRadius: 10 }}
                      >
                        Tìm kiếm
                      </Button>
                      {user.role === 'Admin' && categoryList.length > 0 && (
                        <AddKpiButton inCat={catItem} />
                      )}
                    </div>
                  </CCol>
                </CRow>
                {searchVisible && <CRow className="mt-2">{SearchInput()}</CRow>}
                <CRow className="mt-5">
                  <ViewTabs />
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

export default KpiTemplate
