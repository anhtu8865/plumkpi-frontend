import {
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableFoot,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CNavItem,
  CTabs,
  CNavLink,
  CNav,
  CTabContent,
  CTabPane,
  CProgressBar,
  CProgress,
  CFormSelect,
} from '@coreui/react'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import SearchIcon from '@mui/icons-material/Search'
import {
  Avatar,
  Button,
  Grid,
  Pagination,
  Box,
  Tab,
  TabPanel,
  TabContext,
  TabList,
  IconButton,
  Input,
  TextField,
} from '@mui/material'
import FilePresentIcon from '@mui/icons-material/FilePresent'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import SaveIcon from '@mui/icons-material/Save'
import { Field, FormikProvider, useFormik } from 'formik'
import PropTypes from 'prop-types'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { LoadingCircle } from 'src/components/LoadingCircle'
import SystemAlert from 'src/components/SystemAlert'
import { createAlert } from 'src/slices/alertSlice'
import { setUserLoading } from 'src/slices/userSlice'
import api from 'src/views/axiosConfig'

import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import DatePicker from '@mui/lab/DatePicker'

const Data = () => {
  const [value, setValue] = React.useState(null)
  const [saveVisible, setSaveVisible] = React.useState('none')

  const DataTable = (props) => {
    const [activeKey, setActiveKey] = React.useState(1)
    return (
      <>
        <CNav variant="tabs" role="tablist">
          <CNavItem>
            <CNavLink
              href="javascript:void(0);"
              active={activeKey === 1}
              onClick={() => setActiveKey(1)}
            >
              Ngày
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink
              href="javascript:void(0);"
              active={activeKey === 2}
              onClick={() => setActiveKey(2)}
            >
              Tuần
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink
              href="javascript:void(0);"
              active={activeKey === 3}
              onClick={() => setActiveKey(3)}
            >
              Tháng
            </CNavLink>
          </CNavItem>
        </CNav>
        <CTabContent>
          <CTabPane role="tabpanel" aria-labelledby="daily-tab" visible={activeKey === 1}>
            <CTable align="middle" className="mb-0 border table-bordered" hover responsive striped>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell>TÊN</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">16/03/2022</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">TRỌNG SỐ</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">ĐƠN VỊ</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">TIẾN ĐỘ</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">NOTE</CTableHeaderCell>
                  <CTableHeaderCell className="text-center"></CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow v-for="item in tableItems">
                  <CTableDataCell>KPI sale hàng ngày</CTableDataCell>
                  <CTableDataCell className="text-center">
                    <CRow>
                      <CCol className="align-self-center">
                        {' '}
                        <CFormInput
                          type="number"
                          defaultValue={800}
                          aria-describedby="passwordHelpInline"
                        />
                      </CCol>
                    </CRow>
                  </CTableDataCell>
                  <CTableDataCell className="text-center">80</CTableDataCell>
                  <CTableDataCell className="text-center">VND</CTableDataCell>
                  <CTableDataCell className="text-center">
                    <CProgress className="mb-3">
                      <CProgressBar value={80}>800/1000</CProgressBar>
                    </CProgress>
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    <IconButton id="edit" color="primary">
                      <FilePresentIcon />
                    </IconButton>
                  </CTableDataCell>
                  <CTableDataCell>
                    {' '}
                    <IconButton variant="contained" color="primary">
                      <SaveIcon />
                    </IconButton>
                  </CTableDataCell>
                </CTableRow>
                <CTableRow v-for="item in tableItems">
                  <CTableDataCell>KPI HR hàng ngày</CTableDataCell>
                  <CTableDataCell className="text-center">
                    <CRow>
                      <CCol className="align-self-center">
                        {' '}
                        <CFormInput
                          type="number"
                          defaultValue={800}
                          aria-describedby="passwordHelpInline"
                        />
                      </CCol>
                    </CRow>
                  </CTableDataCell>
                  <CTableDataCell className="text-center">80</CTableDataCell>
                  <CTableDataCell className="text-center">VND</CTableDataCell>
                  <CTableDataCell className="text-center">
                    <CProgress className="mb-3">
                      <CProgressBar value={80}>800/1000</CProgressBar>
                    </CProgress>
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    <IconButton id="edit" color="primary">
                      <FilePresentIcon />
                    </IconButton>
                  </CTableDataCell>
                  <CTableDataCell>
                    {' '}
                    <IconButton variant="contained" color="primary">
                      <SaveIcon />
                    </IconButton>
                  </CTableDataCell>
                </CTableRow>
              </CTableBody>
              <CTableFoot>
                <CTableRow>
                  <CTableDataCell colSpan="4"></CTableDataCell>
                </CTableRow>
              </CTableFoot>
            </CTable>
          </CTabPane>
          <CTabPane role="tabpanel" aria-labelledby="weekly-tab" visible={activeKey === 2}>
            456
          </CTabPane>
          <CTabPane role="tabpanel" aria-labelledby="monthly-tab" visible={activeKey === 3}>
            789
          </CTabPane>
        </CTabContent>
      </>
    )
  }

  DataTable.propTypes = {
    temList: PropTypes.array,
  }

  DataTable.defaultProps = {
    temList: [],
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-col">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol xs={12}>
            <CCard>
              <CCardBody className="p-4">
                <CRow>
                  <CCol xs={6}></CCol>
                  <CCol xs={6}>
                    <div className="d-grid gap-3 d-md-flex justify-content-end">
                      <CForm>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            label="Chọn ngày nhập"
                            value={value}
                            onChange={(newValue) => {
                              setValue(newValue)
                            }}
                            renderInput={(params) => <TextField {...params} />}
                          />
                        </LocalizationProvider>
                      </CForm>
                    </div>
                  </CCol>
                </CRow>
                {/*Table*/}
                <div className="mt-2 p-4">
                  <DataTable />
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

export default Data
