import {
  CCol,
  CFormFeedback,
  CFormSelect,
  CFormInput,
  CFormLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import AddBoxIcon from '@mui/icons-material/AddBox'
import { Button } from '@mui/material'
import { Field, FormikProvider, useFormik } from 'formik'
import React from 'react'
import { useDispatch } from 'react-redux'
import { LoadingCircle } from 'src/components/LoadingCircle'
import { createAlert } from 'src/slices/alertSlice'
import { setKpiRegisLoading, setKpiRegisReload } from 'src/slices/kpiRegisSlice'
import api from 'src/views/axiosConfig'
import * as yup from 'yup'
import CheckIcon from '@mui/icons-material/Check'
import PropTypes from 'prop-types'
import Select, { Option, ReactSelectProps } from 'react-select'

import { AddKpiRegisDetails } from './AddKpiRegisDetails'

const AddKpiRegistration = (props) => {
  const dispatch = useDispatch()
  const [modalVisible, setModalVisible] = React.useState(false)
  // const [modalVisible2, setModalVisible2] = React.useState(false)
  const [personalKpisList, setPersonalKpisList] = React.useState([])

  const validationSchema = yup.object({
    target: yup.number().required('Đây là trường bắt buộc'),
  })

  React.useEffect(() => {
    async function fetchPersonalKpisList() {
      api
        .get('kpi-categories/personal-kpis')
        .then((response) => {
          setPersonalKpisList(response.data.kpi_templates)
        })
        .catch((error) => {})
    }

    fetchPersonalKpisList()
  }, [])

  const formik = useFormik({
    initialValues: {
      plan: { plan_id: props.plan_id },
      kpi_template: {
        kpi_template_id: null,
      },
      target: null,
    },
    validateOnBlur: true,
    onSubmit: (values, { resetForm }) => {
      // console.log(values)
      api
        .post('plans/register-personal-kpi', {
          plan: values.plan,
          kpi_template: values.kpi_template,
          target: values.target,
        })
        .then(() => {
          dispatch(
            createAlert({
              message: 'Đăng ký KPI thành công.',
              type: 'success',
            }),
          )
          dispatch(
            setKpiRegisLoading({
              value: true,
            }),
          )
          dispatch(setKpiRegisReload())
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
          formik.setSubmitting(false)
        })
      //resetForm()
    },
    validationSchema: validationSchema,
  })

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddBoxIcon />}
        onClick={() => {
          setModalVisible(true)
        }}
      >
        Đăng kí KPI
      </Button>
      <form onSubmit={formik.handleSubmit}>
        <CModal
          alignment="center"
          scrollable
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        >
          <CModalHeader>
            <CModalTitle>Đăng ký KPI cá nhân</CModalTitle>
          </CModalHeader>
          <CModalBody>
            {/* <CCol md={12}>
              <CFormLabel htmlFor="inputEmail4">Chọn kế hoạch</CFormLabel>
              <CFormSelect id="inputState">
                <option>Choose...</option>
                <option>Plan 1</option>
              </CFormSelect>
            </CCol> */}
            <CCol md={12}>
              <CFormLabel htmlFor="inputKPI">Chọn KPI</CFormLabel>
              <CFormSelect
                CFormSelect
                as="select"
                name="kpi_template.kpi_template_id"
                {...formik.getFieldProps('kpi_template.kpi_template_id')}
                className="form-select"
                onChange={formik.handleChange}
              >
                <option value="" label="Chọn KPI" />
                {personalKpisList.map((row) => (
                  <option value={row.kpi_template_id} key={row.kpi_template_id}>
                    {row.kpi_template_name}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            {/* {setPersonalKpiID(formik.values.kpi_template.kpi_template_id)}*/}
            {formik.values.kpi_template.kpi_template_id != null ? (
              <AddKpiRegisDetails kpiItemID={formik.values.kpi_template.kpi_template_id} />
            ) : null}
            <CCol md={12}>
              <CFormLabel htmlFor="inputKPITarget">Mục tiêu</CFormLabel>
              <CFormInput
                type="number"
                name="target"
                id="inputKPITarget"
                value={formik.values.target}
                onChange={formik.handleChange}
                invalid={formik.touched.target && formik.errors.target ? true : false}
                valid={
                  !formik.touched.target || (formik.touched.target && formik.errors.target)
                    ? false
                    : true
                }
              />
            </CCol>
          </CModalBody>
          <CModalFooter>
            <Button
              variant="contained"
              color="success"
              startIcon={<AddBoxIcon />}
              type="submit"
              onClick={formik.submitForm}
              disabled={formik.isSubmitting}
            >
              Đăng ký
            </Button>
            {formik.isSubmitting && <LoadingCircle />}
          </CModalFooter>
        </CModal>
      </form>
    </>
  )
}

AddKpiRegistration.propTypes = {
  plan_id: PropTypes.string,
}

export default AddKpiRegistration
