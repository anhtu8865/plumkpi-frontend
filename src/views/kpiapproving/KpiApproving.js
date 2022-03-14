import {
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableFoot,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import SearchIcon from '@mui/icons-material/Search'
import CheckIcon from '@mui/icons-material/Check'
import DoDisturbIcon from '@mui/icons-material/DoDisturb'
import { Avatar, Button, Grid, Pagination, Checkbox } from '@mui/material'
import { Field, FormikProvider, useFormik } from 'formik'
import PropTypes from 'prop-types'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { LoadingCircle } from 'src/components/LoadingCircle'
import SystemAlert from 'src/components/SystemAlert'
import { createAlert } from 'src/slices/alertSlice'
import { setKpiApprovingLoading, setKpiApprovingReload } from 'src/slices/kpiApprovingSlice'
import api from 'src/views/axiosConfig'
import { useParams } from 'react-router-dom'

import { InfoKpiApproving } from './InfoKpiApproving'
//import AcceptedKpi from './AcceptedKpiApproving'

function colorStatus(status) {
  if (status == 'Đang xử lý') return 'text-warning'
  else if (status == 'Chấp nhận') return 'text-success'
  else if (status == 'Từ chối') return 'text-danger'
}

const KpiApproving = () => {
  const MOCK_DATA = [
    {
      approve_registration: 'Chấp nhận',
      target: '5000',
      kpi_template: {
        kpi_template_id: 1,
        kpi_template_name: 'KPI1',
        unit: 'VND',
      },
      plan: {
        user: {
          user_name: 'Name1',
          avatar: null,
        },
      },
    },
    {
      approve_registration: 'Từ chối',
      target: '5000',
      kpi_template: {
        kpi_template_id: 1,
        kpi_template_name: 'KPI1',
        unit: 'VND',
      },
      plan: {
        user: {
          user_name: 'Name1',
          avatar: null,
        },
      },
    },
    {
      approve_registration: 'Đang xử lý',
      target: '5000',
      kpi_template: {
        kpi_template_id: 1,
        kpi_template_name: 'KPI1',
        unit: 'VND',
      },
      plan: {
        user: {
          user_name: 'Name1',
          avatar: null,
        },
      },
    },
  ]
  const { id } = useParams()
  //console.log(id)
  const dispatch = useDispatch()

  const { kpiApprovingReload, kpiApprovingLoading } = useSelector((state) => state.kpiApproving)

  const entryPerPage = 10
  const [page, setPage] = React.useState(1)
  const [totalPage, setTotalPage] = React.useState(1)
  const [entry, setEntry] = React.useState(MOCK_DATA)

  const [selectedKpi, setSelectedKpi] = React.useState([])

  const handleKpiChange = (item) => {
    if (!selectedKpi.includes(item)) {
      setSelectedKpi([...selectedKpi, item])
    } else if (selectedKpi.includes(item)) {
      setSelectedKpi(
        selectedKpi.filter((tmp) => {
          if (tmp !== item) {
            return tmp
          }
        }),
      )
    }
  }

  React.useEffect(() => {
    async function fetchKPIList() {
      api
        .get(`/plans/plan/${id}/personal-kpis`, {
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

    fetchKPIList()
  }, [kpiApprovingReload, dispatch])

  const AcceptedKpiApproving = (props) => {
    const dispatch = useDispatch()
    const { kpiApprovingReload, kpiApprovingLoading } = useSelector((state) => state.kpiApproving)

    const [modalVisible, setModalVisible] = React.useState(false)
    const [isSubmit, setIsSubmit] = React.useState(false)

    const [acceptList, setAcceptList] = React.useState([])

    React.useEffect(() => {
      async function createRowsAccept() {
        //console.log(props.selectedKpi.length)
        let newAccList = []
        for (let i = 0; i < props.selectedKpi.length; i++) {
          let tmp = {
            plan: {
              plan_id: 3,
            },
            kpi_template: {
              kpi_template_id: 5,
            },
            approve_registration: 'Chấp nhận',
          }
          tmp.plan.plan_id = props.selectedKpi[i].plan.plan_id
          tmp.kpi_template.kpi_template_id = props.selectedKpi[i].kpi_template.kpi_template_id
          newAccList.push(tmp)
        }

        setAcceptList(newAccList)
      }
      createRowsAccept()
    }, [props.selectedKpi, kpiApprovingReload])

    const onClickAccept = () => {
      setIsSubmit(true)

      api
        .put(`/plans/plan/${props.plan_id}/personal-kpis`, { rows: acceptList })
        .then(() => {
          //console.log(acceptList)
          dispatch(
            createAlert({
              message: 'Chấp nhận KPI thành công.',
              type: 'success',
            }),
          )
          dispatch(
            setKpiApprovingLoading({
              value: true,
            }),
          )
          dispatch(setKpiApprovingReload())
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
          setIsSubmit(false)
        })
    }

    return (
      <>
        <Button
          variant="contained"
          color="success"
          startIcon={<CheckIcon />}
          onClick={() => setModalVisible(true)}
        >
          Chấp nhận
        </Button>
        <CModal
          alignment="center"
          scrollable
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false)
          }}
        >
          <CModalHeader>
            <CModalTitle>Duyệt KPI</CModalTitle>
          </CModalHeader>
          <CModalBody className="mx-4 mb-3">
            Bạn có chắc chắn muốn chấp nhận KPI đã chọn ?
          </CModalBody>
          <CModalFooter>
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckIcon />}
              type="submit"
              onClick={() => onClickAccept()}
              disabled={isSubmit}
            >
              Xác nhận
            </Button>
            {isSubmit && <LoadingCircle />}
          </CModalFooter>
        </CModal>
      </>
    )
  }
  AcceptedKpiApproving.propTypes = {
    selectedKpi: PropTypes.array,
    plan_id: PropTypes.string,
  }

  //Denied
  const DeniedKpiApproving = (props) => {
    const dispatch = useDispatch()
    const { kpiApprovingReload, kpiApprovingLoading } = useSelector((state) => state.kpiApproving)

    const [modalVisible, setModalVisible] = React.useState(false)
    const [isSubmit, setIsSubmit] = React.useState(false)

    const [acceptList, setAcceptList] = React.useState([])

    React.useEffect(() => {
      async function createRowsAccept() {
        let newAccList = []
        for (let i = 0; i < props.selectedKpi.length; i++) {
          let tmp = {
            plan: {
              plan_id: 3,
            },
            kpi_template: {
              kpi_template_id: 5,
            },
            approve_registration: 'Từ chối',
          }
          tmp.plan.plan_id = props.selectedKpi[i].plan.plan_id
          tmp.kpi_template.kpi_template_id = props.selectedKpi[i].kpi_template.kpi_template_id
          newAccList.push(tmp)
        }

        setAcceptList(newAccList)
      }
      createRowsAccept()
    }, [props.selectedKpi, kpiApprovingReload])

    const onClickAccept = () => {
      setIsSubmit(true)

      api
        .put(`/plans/plan/${props.plan_id}/personal-kpis`, { rows: acceptList })
        .then(() => {
          //console.log(acceptList)
          dispatch(
            createAlert({
              message: 'Chấp nhận KPI thành công.',
              type: 'success',
            }),
          )
          dispatch(
            setKpiApprovingLoading({
              value: true,
            }),
          )
          dispatch(setKpiApprovingReload())
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
          setIsSubmit(false)
        })
    }

    return (
      <>
        <Button
          variant="contained"
          color="error"
          startIcon={<DoDisturbIcon />}
          onClick={() => setModalVisible(true)}
        >
          Từ chối
        </Button>
        <CModal
          alignment="center"
          scrollable
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false)
          }}
        >
          <CModalHeader>
            <CModalTitle>Duyệt KPI</CModalTitle>
          </CModalHeader>
          <CModalBody className="mx-4 mb-3">Bạn có chắc chắn muốn từ chối KPI đã chọn ?</CModalBody>
          <CModalFooter>
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckIcon />}
              type="submit"
              onClick={() => onClickAccept()}
              disabled={isSubmit}
            >
              Xác nhận
            </Button>
            {isSubmit && <LoadingCircle />}
          </CModalFooter>
        </CModal>
      </>
    )
  }
  DeniedKpiApproving.propTypes = {
    selectedKpi: PropTypes.array,
    plan_id: PropTypes.string,
  }

  const KpiApprovingTable = (props) => {
    return (
      <>
        <CTable align="middle" className="mb-0 border table-bordered" hover responsive striped>
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell />
              <CTableHeaderCell>KPI</CTableHeaderCell>
              <CTableHeaderCell>MỤC TIÊU</CTableHeaderCell>
              <CTableHeaderCell>ĐƠN VỊ</CTableHeaderCell>
              <CTableHeaderCell>NGƯỜI ĐĂNG KÝ</CTableHeaderCell>
              <CTableHeaderCell>TRẠNG THÁI</CTableHeaderCell>
              {/*<CTableHeaderCell>TRẠNG THÁI</CTableHeaderCell>*/}
              <CTableHeaderCell />
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {props.temList.map((row, index) => (
              <CTableRow v-for="item in tableItems" key={index}>
                <CTableDataCell>
                  {' '}
                  <Checkbox
                    size="small"
                    checked={selectedKpi.includes(row)}
                    onChange={() => {
                      handleKpiChange(row)
                    }}
                  />
                </CTableDataCell>
                <CTableDataCell>{row.kpi_template.kpi_template_name}</CTableDataCell>
                <CTableDataCell>{row.target}</CTableDataCell>
                <CTableDataCell>{row.kpi_template.unit}</CTableDataCell>
                <CTableDataCell className="d-flex flex-row">
                  <Avatar
                    src={row.plan.user.avatar !== null ? row.plan.user.avatar.url : null}
                    className="me-3"
                  />
                  {row.plan.user.user_name}
                </CTableDataCell>
                <CTableDataCell className={colorStatus(row.approve_registration)}>
                  {row.approve_registration}
                </CTableDataCell>
                <CTableDataCell className="text-center">
                  {/* <InfoKpiApproving kpiItem={row} /> */}
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
                  onChange={(event, page) => setPage(page)}
                />
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

  return (
    <div className="bg-light min-vh-100 d-flex flex-col">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol xs={12}>
            <CCard>
              <CCardBody className="p-4">
                <CRow>
                  <CCol xs={6}>
                    <h4>Duyệt KPI cá nhân</h4>
                  </CCol>
                  <CCol xs={6}>
                    <div className="d-grid gap-3 d-md-flex justify-content-end">
                      <AcceptedKpiApproving plan_id={id} selectedKpi={selectedKpi} />
                      <DeniedKpiApproving plan_id={id} selectedKpi={selectedKpi} />
                    </div>
                  </CCol>
                </CRow>
                {/*Table*/}
                <div className="mt-2 p-4">
                  <KpiApprovingTable temList={entry} />
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
