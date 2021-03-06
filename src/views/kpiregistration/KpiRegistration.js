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
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import AddBoxIcon from '@mui/icons-material/AddBox'
import CheckIcon from '@mui/icons-material/Check'
import { Button, Pagination, Checkbox } from '@mui/material'
import PropTypes from 'prop-types'
import React, { useCallback } from 'react'
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
//import { InfoKpiRegistration } from './InfoKpiRegistration'
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

  const { reload } = useSelector((state) => state.view)

  const [selectedKpi, setSelectedKpi] = React.useState([])
  const [isCheckedAll, setIsCheckedAll] = React.useState(false)

  const handleKpiChange = (item) => {
    if (!selectedKpi.includes(item)) {
      setSelectedKpi([...selectedKpi, item])
    } else if (selectedKpi.includes(item)) {
      setSelectedKpi(
        selectedKpi.filter((tmp) => {
          return tmp !== item
        }),
      )
    }
  }

  const handleAllKpiChange = () => {
    setIsCheckedAll(!isCheckedAll)
    if (!isCheckedAll) {
      setSelectedKpi(entry)
    } else {
      setSelectedKpi([])
    }
  }

  const getKpiList = useCallback(async () => {
    let paramsObject = {
      offset: (page - 1) * entryPerPage,
      limit: entryPerPage,
      plan_id: id,
    }

    const response = await api.get('/kpi-templates/personal-kpis', {
      params: paramsObject,
    })
    return response.data
  }, [id, page])

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
  }, [reload, dispatch, getKpiList])

  //????ng k?? KPI c?? nh??n
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
    }, [props.selectedKpi])

    const onClickRegis = () => {
      setIsSubmit(true)

      if (user.role === 'Nh??n vi??n') {
        api
          .post(`plans/register-personal-kpis/employee`, {
            plan_id: id,
            personal_kpis: regisList,
          })
          .then(() => {
            //console.log(acceptList)
            dispatch(
              createAlert({
                message: '????ng k?? KPI th??nh c??ng.',
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
      } else if (user.role === 'Qu???n l??') {
        api
          .post(`plans/register-personal-kpis/manager`, {
            plan_id: id,
            personal_kpis: regisList,
          })
          .then(() => {
            //console.log(acceptList)
            dispatch(
              createAlert({
                message: '????ng k?? KPI th??nh c??ng.',
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
          ????ng k??
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
            <CModalTitle>????ng k?? KPI</CModalTitle>
          </CModalHeader>
          <CModalBody className="mx-4 mb-3">B???n c?? ch???c ch???n mu???n ????ng k?? KPI ???? ch???n ?</CModalBody>
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
              X??c nh???n
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
              <CTableHeaderCell>
                <Checkbox
                  size="small"
                  checked={isCheckedAll}
                  onChange={() => {
                    handleAllKpiChange()
                  }}
                />
              </CTableHeaderCell>
              <CTableHeaderCell>STT</CTableHeaderCell>
              <CTableHeaderCell>ID</CTableHeaderCell>
              <CTableHeaderCell>KPI</CTableHeaderCell>
              <CTableHeaderCell>????n v???</CTableHeaderCell>
              <CTableHeaderCell>????ng k??</CTableHeaderCell>
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
                <CTableDataCell>{(page - 1) * entryPerPage + index + 1}</CTableDataCell>
                <CTableDataCell>{row.kpi_template_id}</CTableDataCell>
                <CTableDataCell>{row.kpi_template_name}</CTableDataCell>
                <CTableDataCell>{row.unit}</CTableDataCell>
                <CTableDataCell>{row.registered ? 'C??' : 'Kh??ng'}</CTableDataCell>
                <CTableDataCell className="text-center">
                  <KpiInfoButton kpiItem={{ kpi_template: row }} />
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
          <CTableFoot>
            <CTableRow>
              <CTableDataCell colSpan="7">
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
                      Quay l???i k??? ho???ch
                    </Button>
                  </CCol>
                </CRow>
                <CRow className="mt-4">
                  <CCol xs={6}>
                    <h3>
                      <b>????ng k?? KPI c?? nh??n</b>
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
