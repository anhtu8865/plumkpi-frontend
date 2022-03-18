import React, { useState } from 'react'
import {
  CCol,
  CFormLabel,
  CFormInput,
  CRow,
  CModal,
  CModalBody,
  CModalTitle,
  CModalHeader,
} from '@coreui/react'
import PropTypes from 'prop-types'
import { IconButton } from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'
import api from 'src/views/axiosConfig'

const InfoUserCompany = (props) => {
  const { userItem } = props
  const [modalVisible, setModalVisible] = useState(false)

  return (
    <>
      <IconButton
        color="primary"
        onClick={() => {
          setModalVisible(true)
        }}
      >
        <InfoIcon />
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
          <CModalTitle>Thông tin người dùng</CModalTitle>
        </CModalHeader>
        <CModalBody className="mx-4 mb-3">
          <CRow>
            <CCol>
              <CFormLabel htmlFor="kpiname">Họ tên</CFormLabel>
              <CFormInput defaultValue={userItem.user_name} disabled />
            </CCol>
            <CCol>
              <CFormLabel htmlFor="kpiname">Email</CFormLabel>
              <CFormInput defaultValue={userItem.email} disabled />
            </CCol>
          </CRow>
          <CRow>
            <CCol>
              <CFormLabel htmlFor="kpiname">Ngày sinh</CFormLabel>
              <CFormInput defaultValue={userItem.dob} disabled />
            </CCol>
          </CRow>
          <CRow>
            <CCol>
              <CFormLabel htmlFor="kpiname">Giới tính</CFormLabel>
              <CFormInput defaultValue={userItem.gender} disabled />
            </CCol>
            <CCol>
              <CFormLabel htmlFor="kpiname">Số điện thoại</CFormLabel>
              <CFormInput defaultValue={userItem.phone} disabled />
            </CCol>
          </CRow>
          <CRow>
            <CCol>
              <CFormLabel htmlFor="kpiname">Địa chỉ</CFormLabel>
              <CFormInput defaultValue={userItem.address} disabled />
            </CCol>
          </CRow>
          <CRow>
            <CCol>
              <CFormLabel htmlFor="kpiname">Phòng ban</CFormLabel>
              <CFormInput
                defaultValue={userItem.dept != null ? userItem.dept.dept_name : null}
                disabled
              />
            </CCol>
            <CCol>
              <CFormLabel htmlFor="kpiname">Chức vụ</CFormLabel>
              <CFormInput defaultValue={userItem.role} disabled />
            </CCol>
          </CRow>
        </CModalBody>
      </CModal>
    </>
  )
}

InfoUserCompany.propTypes = {
  userItem: PropTypes.object,
}

InfoUserCompany.defaultProps = {
  userItem: {},
}

export default InfoUserCompany
