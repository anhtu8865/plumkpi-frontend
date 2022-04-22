import {
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableFoot,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft'
import { Button, Pagination } from '@mui/material'
import PropTypes from 'prop-types'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import SystemAlert from 'src/components/SystemAlert'
import { createAlert } from 'src/slices/alertSlice'
import api from 'src/views/axiosConfig'
import { KpiInfoButton } from 'src/views/plan/planDetail/KpiInfoButton'
import { ApproveDataMonthlyPersonal } from './ApproveDataMonthlyPersonal'
import { ApproveDataQuarterPersonal } from './ApproveDataQuarterPersonal'
import { ApproveTargetMonthlyPersonal } from './ApproveTargetMonthlyPersonal'
import { ApproveTargetQuarterPersonal } from './ApproveTargetQuarterPersonal'

const KpiApproving = () => {
  const { id } = useParams()
  const history = useHistory()

  const dispatch = useDispatch()

  const { selectedMonth, selectedQuarter } = useSelector((state) => state.planDetail)

  const { reload } = useSelector((state) => state.view)

  const { user } = useSelector((state) => state.user)

  const entryPerPage = 10
  const [page, setPage] = React.useState(1)
  const [totalPage, setTotalPage] = React.useState(1)
  const [entry, setEntry] = React.useState([])

  //const [selectedKpi, setSelectedKpi] = React.useState([])

  // const handleKpiChange = (item) => {
  //   if (!selectedKpi.includes(item)) {
  //     setSelectedKpi([...selectedKpi, item])
  //   } else if (selectedKpi.includes(item)) {
  //     setSelectedKpi(
  //       selectedKpi.filter((tmp) => {
  //         if (tmp !== item) {
  //           return tmp
  //         }
  //       }),
  //     )
  //   }
  // }

  React.useEffect(() => {
    async function fetchKPIList() {
      api
        .get(`plans/${id}/kpis/manager/personal-kpis-of-employees`, {
          params: { offset: (page - 1) * entryPerPage, limit: entryPerPage },
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
    }

    async function fetchDeptKPIList() {
      api
        .get(`plans/${id}/kpis/director/personal-kpis-of-depts`, {
          params: { offset: (page - 1) * entryPerPage, limit: entryPerPage },
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
    }
    if (user.role === 'Quản lý') {
      fetchKPIList()
    } else if (user.role === 'Giám đốc') {
      fetchDeptKPIList()
    }
  }, [reload, dispatch, id, page, user.role])

  const KpiApprovingTable = (props) => {
    return (
      <>
        <CTable align="middle" className="mb-0 border table-bordered" hover responsive striped>
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell>STT</CTableHeaderCell>
              <CTableHeaderCell>ID</CTableHeaderCell>
              <CTableHeaderCell>KPI</CTableHeaderCell>
              <CTableHeaderCell>Mô tả</CTableHeaderCell>
              <CTableHeaderCell>Đơn vị</CTableHeaderCell>
              {/*<CTableHeaderCell>TRẠNG THÁI</CTableHeaderCell>*/}
              <CTableHeaderCell />
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {props.temList.map((row, index) => (
              <CTableRow v-for="item in tableItems" key={index}>
                <CTableDataCell>{(page - 1) * entryPerPage + index + 1}</CTableDataCell>
                <CTableDataCell>{row.kpi_template_id}</CTableDataCell>
                <CTableDataCell>{row.kpi_template_name}</CTableDataCell>
                <CTableDataCell>{row.description}</CTableDataCell>
                <CTableDataCell>{row.unit}</CTableDataCell>
                <CTableDataCell className="text-center">
                  {/* <InfoKpiApproving kpiItem={row} /> */}
                  <div className="d-flex flex-row justify-content-center">
                    {true && ApproveTargetMonthlyPersonal(id, row, selectedMonth)}
                    {true && ApproveDataMonthlyPersonal(id, row, selectedMonth)}
                    <KpiInfoButton kpiItem={{ kpi_template: row }} />
                  </div>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
          <CTableFoot>
            <CTableRow>
              <CTableDataCell colSpan="6">
                <div className="d-flex flex-row justify-content-end">
                  <Pagination
                    page={page}
                    count={totalPage}
                    showFirstButton
                    showLastButton
                    size="small"
                    onChange={(event, page) => setPage(page)}
                  />
                </div>
              </CTableDataCell>
            </CTableRow>
          </CTableFoot>
        </CTable>
      </>
    )
  }

  KpiApprovingTable.propTypes = {
    temList: PropTypes.array,
  }

  const DeptKpiApprovingTable = (props) => {
    return (
      <>
        <CTable align="middle" className="mb-0 border table-bordered" hover responsive striped>
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell>STT</CTableHeaderCell>
              <CTableHeaderCell>ID</CTableHeaderCell>
              <CTableHeaderCell>KPI</CTableHeaderCell>
              <CTableHeaderCell>Mô tả</CTableHeaderCell>
              <CTableHeaderCell>Đơn vị</CTableHeaderCell>
              {/*<CTableHeaderCell>TRẠNG THÁI</CTableHeaderCell>*/}
              <CTableHeaderCell />
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {props.temList.map((row, index) => (
              <CTableRow v-for="item in tableItems" key={index}>
                <CTableDataCell>{(page - 1) * entryPerPage + index + 1}</CTableDataCell>
                <CTableDataCell>{row.kpi_template_id}</CTableDataCell>
                <CTableDataCell>{row.kpi_template_name}</CTableDataCell>
                <CTableDataCell>{row.description}</CTableDataCell>
                <CTableDataCell>{row.unit}</CTableDataCell>
                <CTableDataCell className="text-center">
                  <div className="d-flex flex-row justify-content-center">
                    {true && ApproveTargetQuarterPersonal(id, row, selectedQuarter)}
                    {true && ApproveDataQuarterPersonal(id, row, selectedQuarter)}
                    <KpiInfoButton kpiItem={{ kpi_template: row }} />
                  </div>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
          <CTableFoot>
            <CTableRow>
              <CTableDataCell colSpan="6">
                <div className="d-flex flex-row justify-content-end">
                  <Pagination
                    page={page}
                    count={totalPage}
                    showFirstButton
                    showLastButton
                    size="small"
                    onChange={(event, page) => setPage(page)}
                  />
                </div>
              </CTableDataCell>
            </CTableRow>
          </CTableFoot>
        </CTable>
      </>
    )
  }

  DeptKpiApprovingTable.propTypes = {
    temList: PropTypes.array,
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
                    <Button
                      variant="outlined"
                      startIcon={<KeyboardDoubleArrowLeftIcon />}
                      onClick={() => {
                        history.push(`/plan/${id}`)
                      }}
                      sx={{ textTransform: 'none', borderRadius: 10 }}
                    >
                      Quay lại kế hoạch
                    </Button>
                  </CCol>
                </CRow>
                <CRow className="mt-4">
                  <CCol xs={6}>
                    <h3>
                      <b>Duyệt KPI cá nhân</b>
                    </h3>
                  </CCol>
                  <CCol xs={6}>
                    <div className="d-grid gap-3 d-md-flex justify-content-end"></div>
                  </CCol>
                </CRow>
                {/*Table*/}
                <div className="mt-4">
                  {user.role === 'Quản lý' ? (
                    <KpiApprovingTable temList={entry} />
                  ) : user.role === 'Giám đốc' ? (
                    <DeptKpiApprovingTable temList={entry} />
                  ) : null}
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
      <SystemAlert />
    </div>
  )
}

export default KpiApproving
