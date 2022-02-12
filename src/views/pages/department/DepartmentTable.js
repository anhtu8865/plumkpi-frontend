import React, { Component } from 'react'
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { IconButton } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'

import PropTypes from 'prop-types'

import api from 'src/views/axiosConfig'
import axios from 'axios'

const rows = []

const DeptTable = (props) => {
  return (
    <>
      <CTable align="middle" className="mb-0 border table-bordered" hover responsive striped>
        <CTableHead color="light">
          <CTableRow>
            <CTableHeaderCell>ID</CTableHeaderCell>
            <CTableHeaderCell>PHÒNG BAN</CTableHeaderCell>
            <CTableHeaderCell>MÔ TẢ</CTableHeaderCell>
            <CTableHeaderCell />
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {props.temList.map((row) => (
            <CTableRow v-for="item in tableItems" key={row.dept_name}>
              <CTableDataCell>{row.dept_id}</CTableDataCell>
              <CTableDataCell>{row.dept_name}</CTableDataCell>
              <CTableDataCell>{row.description}</CTableDataCell>
              <CTableDataCell className="text-center">
                <IconButton id="edit" color="primary">
                  <EditIcon />
                </IconButton>
                <IconButton id="delete" color="error">
                  <DeleteForeverIcon />
                </IconButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </>
  )
}

DeptTable.propTypes = {
  temList: PropTypes.array,
}

export default DeptTable
