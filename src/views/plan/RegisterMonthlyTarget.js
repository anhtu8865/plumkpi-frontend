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
import { Button, IconButton } from '@mui/material'
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

const RegisterMonthlyTarget = (props) => {
  //console.log(props)
  const { plan, item, selectedMonth } = props
  const dispatch = useDispatch()

  const [isSubmit, setIsSubmit] = React.useState(false)

  const handleMonthTargetValue = (item) => {
    console.log(item)
    switch (selectedMonth) {
      case 1: {
        if (item.first_monthly_target) {
          return item.first_monthly_target.target
        }
        return 'Chưa có'
      }
      case 2: {
        if (item.second_monthly_target) {
          return item.second_monthly_target.target
        }
        return 'Chưa có'
      }
      case 3: {
        if (item.third_monthly_target) {
          return item.third_monthly_target.target
        }
        return 'Chưa có'
      }
      case 4: {
        if (item.fourth_monthly_target) {
          return item.fourth_monthly_target.target
        }
        return 'Chưa có'
      }
      case 5: {
        if (item.fifth_monthly_target) {
          return item.fifth_monthly_target.target
        }
        return 'Chưa có'
      }
      case 6: {
        if (item.sixth_monthly_target) {
          return item.sixth_monthly_target.target
        }
        return 'Chưa có'
      }
      case 7: {
        if (item.seventh_monthly_target) {
          return item.seventh_monthly_target.target
        }
        return 'Chưa có'
      }
      case 8: {
        if (item.eighth_monthly_target) {
          return item.eighth_monthly_target.target
        }
        return 'Chưa có'
      }
      case 9: {
        if (item.ninth_monthly_target) {
          return item.ninth_monthly_target.target
        }
        return 'Chưa có'
      }
      case 10: {
        if (item.tenth_monthly_target) {
          return item.tenth_monthly_target.target
        }
        return 'Chưa có'
      }
      case 11: {
        if (item.eleventh_monthly_target) {
          return item.eleventh_monthly_target.target
        }
        return 'Chưa có'
      }
      case 12: {
        if (item.twelfth_monthly_target) {
          return item.twelfth_monthly_target.target
        }
        return 'Chưa có'
      }
      default:
        return 'Chưa có'
    }
  }

  const handleMonthTargetStatus = (item) => {
    switch (selectedMonth) {
      case 1: {
        if (item.first_monthly_target) {
          return item.first_monthly_target.approve
        }
        return ''
      }
      case 2: {
        if (item.second_monthly_target) {
          return item.second_monthly_target.approve
        }
        return ''
      }
      case 3: {
        if (item.third_monthly_target) {
          return item.third_monthly_target.approve
        }
        return ''
      }
      case 4: {
        if (item.fourth_monthly_target) {
          return item.fourth_monthly_target.approve
        }
        return ''
      }
      case 5: {
        if (item.fifth_monthly_target) {
          return item.fifth_monthly_target.approve
        }
        return ''
      }
      case 6: {
        if (item.sixth_monthly_target) {
          return item.sixth_monthly_target.approve
        }
        return ''
      }
      case 7: {
        if (item.seventh_monthly_target) {
          return item.seventh_monthly_target.approve
        }
        return ''
      }
      case 8: {
        if (item.eighth_monthly_target) {
          return item.eighth_monthly_target.approve
        }
        return ''
      }
      case 9: {
        if (item.ninth_monthly_target) {
          return item.ninth_monthly_target.approve
        }
        return ''
      }
      case 10: {
        if (item.tenth_monthly_target) {
          return item.tenth_monthly_target.approve
        }
        return ''
      }
      case 11: {
        if (item.eleventh_monthly_target) {
          return item.eleventh_monthly_target.approve
        }
        return ''
      }
      case 12: {
        if (item.twelfth_monthly_target) {
          return item.twelfth_monthly_target.approve
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
      target: formatNumber(handleMonthTargetValue(item)),
    },
    validateOnBlur: true,
    onSubmit: (values, { resetForm }) => {
      //console.log(values)
      api
        .put('plans/register-monthly-target/employee', {
          plan_id: values.plan_id,
          kpi_template_id: values.kpi_template_id,
          month: values.month,
          target: values.target,
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
            defaultValue={formatNumber(handleMonthTargetValue(item))}
            valid={handleMonthTargetStatus(item) === 'Chấp nhận'}
            invalid={handleMonthTargetStatus(item) === 'Từ chối'}
            {...formik.getFieldProps('target')}
          />
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

RegisterMonthlyTarget.propTypes = {
  plan: PropTypes.object,
  item: PropTypes.object,
  selectedMonth: PropTypes.number,
}

RegisterMonthlyTarget.defaultProps = {}

export default RegisterMonthlyTarget
