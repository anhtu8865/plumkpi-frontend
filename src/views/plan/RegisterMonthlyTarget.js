import { CForm, CFormInput, CInputGroup } from '@coreui/react'
import { IconButton } from '@mui/material'
import PropTypes from 'prop-types'
import SaveIcon from '@mui/icons-material/Save'
import React from 'react'
import { useDispatch } from 'react-redux'
import { createAlert } from 'src/slices/alertSlice'
import NumberFormat from 'react-number-format'
import api from 'src/views/axiosConfig'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { setReload, setLoading } from 'src/slices/viewSlice'

const RegisterMonthlyTarget = (props) => {
  //console.log(props)
  const { plan, item, selectedMonth } = props
  const dispatch = useDispatch()

  const handleMonthTargetValue = (item) => {
    //console.log(item)
    switch (selectedMonth) {
      case 1: {
        if (item.first_monthly_target) {
          return item.first_monthly_target.target
        }
        return ''
      }
      case 2: {
        if (item.second_monthly_target) {
          return item.second_monthly_target.target
        }
        return ''
      }
      case 3: {
        if (item.third_monthly_target) {
          return item.third_monthly_target.target
        }
        return ''
      }
      case 4: {
        if (item.fourth_monthly_target) {
          return item.fourth_monthly_target.target
        }
        return ''
      }
      case 5: {
        if (item.fifth_monthly_target) {
          return item.fifth_monthly_target.target
        }
        return ''
      }
      case 6: {
        if (item.sixth_monthly_target) {
          return item.sixth_monthly_target.target
        }
        return ''
      }
      case 7: {
        if (item.seventh_monthly_target) {
          return item.seventh_monthly_target.target
        }
        return ''
      }
      case 8: {
        if (item.eighth_monthly_target) {
          return item.eighth_monthly_target.target
        }
        return ''
      }
      case 9: {
        if (item.ninth_monthly_target) {
          return item.ninth_monthly_target.target
        }
        return ''
      }
      case 10: {
        if (item.tenth_monthly_target) {
          return item.tenth_monthly_target.target
        }
        return ''
      }
      case 11: {
        if (item.eleventh_monthly_target) {
          return item.eleventh_monthly_target.target
        }
        return ''
      }
      case 12: {
        if (item.twelfth_monthly_target) {
          return item.twelfth_monthly_target.target
        }
        return ''
      }
      default:
        return ''
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
      target: handleMonthTargetValue(item),
    },
    validateOnBlur: true,
    onSubmit: (values, { resetForm }) => {
      //console.log(values)
      const target = values.target === '' || values.target === null ? null : Number(values.target)
      api
        .put('plans/register-monthly-target/employee', {
          plan_id: values.plan_id,
          kpi_template_id: values.kpi_template_id,
          month: values.month,
          target: target,
        })
        .then(() => {
          dispatch(
            createAlert({
              message: 'Cập nhật thành công.',
              type: 'success',
            }),
          )
          dispatch(
            setLoading({
              value: true,
            }),
          )
          dispatch(setReload())
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
          {/*CFormInput
            type="number"
            defaultValue={handleMonthTargetValue(item)}
            placeholder="Chưa có"
            valid={handleMonthTargetStatus(item) === 'Chấp nhận'}
            invalid={handleMonthTargetStatus(item) === 'Từ chối'}
            disabled={handleMonthTargetStatus(item) === 'Chấp nhận' ? true : false}
            {...formik.getFieldProps('target')}
  />*/}
          <NumberFormat
            id="target"
            customInput={CFormInput}
            thousandSeparator="."
            decimalSeparator=","
            placeholder="Chưa có"
            allowNegative={false}
            value={formik.values.target}
            onBlur={formik.handleBlur}
            valid={handleMonthTargetStatus(item) === 'Chấp nhận'}
            invalid={handleMonthTargetStatus(item) === 'Từ chối'}
            disabled={handleMonthTargetStatus(item) === 'Chấp nhận' ? true : false}
            onValueChange={(values) => {
              formik.setFieldValue('target', values.value)
            }}
          />
          <IconButton
            variant="contained"
            color="primary"
            onClick={formik.submitForm}
            //disabled={formik.isSubmitting}
            size="small"
            disabled={handleMonthTargetStatus(item) === 'Chấp nhận' ? true : false}
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
