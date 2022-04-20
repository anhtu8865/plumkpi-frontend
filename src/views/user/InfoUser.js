import { CCol, CModal, CModalBody, CModalHeader, CModalTitle, CRow } from '@coreui/react'
import InfoIcon from '@mui/icons-material/Info'
import { IconButton, Tooltip } from '@mui/material'
import PropTypes from 'prop-types'
import React, { useState } from 'react'

const InfoUser = (props) => {
  const { userItem } = props
  const [modalVisible, setModalVisible] = useState(false)

  return (
    <>
      <Tooltip title="Thông tin người dùng">
        <IconButton
          color="primary"
          onClick={() => {
            setModalVisible(true)
          }}
          size="small"
        >
          <InfoIcon fontSize="small" />
        </IconButton>
      </Tooltip>

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

InfoUser.propTypes = {
  userItem: PropTypes.object,
}

InfoUser.defaultProps = {
  userItem: {},
}

export default InfoUser
