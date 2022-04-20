import React from 'react'
import { CCard, CCardBody, CCol, CRow, CBadge } from '@coreui/react'
import ProgressBar from '@ramonak/react-progress-bar'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentCat } from 'src/slices/planDetailSlice'
import GaugeChart from 'react-gauge-chart'
import { EditCategoryInPlanButton } from '../categoryInPlan/EditCategoryInPlanButton'
import { convertPercent } from 'src/utils/function'

export const PlanOverview = (props) => {
  const dispatch = useDispatch()
  const { catInPlan, currentCat, performResult } = useSelector((state) => state.planDetail)
  const { user } = useSelector((state) => state.user)

  const handleCategoryResult = (resultObject, catId) => {
    if (resultObject && resultObject.kpi_categories) {
      const find = resultObject.kpi_categories.find((item) => item.kpi_category_id === catId)
      if (find) {
        return Number(find.resultOfKpiCategory)
      }
      return 0
    }
    return 0
  }

  return (
    <>
      <CCard className="shadow-sm">
        <CCardBody className="p-4">
          <CRow>
            <div className="d-flex flex-row justify-content-end">
              {user.role === 'Giám đốc' && EditCategoryInPlanButton()}
            </div>
          </CRow>
          <CRow className="mt-2">
            <CCol xs={12} sm={6} className="d-flex justify-content-center">
              <GaugeChart
                id="gauge-chart1"
                nrOfLevels={1}
                percent={
                  performResult && performResult.result
                    ? convertPercent(Number(performResult.result))
                    : 0
                }
                style={{ width: '50%' }}
                colors={['#0D6EFD']}
                textColor="#000000"
              />
            </CCol>
            <CCol xs={12} sm={6}>
              {catInPlan.map((item) => (
                <>
                  <CRow className="mt-2">
                    <div
                      onClick={() => {
                        dispatch(
                          setCurrentCat({
                            value: item,
                          }),
                        )
                      }}
                      style={{
                        cursor: 'pointer',
                        /*color:
                          item.kpi_category.kpi_category_id ===
                          currentCat.kpi_category.kpi_category_id
                            ? 'dodgerblue'
                            : 'black',*/
                      }}
                    >
                      <small>
                        {item.kpi_category.kpi_category_id ===
                        currentCat.kpi_category.kpi_category_id ? (
                          <CBadge color="danger">{item.kpi_category.kpi_category_name}</CBadge>
                        ) : (
                          item.kpi_category.kpi_category_name
                        )}
                        {'    '}
                        {item.weight ? <CBadge color="dark">{item.weight}%</CBadge> : null}
                        {/*{item.kpi_category.kpi_category_id ===
                        currentCat.kpi_category.kpi_category_id ? (
                          <CBadge color="danger">Đang chọn</CBadge>
                        ) : null}*/}
                      </small>
                    </div>
                  </CRow>
                  <CRow className="mt-1">
                    <div>
                      <ProgressBar
                        completed={handleCategoryResult(
                          performResult,
                          item.kpi_category.kpi_category_id,
                        )}
                        bgColor="#0d6efd"
                        height="10px"
                        labelSize="10px"
                        labelAlignment="center"
                        isLabelVisible={
                          handleCategoryResult(performResult, item.kpi_category.kpi_category_id) ===
                          0
                            ? false
                            : true
                        }
                      />
                      {/*<CProgress>
                        <CProgressBar
                          color="info"
                          variant="striped"
                          value={handleCategoryResult(
                            performResult,
                            item.kpi_category.kpi_category_id,
                          )}
                        >
                          {handleCategoryResult(performResult, item.kpi_category.kpi_category_id)}%
                        </CProgressBar>
                          </CProgress>*/}
                    </div>
                  </CRow>
                </>
              ))}
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </>
  )
}
