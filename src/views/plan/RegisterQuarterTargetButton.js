import React, { useState } from 'react'
import { Button, IconButton } from '@mui/material'
import {
  CModal,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CModalHeader,
  CRow,
  CCol,
  CFormInput,
  CFormFeedback,
  CFormLabel,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { createAlert } from 'src/slices/alertSlice'
import api from 'src/views/axiosConfig'
import { LoadingCircle } from 'src/components/LoadingCircle'
import { setReload, setLoading } from 'src/slices/viewSlice'
import TrackChangesIcon from '@mui/icons-material/TrackChanges'
import CheckIcon from '@mui/icons-material/Check'
import { compareYear, formatNumber } from 'src/utils/function'

export const RegisterQuarterTargetButton = (kpiItem, quarter) => {
  const dispatch = useDispatch()
  const [modalVisible, setModalVisible] = useState(false)
  const [isSubmit, setIsSubmit] = useState(false)
  const [selectValue, setSelectValue] = useState('Quarter')
  const [selectedQuarter, setSelectedQuarter] = useState(Number(quarter))
  const { plan } = useSelector((state) => state.planDetail)
  const { user } = useSelector((state) => state.user)
  const [target, setTarget] = useState(0)

  const registerQuarterTarget = async (target) => {
    try {
      await api.put(`/plans/register-quarterly-target/manager`, {
        plan_id: plan.plan_id,
        kpi_template_id: kpiItem.kpi_template.kpi_template_id,
        target: Number(target),
        quarter: Number(selectedQuarter),
      })
      dispatch(
        createAlert({
          message: 'Đăng ký chỉ tiêu KPI thành công',
          type: 'success',
        }),
      )
      setModalVisible(false)
      dispatch(
        setLoading({
          value: true,
        }),
      )
      dispatch(setReload())
    } catch (error) {
      if (error.response) {
        dispatch(
          createAlert({
            message: error.response.data.message,
            type: 'error',
          }),
        )
      }
    }
  }

  React.useEffect(() => {
    setTarget(handleQuarterTargetValue(kpiItem))
  }, [selectedQuarter])

  const onQuarterSubmit = async (event, target) => {
    setIsSubmit(true)
    await registerQuarterTarget(target)
    setIsSubmit(false)
  }

  const handleQuarterTargetValue = (item) => {
    switch (selectedQuarter) {
      case 1: {
        if (item.first_quarterly_target) {
          return item.first_quarterly_target.target
        }
        return 0
      }
      case 2: {
        if (item.second_quarterly_target) {
          return item.second_quarterly_target.target
        }
        return 0
      }
      case 3: {
        if (item.third_quarterly_target) {
          return item.third_quarterly_target.target
        }
        return 0
      }
      case 4: {
        if (item.fourth_quarterly_target) {
          return item.fourth_quarterly_target.target
        }
        return 0
      }
      default:
        return 0
    }
  }

  const handleQuarterTargetStatus = (item) => {
    switch (selectedQuarter) {
      case 1: {
        if (item.first_quarterly_target) {
          return item.first_quarterly_target.approve
        }
        return ''
      }
      case 2: {
        if (item.second_quarterly_target) {
          return item.second_quarterly_target.approve
        }
        return ''
      }
      case 3: {
        if (item.third_quarterly_target) {
          return item.third_quarterly_target.approve
        }
        return ''
      }
      case 4: {
        if (item.fourth_quarterly_target) {
          return item.fourth_quarterly_target.approve
        }
        return ''
      }
      default:
        return ''
    }
  }

  const QuarterTargetView = () => {
    return (
      <>
        <CRow className="mt-2">
          <CCol xs={12} sm={6}>
            <CFormLabel htmlFor="freq">Chọn quý</CFormLabel>
            <CFormSelect
              id="freq"
              value={selectedQuarter}
              onChange={(event) => {
                setSelectedQuarter(Number(event.target.value))
              }}
            >
              <option value={1}>Quý 1</option>
              <option value={2}>Quý 2</option>
              <option value={3}>Quý 3</option>
              <option value={4}>Quý 4</option>
            </CFormSelect>
          </CCol>
        </CRow>
        <CRow className="mt-4">
          <CCol xs={12}>
            <CFormLabel htmlFor="parenttarget">Chỉ tiêu KPI quý {selectedQuarter}</CFormLabel>
            <CInputGroup>
              <CFormInput
                id="parenttarget"
                placeholder="Nhập chỉ tiêu KPI"
                type="number"
                value={target}
                onChange={(event) => {
                  setTarget(event.target.value)
                }}
                invalid={handleQuarterTargetStatus(kpiItem) === 'Từ chối'}
                valid={handleQuarterTargetStatus(kpiItem) === 'Chấp nhận'}
                disabled={handleQuarterTargetStatus(kpiItem) === 'Chấp nhận'}
              />
              <CInputGroupText>{kpiItem.kpi_template.unit}</CInputGroupText>
              <CFormFeedback invalid>
                Chỉ tiêu không được Ban giám đốc chấp nhận. Bạn nhập lại chỉ tiêu khác nhé.
              </CFormFeedback>
              <CFormFeedback valid>Chỉ tiêu đã được duyệt bởi Ban giám đốc.</CFormFeedback>
              {handleQuarterTargetStatus(kpiItem) === 'Đang xử lý' && (
                <CRow className="mt-1">
                  <div>
                    <small>Chỉ tiêu đang chờ Ban giám đốc xét duyệt...</small>
                  </div>
                </CRow>
              )}
            </CInputGroup>
            <CFormFeedback invalid></CFormFeedback>
          </CCol>
        </CRow>
      </>
    )
  }

  const HasTargetView = () => {
    return (
      <>
        <CRow className="mt-2">
          <CCol xs={12}>
            <b>KPI:</b> {kpiItem.kpi_template.kpi_template_name}
          </CCol>
        </CRow>
        <CRow className="mt-2">
          <CCol xs={12}>
            <b>Phòng ban:</b> {user.manage.dept_name}
          </CCol>
        </CRow>
        {/*<CRow className="mt-2">
          <CCol xs={12} sm={6}>
            <CFormLabel htmlFor="freq">Theo</CFormLabel>
            <CFormSelect
              id="freq"
              value={selectValue}
              onChange={(event) => {
                setSelectValue(event.target.value)
              }}
            >
              <option value="Quarter">Quý</option>
            </CFormSelect>
          </CCol>
            </CRow>*/}
        {selectValue === 'Quarter' && QuarterTargetView()}
      </>
    )
  }

  return (
    <>
      <IconButton
        color="primary"
        onClick={() => {
          setModalVisible(true)
        }}
        size="small"
      >
        <TrackChangesIcon fontSize="small" />
      </IconButton>

      <CModal
        alignment="center"
        size="lg"
        scrollable
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false)
        }}
      >
        <CModalHeader>
          <CModalTitle>Đăng ký chỉ tiêu KPI</CModalTitle>
        </CModalHeader>
        <CModalBody className="mx-4 mb-3">{HasTargetView()}</CModalBody>
        <CModalFooter>
          {selectValue === 'Quarter' && (
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckIcon />}
              type="submit"
              onClick={(event) => {
                onQuarterSubmit(event, target)
              }}
              disabled={
                isSubmit ||
                target === '' ||
                !compareYear(plan.year) ||
                handleQuarterTargetStatus(kpiItem) === 'Chấp nhận'
              }
              sx={{ textTransform: 'none', borderRadius: 10 }}
            >
              Đăng kí
            </Button>
          )}
          {isSubmit && <LoadingCircle />}
        </CModalFooter>
      </CModal>
    </>
  )
}
