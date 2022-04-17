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
import AddBoxIcon from '@mui/icons-material/AddBox'
import CheckIcon from '@mui/icons-material/Check'
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft'
import SearchIcon from '@mui/icons-material/Search'
import { Avatar, Button, Grid, Pagination, Checkbox, IconButton } from '@mui/material'
import { Field, FormikProvider, useFormik } from 'formik'
import PropTypes from 'prop-types'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { LoadingCircle } from 'src/components/LoadingCircle'
import SystemAlert from 'src/components/SystemAlert'
import { createAlert } from 'src/slices/alertSlice'
import { setLoading, setReload } from 'src/slices/viewSlice'
import api from 'src/views/axiosConfig'
import { useParams } from 'react-router-dom'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft'

// import AddKpiRegistration from './AddKpiRegistration'
// import DeleteKpiRegistration from './DeleteKpiRegistration'
// import EditKpiRegistration from './EditKpiRegistration'
import { InfoKpiRegistration } from './InfoKpiRegistration'
import { KpiInfoButton } from 'src/views/plan/planDetail/KpiInfoButton'

const KpiRegistration = () => {
  const history = useHistory()
  const { id } = useParams()
  //console.log(id)
  const dispatch = useDispatch()

  const entryPerPage = 10
  const [page, setPage] = React.useState(1)
  const [totalPage, setTotalPage] = React.useState(1)
  const [entry, setEntry] = React.useState([])

  const { reload, loading } = useSelector((state) => state.view)

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

  const getKpiList = async () => {
    let paramsObject = {
      offset: (page - 1) * entryPerPage,
      limit: entryPerPage,
      plan_id: id,
    }

    const response = await api.get('/kpi-templates/personal-kpis', {
      params: paramsObject,
    })
    return response.data
  }

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getKpiList()
        if (result) {
          setTotalPage(Math.ceil(result.count / entryPerPage))
          setEntry(result.items)
          for (let i = 0; i < result.items.length; i++) {
            if (result.items[i].registered) {
              setSelectedKpi((selectedKpi) => [...selectedKpi, result.items[i]])
            }
          }
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
  }, [reload, dispatch])

  //Đăng ký KPI cá nhân
  const AddKpiRegistration = (props) => {
    const id = parseInt(props.plan_id)
    const dispatch = useDispatch()

    const [modalVisible, setModalVisible] = React.useState(false)
    const [isSubmit, setIsSubmit] = React.useState(false)

    const [regisList, setRegisList] = React.useState([])

    const { user } = useSelector((state) => state.user)

    React.useEffect(() => {
      async function createRowsAccept() {
        //console.log(props.selectedKpi.length)
        let newRegisList = []
        for (let i = 0; i < props.selectedKpi.length; i++) {
          let tmp = {}
          tmp.kpi_template_id = props.selectedKpi[i].kpi_template_id
          newRegisList.push(tmp)
        }
        // console.log(newRegisList)
        setRegisList(newRegisList)
      }
      createRowsAccept()
    }, [props.selectedKpi, reload])

    const onClickRegis = () => {
      setIsSubmit(true)

      if (user.role == 'Nhân viên') {
        api
          .post(`plans/register-personal-kpis/employee`, {
            plan_id: id,
            personal_kpis: regisList,
          })
          .then(() => {
            //console.log(acceptList)
            dispatch(
              createAlert({
                message: 'Đăng ký KPI thành công.',
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
            setSelectedKpi([])
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
      } else if (user.role == 'Quản lý') {
        api
          .post(`plans/register-personal-kpis/manager`, {
            plan_id: id,
            personal_kpis: regisList,
          })
          .then(() => {
            //console.log(acceptList)
            dispatch(
              createAlert({
                message: 'Đăng ký KPI thành công.',
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
            setSelectedKpi([])
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
    }

    return (
      <>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddBoxIcon />}
          onClick={() => setModalVisible(true)}
          sx={{ textTransform: 'none', borderRadius: 10 }}
        >
          Đăng ký
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
            <CModalTitle>Đăng ký KPI</CModalTitle>
          </CModalHeader>
          <CModalBody className="mx-4 mb-3">Bạn có chắc chắn muốn đăng ký KPI đã chọn ?</CModalBody>
          <CModalFooter>
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckIcon />}
              type="submit"
              onClick={() => onClickRegis()}
              disabled={isSubmit}
              sx={{ textTransform: 'none', borderRadius: 10 }}
            >
              Xác nhận
            </Button>
            {isSubmit && <LoadingCircle />}
          </CModalFooter>
        </CModal>
      </>
    )
  }
  AddKpiRegistration.propTypes = {
    selectedKpi: PropTypes.array,
    plan_id: PropTypes.string,
  }

  const KpiRegistrationTable = (props) => {
    return (
      <>
        <CTable align="middle" className="mb-0 border table-bordered" hover responsive>
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell />
              <CTableHeaderCell>ID</CTableHeaderCell>
              <CTableHeaderCell>KPI</CTableHeaderCell>
              <CTableHeaderCell>Mô tả</CTableHeaderCell>
              <CTableHeaderCell>Đơn vị</CTableHeaderCell>
              <CTableHeaderCell>Đăng ký</CTableHeaderCell>
              <CTableHeaderCell />
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {props.temList.map((row, index) => (
              <CTableRow
                v-for="item in tableItems"
                key={index}
                color={selectedKpi.includes(row) ? 'info' : null}
              >
                <CTableDataCell>
                  <Checkbox
                    size="small"
                    checked={selectedKpi.includes(row)}
                    onChange={() => {
                      handleKpiChange(row)
                    }}
                  />
                </CTableDataCell>
                <CTableDataCell>{row.kpi_template_id}</CTableDataCell>
                <CTableDataCell>{row.kpi_template_name}</CTableDataCell>
                <CTableDataCell>{row.description}</CTableDataCell>
                <CTableDataCell>{row.unit}</CTableDataCell>
                <CTableDataCell>{row.registered ? 'Có' : 'Không'}</CTableDataCell>
                <CTableDataCell className="text-center">
                  <KpiInfoButton kpiItem={{ kpi_template: row }} />
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

  KpiRegistrationTable.propTypes = {
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
                      <b>Đăng ký KPI cá nhân</b>
                    </h3>
                  </CCol>
                  <CCol xs={6}>
                    <div className="d-grid d-md-flex justify-content-end">
                      <AddKpiRegistration plan_id={id} selectedKpi={selectedKpi} />
                    </div>
                  </CCol>
                </CRow>
                {/*Table*/}
                <div className="mt-4">
                  <KpiRegistrationTable temList={entry} />
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

export default KpiRegistration
