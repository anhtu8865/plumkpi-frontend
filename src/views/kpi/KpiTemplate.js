import React, { useState } from 'react'
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
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import { EditKpiButton } from './EditKpiButton'
import { DeleteKpiButton } from './DeleteKpiButton'
import { setCategoryList } from 'src/slices/kpiCategorySlice'
import SearchIcon from '@mui/icons-material/Search'

const KpiTemplate = () => {
  const { id } = useParams()
  const [catItem, setCatItem] = useState({ kpi_category_id: null, kpi_category_name: null })
  const dispatch = useDispatch()
  const { reload, loading } = useSelector((state) => state.view)
  const entryPerPage = 10
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const [entry, setEntry] = useState([])
  const [searchVisible, setSearchVisible] = useState(false)
  const [name, setName] = useState('')

  const getTemplateList = async (name) => {
    let paramsObject = {
      kpi_category_id: id,
      offset: (page - 1) * entryPerPage,
      limit: entryPerPage,
    }
    if (name !== '') {
      paramsObject.name = name
    }
    const response = await api.get('/kpi-templates/', {
      params: paramsObject,
    })
    return response.data
  }

  React.useEffect(() => {
    api
      .get('/kpi-categories/all')
      .then((response) => {
        dispatch(setCategoryList({ value: response.data }))
      })
      .catch((error) => {
        dispatch(
          createAlert({
            message: error.response.data.message,
            type: 'error',
          }),
        )
      })
    api
      .get(`/kpi-categories/${id}`)
      .then((response) => {
        setCatItem(response.data)
      })
      .catch((error) => {
        dispatch(
          createAlert({
            message: error.response.data.message,
            type: 'error',
          }),
        )
      })
  }, [])

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getTemplateList(name)
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
  }, [reload, page, name, dispatch])

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
            <CTable align="middle" className="mb-0 border table-bordered" hover responsive striped>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell>KPI</CTableHeaderCell>
                  <CTableHeaderCell>MÔ TẢ</CTableHeaderCell>
                  <CTableHeaderCell>ĐƠN VỊ</CTableHeaderCell>
                  <CTableHeaderCell />
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {entry.map((temItem) => (
                  <CTableRow v-for="item in tableItems" key={temItem.kpi_template_id}>
                    <CTableDataCell>{temItem.kpi_template_name}</CTableDataCell>
                    <CTableDataCell>{temItem.description}</CTableDataCell>
                    <CTableDataCell>{temItem.unit}</CTableDataCell>
                    <CTableDataCell className="text-center">
                      <div className="d-flex flex-row justify-content-center">
                        <EditKpiButton inTem={temItem} />
                        <DeleteKpiButton inTem={temItem} />
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
              <CTableFoot>
                <CTableRow>
                  <CTableDataCell colSpan="4">
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
          placeholder="Tìm theo tên KPI"
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
                <CRow>
                  <CCol xs={12} sm={6}>
                    <h4>{catItem.kpi_category_name}</h4>
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
                      >
                        Tìm kiếm
                      </Button>
                      <AddKpiButton inCat={catItem} />
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
