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
import NoteDataMonthly from './NoteDataMonthlyApprove'

const EnterDateMonthlyTarget = (props) => {
  //console.log(props)
  const { plan, item, selectedMonth } = props

  const dispatch = useDispatch()

  const [isSubmit, setIsSubmit] = React.useState(false)

  const [modalVisible, setModalVisible] = React.useState(false)

  const onClickDelete = () => {
    setIsSubmit(true)
  }

  const handleMonthActualValue = (item) => {
    //console.log(item)
    switch (selectedMonth) {
      case 1: {
        if (item.first_monthly_target) {
          if (item.first_monthly_target.hasOwnProperty('actual')) {
            return item.first_monthly_target.actual.value
          }
        }
        return 0
      }
      case 2: {
        if (item.second_monthly_target) {
          if (item.second_monthly_target.hasOwnProperty('actual')) {
            return item.second_monthly_target.actual.value
          }
        }
        return 0
      }
      case 3: {
        if (item.third_monthly_target) {
          if (item.third_monthly_target.hasOwnProperty('actual')) {
            if (item.third_monthly_target.actual) {
              return item.third_monthly_target.actual.value
            }
          }
        }
        return 0
      }
      case 4: {
        if (item.fourth_monthly_target) {
          if (item.fourth_monthly_target.hasOwnProperty('actual')) {
            return item.fourth_monthly_target.actual.value
          }
        }
        return 0
      }
      case 5: {
        if (item.fifth_monthly_target) {
          if (item.fifth_monthly_target.hasOwnProperty('actual')) {
            return item.fifth_monthly_target.actual.value
          }
        }
        return 0
      }
      case 6: {
        if (item.sixth_monthly_target) {
          if (item.sixth_monthly_target.hasOwnProperty('actual')) {
            return item.sixth_monthly_target.actual.value
          }
        }
        return 0
      }
      case 7: {
        if (item.seventh_monthly_target) {
          if (item.seventh_monthly_target.hasOwnProperty('actual')) {
            return item.seventh_monthly_target.actual.value
          }
        }
        return 0
      }
      case 8: {
        if (item.eighth_monthly_target) {
          if (item.eighth_monthly_target.hasOwnProperty('actual')) {
            return item.eighth_monthly_target.actual.value
          }
        }
        return 0
      }
      case 9: {
        if (item.ninth_monthly_target) {
          if (item.ninth_monthly_target.hasOwnProperty('actual')) {
            return item.ninth_monthly_target.actual.value
          }
        }
        return 0
      }
      case 10: {
        if (item.tenth_monthly_target) {
          if (item.tenth_monthly_target.hasOwnProperty('actual')) {
            return item.tenth_monthly_target.actual.value
          }
        }
        return 0
      }
      case 11: {
        if (item.eleventh_monthly_target) {
          if (item.eleventh_monthly_target.hasOwnProperty('actual')) {
            return item.eleventh_monthly_target.actual.value
          }
        }
        return 0
      }
      case 12: {
        if (item.twelfth_monthly_target) {
          if (item.twelfth_monthly_target.hasOwnProperty('actual')) {
            return item.twelfth_monthly_target.actual.value
          }
        }
        return 0
      }
      default:
        return 0
    }
  }

  const handleMonthActualStatus = (item) => {
    switch (selectedMonth) {
      case 1: {
        if (item.first_monthly_target) {
          if (item.first_monthly_target.hasOwnProperty('actual')) {
            return item.first_monthly_target.actual.approve
          }
        }
        return 'Chưa có'
      }
      case 2: {
        if (item.second_monthly_target) {
          if (item.second_monthly_target.hasOwnProperty('actual')) {
            return item.second_monthly_target.actual.approve
          }
        }
        return 'Chưa có'
      }
      case 3: {
        if (item.third_monthly_target) {
          if (item.third_monthly_target.hasOwnProperty('actual')) {
            if (item.third_monthly_target.actual) {
              return item.third_monthly_target.actual.approve
            }
          }
        }
        return 'Chưa có'
      }
      case 4: {
        if (item.fourth_monthly_target) {
          if (item.fourth_monthly_target.hasOwnProperty('actual')) {
            return item.fourth_monthly_target.actual.approve
          }
        }
        return 'Chưa có'
      }
      case 5: {
        if (item.fifth_monthly_target) {
          if (item.fifth_monthly_target.hasOwnProperty('actual')) {
            return item.fifth_monthly_target.actual.approve
          }
        }
        return 'Chưa có'
      }
      case 6: {
        if (item.sixth_monthly_target) {
          if (item.sixth_monthly_target.hasOwnProperty('actual')) {
            return item.sixth_monthly_target.actual.approve
          }
        }
        return 'Chưa có'
      }
      case 7: {
        if (item.seventh_monthly_target) {
          if (item.seventh_monthly_target.hasOwnProperty('actual')) {
            return item.seventh_monthly_target.actual.approve
          }
        }
        return 'Chưa có'
      }
      case 8: {
        if (item.eighth_monthly_target) {
          if (item.eighth_monthly_target.hasOwnProperty('actual')) {
            return item.eighth_monthly_target.actual.approve
          }
        }
        return 'Chưa có'
      }
      case 9: {
        if (item.ninth_monthly_target) {
          if (item.ninth_monthly_target.hasOwnProperty('actual')) {
            return item.ninth_monthly_target.actual.approve
          }
        }
        return 'Chưa có'
      }
      case 10: {
        if (item.tenth_monthly_target) {
          if (item.tenth_monthly_target.hasOwnProperty('actual')) {
            return item.tenth_monthly_target.actual.approve
          }
        }
        return 'Chưa có'
      }
      case 11: {
        if (item.eleventh_monthly_target) {
          if (item.eleventh_monthly_target.hasOwnProperty('actual')) {
            return item.eleventh_monthly_target.actual.approve
          }
        }
        return 'Chưa có'
      }
      case 12: {
        if (item.twelfth_monthly_target) {
          if (item.twelfth_monthly_target.hasOwnProperty('actual')) {
            return item.twelfth_monthly_target.actual.approve
          }
        }
        return 'Chưa có'
      }
      default:
        return 'Chưa có'
    }
  }

  const handleMonthActualNote = (item) => {
    //console.log(item)
    switch (selectedMonth) {
      case 1: {
        if (item.first_monthly_target) {
          if (item.first_monthly_target.hasOwnProperty('actual')) {
            return item.first_monthly_target.actual.note
          }
        }
        return ''
      }
      case 2: {
        if (item.second_monthly_target) {
          if (item.second_monthly_target.hasOwnProperty('actual')) {
            return item.second_monthly_target.actual.note
          }
        }
        return ''
      }
      case 3: {
        if (item.third_monthly_target) {
          if (item.third_monthly_target.hasOwnProperty('actual')) {
            if (item.third_monthly_target.actual) {
              return item.third_monthly_target.actual.note
            }
          }
        }
        return ''
      }
      case 4: {
        if (item.fourth_monthly_target) {
          if (item.fourth_monthly_target.hasOwnProperty('actual')) {
            return item.fourth_monthly_target.actual.note
          }
        }
        return ''
      }
      case 5: {
        if (item.fifth_monthly_target) {
          if (item.fifth_monthly_target.hasOwnProperty('actual')) {
            return item.fifth_monthly_target.actual.note
          }
        }
        return ''
      }
      case 6: {
        if (item.sixth_monthly_target) {
          if (item.sixth_monthly_target.hasOwnProperty('actual')) {
            return item.sixth_monthly_target.actual.note
          }
        }
        return ''
      }
      case 7: {
        if (item.seventh_monthly_target) {
          if (item.seventh_monthly_target.hasOwnProperty('actual')) {
            return item.seventh_monthly_target.actual.note
          }
        }
        return ''
      }
      case 8: {
        if (item.eighth_monthly_target) {
          if (item.eighth_monthly_target.hasOwnProperty('actual')) {
            return item.eighth_monthly_target.actual.note
          }
        }
        return ''
      }
      case 9: {
        if (item.ninth_monthly_target) {
          if (item.ninth_monthly_target.hasOwnProperty('actual')) {
            return item.ninth_monthly_target.actual.note
          }
        }
        return ''
      }
      case 10: {
        if (item.tenth_monthly_target) {
          if (item.tenth_monthly_target.hasOwnProperty('actual')) {
            return item.tenth_monthly_target.actual.note
          }
        }
        return ''
      }
      case 11: {
        if (item.eleventh_monthly_target) {
          if (item.eleventh_monthly_target.hasOwnProperty('actual')) {
            return item.eleventh_monthly_target.actual.note
          }
        }
        return ''
      }
      case 12: {
        if (item.twelfth_monthly_target) {
          if (item.twelfth_monthly_target.hasOwnProperty('actual')) {
            return item.twelfth_monthly_target.actual.note
          }
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
      month: selectedMonth,
      value: handleMonthActualValue(item),
      note: handleMonthActualNote(item),
    },
    validateOnBlur: true,
    onSubmit: (values, { resetForm }) => {
      //console.log(values)
      api
        .put('plans/enter-data-monthly-target/employee', {
          plan_id: values.plan_id,
          kpi_template_id: values.kpi_template_id,
          month: values.month,
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
            defaultValue={formatNumber(handleMonthActualValue(item))}
            valid={handleMonthActualStatus(item) === 'Chấp nhận'}
            invalid={handleMonthActualStatus(item) === 'Từ chối'}
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
                  defaultValue={handleMonthActualNote(item)}
                  style={{ width: '100%' }}
                  {...formik.getFieldProps('note')}
                />
              </div>
            </CModalBody>
            <CModalFooter></CModalFooter>
          </CModal>
          {/* <NoteDataMonthly
            plan={plan}
            item={item}
            selectedMonth={selectedMonth}
            value={formik.values.value}
          /> */}
          <IconButton
            variant="contained"
            color="primary"
            onClick={formik.submitForm}
            disabled={formik.isSubmitting}
            size="small"
          >
            <SaveIcon fontSize="small" />
          </IconButton>
        </CInputGroup>
      </CForm>
    </>
  )
}

EnterDateMonthlyTarget.propTypes = {
  plan: PropTypes.object,
  item: PropTypes.object,
  selectedMonth: PropTypes.number,
  // note: PropTypes.string,
}

// EnterDateMonthlyTarget.defaultProps = {
//   note: '',
// }

export default EnterDateMonthlyTarget
