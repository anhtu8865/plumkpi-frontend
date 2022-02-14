import React, { useState } from 'react'
import { CCard, CCardBody, CCol, CContainer, CRow } from '@coreui/react'
import { Tabs, Tab, Box } from '@mui/material'
import { TabPanel, a11yProps } from 'src/components/TabPanel'
import { LoadingCircle } from 'src/components/LoadingCircle'
import { KpiAdminTable } from './KpiAdminTable'
import { AddKpiButton } from './AddKpiButton'
import api from 'src/views/axiosConfig'
import { useDispatch, useSelector } from 'react-redux'
import SystemAlert from 'src/components/SystemAlert'
import { createAlert } from 'src/slices/alertSlice'
import { setCategoryLoading, setCategoryList } from 'src/slices/kpiCategorySlice'
import { AddCategoryButton } from './AddCategoryButton'
import { EditCategoryButton } from './EditCategoryButton'
import { DeleteCategoryButton } from './DeleteCategoryButton'

const KpiAdmin = () => {
  const [value, setValue] = React.useState(0)
  const [kpiTemList, setKpiTemList] = React.useState([])

  const dispatch = useDispatch()
  const { categoryReload, categoryLoading, categoryList } = useSelector(
    (state) => state.kpiCategory,
  )

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  React.useEffect(() => {
    api
      .get('/kpi-categories')
      .then((response) => {
        dispatch(setCategoryList({ value: response.data.items }))
      })
      .catch((error) => {
        dispatch(
          createAlert({
            message: error.response.data.message,
            type: 'error',
          }),
        )
      })
    api
      .get('/kpi-templates')
      .then((response) => {
        setKpiTemList(response.data.items)
      })
      .catch((error) => {
        dispatch(
          createAlert({
            message: error.response.data.message,
            type: 'error',
          }),
        )
      })
    dispatch(
      setCategoryLoading({
        value: false,
      }),
    )
  }, [categoryReload, dispatch])

  const ViewTabs = () => {
    let copyCategoryList = [...categoryList]
    return (
      <Box sx={{ width: '100%' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          {copyCategoryList
            .sort((a, b) => a.kpi_category_id - b.kpi_category_id)
            .map((catItem, index) => (
              <Tab
                key={catItem.kpi_category_id}
                label={catItem.kpi_category_name}
                {...a11yProps(index)}
              />
            ))}
        </Tabs>
        {categoryList.map((catItem, index) => {
          return (
            <TabPanel key={catItem.kpi_category_id} value={value} index={index}>
              <CRow>
                <CCol xs>
                  <div className="d-flex align-items-center flex-row mb-2">
                    <h5 className="me-3">{catItem.kpi_category_name}</h5>
                    <div className="mb-2">
                      <EditCategoryButton inCat={catItem} />
                    </div>
                    <div className="mb-2">
                      <DeleteCategoryButton inCat={catItem} />
                    </div>
                  </div>
                </CCol>
                <CCol xs>
                  <div className="text-end">
                    <AddKpiButton inCat={catItem} />
                  </div>
                </CCol>
              </CRow>
              <KpiAdminTable inCat={catItem} temList={kpiTemList} />
            </TabPanel>
          )
        })}
      </Box>
    )
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-col">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol xs={12}>
            <CCard>
              <CCardBody className="p-4">
                <CRow>
                  <CCol xs={6}>
                    <h4>Quản lý KPI mẫu</h4>
                  </CCol>
                  <CCol xs={6}>
                    <div className="d-grid gap-3 d-md-flex justify-content-end">
                      <AddCategoryButton />
                    </div>
                  </CCol>
                </CRow>
                <div className="mt-3">
                  <ViewTabs />
                </div>
                {categoryLoading && <LoadingCircle />}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
      <SystemAlert />
    </div>
  )
}

export default KpiAdmin
