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
} from '@coreui/react'
import { Pagination } from '@mui/material'
import { LoadingCircle } from 'src/components/LoadingCircle'
import { AddKpiButton } from './AddKpiButton'
import api from 'src/views/axiosConfig'
import { useDispatch, useSelector } from 'react-redux'
import SystemAlert from 'src/components/SystemAlert'
import { createAlert } from 'src/slices/alertSlice'
import { setLoading } from 'src/slices/viewSlice'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import { frequencyList } from 'src/utils/engToViet'
import { translate } from 'src/utils/function'
import { EditKpiButton } from './EditKpiButton'
import { DeleteKpiButton } from './DeleteKpiButton'
import { setCategoryList } from 'src/slices/kpiCategorySlice'

const KpiTemplate = () => {
  const { id } = useParams()
  const [catItem, setCatItem] = React.useState({ kpi_category_id: null, kpi_category_name: null })
  const dispatch = useDispatch()
  const { reload, loading } = useSelector((state) => state.view)
  const entryPerPage = 10
  const [page, setPage] = React.useState(1)
  const [totalPage, setTotalPage] = React.useState(1)
  const [entry, setEntry] = React.useState([])

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
    api
      .get('/kpi-templates/', {
        params: { kpi_category_id: id, offset: (page - 1) * entryPerPage, limit: entryPerPage },
      })
      .then((response) => {
        setTotalPage(Math.ceil(response.data.count / entryPerPage))
        setEntry(response.data.items)
      })
      .catch((error) => {
        dispatch(
          createAlert({
            message: error.response.data.message,
            type: 'error',
          }),
        )
      })
    dispatch(
      setLoading({
        value: false,
      }),
    )
  }, [reload, page, dispatch])

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
                  <CTableHeaderCell>TẦN SUẤT</CTableHeaderCell>
                  <CTableHeaderCell />
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {entry.map((temItem) => (
                  <CTableRow v-for="item in tableItems" key={temItem.kpi_template_id}>
                    <CTableDataCell>{temItem.kpi_template_name}</CTableDataCell>
                    <CTableDataCell>{temItem.description}</CTableDataCell>
                    <CTableDataCell>{temItem.unit}</CTableDataCell>
                    <CTableDataCell>{translate(temItem.frequency, frequencyList)}</CTableDataCell>
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
                  </CTableDataCell>
                </CTableRow>
              </CTableFoot>
            </CTable>
          </>
        ) : (
          <div>Danh mục này chưa có KPI.</div>
        )}
      </>
    )
  }

  KpiAdminTable.propTypes = {
    inCat: PropTypes.object,
    temList: PropTypes.array,
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
                    <h4>{catItem.kpi_category_name}</h4>
                  </CCol>
                  <CCol xs>
                    <div className="text-end">
                      <AddKpiButton inCat={catItem} />
                    </div>
                  </CCol>
                </CRow>
                <div className="mt-4 px-4">
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

export default KpiTemplate
