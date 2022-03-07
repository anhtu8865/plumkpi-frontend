import { CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { Button, IconButton } from '@mui/material'
import PropTypes from 'prop-types'
import React from 'react'
import { useDispatch } from 'react-redux'
import { LoadingCircle } from 'src/components/LoadingCircle'
import { createAlert } from 'src/slices/alertSlice'
import { setKpiApprovingLoading, setKpiApprovingReload } from 'src/slices/kpiApprovingSlice'
import api from 'src/views/axiosConfig'

import CheckIcon from '@mui/icons-material/Check'
import AddBoxIcon from '@mui/icons-material/AddBox'

const AcceptedKpiApproving = (props) => {
  const dispatch = useDispatch()
  const [modalVisible, setModalVisible] = React.useState(false)
  const [isSubmit, setIsSubmit] = React.useState(false)

  const [acceptList, setAcceptList] = React.useState([])

  const onClickAccept = () => {
    setIsSubmit(true)

    api
      .put(`/plans/plan/${props.plan_id}/personal-kpis`, { rows: [] })
      .then(() => {
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

  function createRowsAccept() {
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
      setAcceptList([...acceptList, tmp])
      return acceptList
    }
  }

  return (
    <>
      {console.log(props.selectedKpi)}
      {console.log(props.selectedKpi.length)}
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
        <CModalBody className="mx-4 mb-3">Bạn có chắc chắn muốn chấp nhận KPI đã chọn ?</CModalBody>
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

export default AcceptedKpiApproving
