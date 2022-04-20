import React from 'react'
import { CCard, CCardBody, CCol, CContainer, CRow, CCardTitle } from '@coreui/react'
import { Pagination, IconButton } from '@mui/material'
import { LoadingCircle } from 'src/components/LoadingCircle'
import api from 'src/views/axiosConfig'
import { useDispatch, useSelector } from 'react-redux'
import SystemAlert from 'src/components/SystemAlert'
import { createAlert } from 'src/slices/alertSlice'
import { setLoading } from 'src/slices/viewSlice'
import { AddCategoryButton } from './AddCategoryButton'
import { EditCategoryButton } from './EditCategoryButton'
import { DeleteCategoryButton } from './DeleteCategoryButton'
import { useHistory } from 'react-router-dom'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'

const KpiAdmin = () => {
  const entryPerPage = 6
  const [page, setPage] = React.useState(1)
  const [totalPage, setTotalPage] = React.useState(1)
  const [entry, setEntry] = React.useState([])
  const history = useHistory()
  const { user } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const { reload, loading } = useSelector((state) => state.view)

  React.useEffect(() => {
    api
      .get('/kpi-categories', {
        params: { offset: (page - 1) * entryPerPage, limit: entryPerPage },
      })
      .then((response) => {
        setTotalPage(Math.ceil(response.data.count / entryPerPage))
        setEntry(response.data.items)
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
      setLoading({
        value: false,
      }),
    )
  }, [reload, page, dispatch])

  const ViewTabs = () => {
    return (
      <>
        <CRow>
          {entry.map((catItem, index) => (
            <CCol xs={12} sm={6} lg={4} key={index} className="mb-4">
              <CCard className="text-center shadow-sm">
                <CCardBody>
                  {user.role === 'Admin' && (
                    <CRow>
                      <div className="d-flex flex-row justify-content-end">
                        <EditCategoryButton inCat={catItem} />
                        <DeleteCategoryButton inCat={catItem} />
                      </div>
                    </CRow>
                  )}
                  <CCardTitle>
                    <h4>{catItem.kpi_category_name}</h4>
                  </CCardTitle>
                  <CRow className="mb-2">
                    <small>{catItem.description ? catItem.description : null}</small>
                  </CRow>
                  <CRow className="mb-2">
                    <div className="d-flex flex-row justify-content-center">
                      <IconButton
                        color="primary"
                        onClick={() => {
                          history.push(`kpitemplate/${catItem.kpi_category_id}`)
                        }}
                        size="small"
                      >
                        <KeyboardDoubleArrowRightIcon fontSize="small" />
                      </IconButton>
                    </div>
                  </CRow>
                </CCardBody>
              </CCard>
            </CCol>
          ))}
        </CRow>
        <div className="d-flex flex-row justify-content-center">
          <Pagination
            page={page}
            count={totalPage}
            showFirstButton
            showLastButton
            size="small"
            onChange={(event, page) => setPage(page)}
          />
        </div>
      </>
    )
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-col">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol xs={12}>
            <CCard>
              <CCardBody className="p-5">
                <CRow>
                  <CCol xs={12} sm={6}>
                    <h3>
                      <b>Danh mục KPI mẫu</b>
                    </h3>
                  </CCol>
                  {user.role === 'Admin' && (
                    <CCol xs={12} sm={6}>
                      <div className="d-grid gap-3 d-md-flex justify-content-end">
                        <AddCategoryButton />
                      </div>
                    </CCol>
                  )}
                </CRow>
                <CRow className="mt-5">
                  <ViewTabs />
                </CRow>
                {loading && <LoadingCircle />}
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
