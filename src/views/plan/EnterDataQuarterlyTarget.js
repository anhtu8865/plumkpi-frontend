import {
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import FilePresentIcon from '@mui/icons-material/FilePresent'
import { Button, IconButton, TextareaAutosize } from '@mui/material'
import PropTypes from 'prop-types'
import SaveIcon from '@mui/icons-material/Save'
import React from 'react'
import { useDispatch } from 'react-redux'
import { LoadingCircle } from 'src/components/LoadingCircle'
import { createAlert } from 'src/slices/alertSlice'
import { formatNumber } from 'src/utils/function'

import api from 'src/views/axiosConfig'
import { useFormik } from 'formik'
import * as yup from 'yup'

const EnterDataQuarterlyTarget = (props) => {
  //console.log(props)
  const { plan, item, selectedQuarter } = props
  //console.log(item)

  const dispatch = useDispatch()

  const [isSubmit, setIsSubmit] = React.useState(false)

  const [modalVisible, setModalVisible] = React.useState(false)

  const onClickDelete = () => {
    setIsSubmit(true)
  }

  // const handleQuarterActualValue = (item) => {
  //   switch (selectedQuarter) {
  //     case 1: {
  //       if (
  //         item.first_quarterly_target &&
  //         item.first_quarterly_target.approve === 'Chấp nhận' &&
  //         item.first_quarterly_target.hasOwnProperty('actual')
  //       ) {
  //         return formatNumber(item.first_quarterly_target.actual.value)
  //       }
  //       return 'Chưa có'
  //     }
  //     case 2: {
  //       if (
  //         item.second_quarterly_target &&
  //         item.second_quarterly_target.approve === 'Chấp nhận' &&
  //         item.second_quarterly_target.hasOwnProperty('actual')
  //       ) {
  //         return formatNumber(item.second_quarterly_target.actual.value)
  //       }
  //       return 'Chưa có'
  //     }
  //     case 3: {
  //       if (
  //         item.third_quarterly_target &&
  //         item.third_quarterly_target.approve === 'Chấp nhận' &&
  //         item.third_quarterly_target.hasOwnProperty('actual')
  //       ) {
  //         return formatNumber(item.third_quarterly_target.actual.value)
  //       }
  //       return 'Chưa có'
  //     }
  //     case 4: {
  //       if (
  //         item.fourth_quarterly_target &&
  //         item.fourth_quarterly_target.approve === 'Chấp nhận' &&
  //         item.fourth_quarterly_target.hasOwnProperty('actual')
  //       ) {
  //         return formatNumber(item.fourth_quarterly_target.actual.value)
  //       }
  //       return 'Chưa có'
  //     }
  //     default:
  //       return 'Chưa có'
  //   }
  // }

  const handleQuarterActualValue = (item) => {
    switch (selectedQuarter) {
      case 1: {
        if (
          item.first_quarterly_target &&
          item.first_quarterly_target.approve === 'Chấp nhận' &&
          item.first_quarterly_target.hasOwnProperty('actual')
        ) {
          return item.first_quarterly_target.actual.value
        }
        return 0
      }
      case 2: {
        if (
          item.second_quarterly_target &&
          item.second_quarterly_target.approve === 'Chấp nhận' &&
          item.second_quarterly_target.hasOwnProperty('actual')
        ) {
          return item.second_quarterly_target.actual.value
        }
        return 0
      }
      case 3: {
        if (
          item.third_quarterly_target &&
          item.third_quarterly_target.approve === 'Chấp nhận' &&
          item.third_quarterly_target.hasOwnProperty('actual')
        ) {
          return item.third_quarterly_target.actual.value
        }
        return 0
      }
      case 4: {
        if (
          item.fourth_quarterly_target &&
          item.fourth_quarterly_target.approve === 'Chấp nhận' &&
          item.fourth_quarterly_target.hasOwnProperty('actual')
        ) {
          return item.fourth_quarterly_target.actual.value
        }
        return 0
      }
      default:
        return 0
    }
  }

  const handleQuarterDataStatus = (item) => {
    //console.log(item)
    switch (selectedQuarter) {
      case 1: {
        if (item.first_quarterly_target) {
          if (item.first_quarterly_target.hasOwnProperty('actual')) {
            return item.first_quarterly_target.actual.approve
          }
        }
        return ''
      }
      case 2: {
        if (item.second_quarterly_target) {
          if (item.second_quarterly_target.hasOwnProperty('actual'))
            return item.second_quarterly_target.actual.approve
        }
        return ''
      }
      case 3: {
        if (item.third_quarterly_target) {
          if (item.third_quarterly_target.hasOwnProperty('actual'))
            return item.third_quarterly_target.actual.approve
        }
        return ''
      }
      case 4: {
        if (item.fourth_quarterly_target) {
          if (item.fourth_quarterly_target.hasOwnProperty('actual'))
            return item.fourth_quarterly_target.actual.approve
        }
        return ''
      }
      default:
        return ''
    }
  }

  const handleQuarterDataNote = (item) => {
    switch (selectedQuarter) {
      case 1: {
        if (item.first_quarterly_target) {
          if (item.first_quarterly_target.hasOwnProperty('actual'))
            return item.first_quarterly_target.actual.note
        }
        return ''
      }
      case 2: {
        if (item.second_quarterly_target) {
          if (item.second_quarterly_target.hasOwnProperty('actual'))
            return item.second_quarterly_target.actual.note
        }
        return ''
      }
      case 3: {
        if (item.third_quarterly_target) {
          if (item.third_quarterly_target.hasOwnProperty('actual'))
            return item.third_quarterly_target.actual.note
        }
        return ''
      }
      case 4: {
        if (item.fourth_quarterly_target) {
          if (item.fourth_quarterly_target.hasOwnProperty('actual'))
            return item.fourth_quarterly_target.actual.note
        }
        return ''
      }
      default:
        return ''
    }
  }

  const validationSchema = yup.object({})

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      plan_id: plan.plan_id,
      kpi_template_id: item.kpi_template.kpi_template_id,
      quarter: selectedQuarter,
      value: handleQuarterActualValue(item),
      note: handleQuarterDataNote(item),
    },
    validateOnBlur: true,
    onSubmit: (values, { resetForm }) => {
      //console.log(values)
      api
        .put('plans/enter-data-quarterly-target/manager', {
          plan_id: values.plan_id,
          kpi_template_id: values.kpi_template_id,
          quarter: values.quarter,
          value: values.value,
          note: values.note,
        })
        .then(() => {
          dispatch(
            createAlert({
              message: 'Cập nhật thành công.',
              type: 'success',
            }),
          )
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
          formik.setSubmitting(false)
        })
    },
    validationSchema: validationSchema,
  })

  return (
    <>
      <CForm onSubmit={formik.handleSubmit}>
        <CInputGroup>
          <CFormInput
            type="number"
            defaultValue={formatNumber(handleQuarterActualValue(item))}
            valid={handleQuarterDataStatus(item) === 'Chấp nhận'}
            invalid={handleQuarterDataStatus(item) === 'Từ chối'}
            {...formik.getFieldProps('value')}
          />
          <IconButton
            id="note"
            color="primary"
            onClick={() => {
              setModalVisible(true)
            }}
            size="small"
          >
            <FilePresentIcon fontSize="small" />
          </IconButton>
          <CModal
            alignment="center"
            scrollable
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
          >
            <CModalHeader>
              <CModalTitle>Ghi chú</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <div className="mb-3">
                <TextareaAutosize
                  aria-label="minimum height"
                  minRows={4}
                  defaultValue={handleQuarterDataNote(item)}
                  style={{ width: '100%' }}
                  {...formik.getFieldProps('note')}
                />
              </div>
            </CModalBody>
            <CModalFooter></CModalFooter>
          </CModal>
          <IconButton
            variant="contained"
            color="primary"
            onClick={formik.submitForm}
            disabled={formik.isSubmitting}
            size="small"
          >
            <SaveIcon fontSize="small" />
          </IconButton>{' '}
        </CInputGroup>
      </CForm>
    </>
  )
}

EnterDataQuarterlyTarget.propTypes = {
  plan: PropTypes.object,
  item: PropTypes.object,
  selectedQuarter: PropTypes.number,
  // value: PropTypes.number,
}

export default EnterDataQuarterlyTarget
