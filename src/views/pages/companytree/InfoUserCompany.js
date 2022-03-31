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
            <CCol xs={12}>
              <b>ID:</b> {userItem.user_id}
            </CCol>
          </CRow>
          <CRow>
            <CCol xs={12}>
              <b>Họ và tên:</b> {userItem.user_name}
            </CCol>
          </CRow>
          <CRow>
            <CCol xs={12}>
              <b>Email:</b> {userItem.email}
            </CCol>
          </CRow>
          <CRow>
            <CCol xs={12}>
              <b>Chức vụ:</b> {userItem.role}
            </CCol>
          </CRow>
          <CRow>
            <CCol xs={12}>
              <b>Phone:</b> {userItem.phone}
            </CCol>
          </CRow>
          <CRow>
            <CCol xs={12}>
              <b>Giới tính:</b> {userItem.gender}
            </CCol>
          </CRow>
          <CRow>
            <CCol xs={12}>
              <b>Địa chỉ:</b> {userItem.address}
            </CCol>
          </CRow>

          <CRow>
            <CCol xs={12}>
              <b>Phòng ban:</b> {userItem.dept ? userItem.dept.dept_name : null}
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
