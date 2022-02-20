import React, { useState } from 'react'
import {
  CCol,
  CFormLabel,
  CFormInput,
  CRow,
  CModal,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CModalHeader,
  CFormFeedback,
  CAccordion,
  CAccordionBody,
  CAccordionHeader,
  CAccordionItem,
  CListGroup,
  CListGroupItem,
} from '@coreui/react'
import PropTypes from 'prop-types'
import { Button, TextField, Checkbox } from '@mui/material'
import { LoadingCircle } from 'src/components/LoadingCircle'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import CheckIcon from '@mui/icons-material/Check'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { createAlert } from 'src/slices/alertSlice'
import { setReload, setLoading } from 'src/slices/viewSlice'
import api from 'src/views/axiosConfig'

export const AddKpiToPlanButton = (props) => {
  const dispatch = useDispatch()
  const [modalVisible, setModalVisible] = useState(false)
  const [temByCat, setTemByCat] = useState([])
  const [selectedCat, setSelectedCat] = useState([])
  const [selectedTem, setSelectedTem] = useState([])
  const [isSubmit, setIsSubmit] = useState(false)

  const handleCatChange = (catItem) => {
    const kpi_templates = catItem.kpi_templates
    if (selectedCat.includes(catItem.kpi_category_id)) {
      const remove_tem = []
      setSelectedCat(selectedCat.filter((id) => id !== catItem.kpi_category_id))
      for (var i = 0; i < kpi_templates.length; i++) {
        remove_tem.push(kpi_templates[i].kpi_template_id)
      }
      setSelectedTem(selectedTem.filter((id) => !remove_tem.includes(id)))
    } else {
      const add_tem = []
      setSelectedCat([...selectedCat, catItem.kpi_category_id])
      for (var i = 0; i < kpi_templates.length; i++) {
        if (!selectedTem.includes(kpi_templates[i].kpi_template_id)) {
          add_tem.push(kpi_templates[i].kpi_template_id)
        }
      }
      setSelectedTem(selectedTem.concat(add_tem))
    }
  }

  const handleTemChange = (temItem, catItem) => {
    const kpi_templates = catItem.kpi_templates
    if (selectedTem.includes(temItem.kpi_template_id)) {
      setSelectedTem(selectedTem.filter((id) => id !== temItem.kpi_template_id))
      setSelectedCat(selectedCat.filter((id) => id !== temItem.kpi_category.kpi_category_id))
    } else {
      const tem_id = []
      for (var i = 0; i < kpi_templates.length; i++) {
        tem_id.push(kpi_templates[i].kpi_template_id)
      }
      const compare = selectedTem.filter((id) => tem_id.includes(id))
      if (compare.length === tem_id.length - 1) {
        setSelectedCat([...selectedCat, temItem.kpi_category.kpi_category_id])
      }
      setSelectedTem([...selectedTem, temItem.kpi_template_id])
    }
  }

  const onSubmit = async () => {
    const objectToReturn = []
    for (var i = 0; i < temByCat.length; i++) {
      const selectedTemByCat = temByCat[i].kpi_templates.filter((item) =>
        selectedTem.includes(item.kpi_template_id),
      )
      if (selectedTemByCat.length !== 0) {
        const tem = []
        selectedTemByCat.map((item, index) => {
          if (index !== selectedTemByCat.length - 1) {
            tem.push({
              kpi_template_id: item.kpi_template_id,
              weight: Math.floor(100 / selectedTemByCat.length),
            })
          } else {
            tem.push({
              kpi_template_id: item.kpi_template_id,
              weight:
                100 - (selectedTemByCat.length - 1) * Math.floor(100 / selectedTemByCat.length),
            })
          }
        })
        objectToReturn.push({
          kpi_category_id: temByCat[i].kpi_category_id,
          kpi_templates: tem,
        })
      }
    }
    objectToReturn.map((item, index) => {
      if (index !== objectToReturn.length - 1) {
        item.weight = Math.floor(100 / objectToReturn.length)
      } else {
        item.weight = 100 - (objectToReturn.length - 1) * Math.floor(100 / objectToReturn.length)
      }
    })
    await addToPlan(objectToReturn)
    setIsSubmit(false)
    window.location.reload()
  }

  const addToPlan = async (objectToReturn) => {
    try {
      const response = await api.post(`/plans/add-kpi-categories`, {
        plan_id: Number(props.planId),
        kpi_categories: objectToReturn,
      })
      dispatch(
        createAlert({
          message: 'Thêm KPI vào kế hoạch thành công',
          type: 'success',
        }),
      )
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

  const getCategory = async () => {
    try {
      const response = await api.get(`/kpi-categories`)
      return response.data.items
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

  const getTemplate = async (id) => {
    try {
      const response = await api.get(`/kpi-categories/${id}`)
      return response.data.kpi_templates
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

  React.useEffect(async () => {
    const categories = await getCategory()
    for (var i = 0; i < categories.length; i++) {
      const templates = await getTemplate(categories[i].kpi_category_id)
      Object.assign(categories[i], { kpi_templates: templates })
    }
    setTemByCat(categories)
  }, [dispatch])

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setModalVisible(true)}
        startIcon={<AddCircleIcon />}
      >
        Thêm KPI
      </Button>

      <CModal
        alignment="center"
        scrollable
        size="lg"
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <CModalHeader>
          <CModalTitle>Thêm KPI vào kế hoạch</CModalTitle>
        </CModalHeader>
        <CModalBody className="mx-4 mb-3">
          <CAccordion>
            {temByCat.map((catItem, index) => (
              <CAccordionItem key={index} itemKey={index}>
                <CAccordionHeader className="d-flex justify-content-center">
                  <div>
                    <Checkbox
                      size="small"
                      checked={selectedCat.includes(catItem.kpi_category_id)}
                      onChange={() => {
                        handleCatChange(catItem)
                      }}
                    />{' '}
                    {catItem.kpi_category_name}
                  </div>
                </CAccordionHeader>
                <CAccordionBody>
                  <CListGroup>
                    {catItem.kpi_templates.map((temItem, index) => (
                      <CListGroupItem key={index} className="d-flex">
                        <div>
                          <Checkbox
                            size="small"
                            checked={selectedTem.includes(temItem.kpi_template_id)}
                            onChange={() => {
                              handleTemChange(temItem, catItem)
                            }}
                          />{' '}
                          {temItem.kpi_template_name}
                        </div>
                      </CListGroupItem>
                    ))}
                  </CListGroup>
                </CAccordionBody>
              </CAccordionItem>
            ))}
          </CAccordion>
        </CModalBody>
        <CModalFooter>
          <Button
            variant="contained"
            color="success"
            startIcon={<CheckIcon />}
            type="submit"
            onClick={() => {
              setIsSubmit(true)
              onSubmit()
            }}
            disabled={selectedTem.length === 0 || isSubmit}
          >
            Thêm KPI
          </Button>
          {isSubmit && <LoadingCircle />}
        </CModalFooter>
      </CModal>
    </>
  )
}

AddKpiToPlanButton.propTypes = {
  planId: PropTypes.number,
}
