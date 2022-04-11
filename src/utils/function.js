//chứa những hàm để xử lý dữ liệu

import React from 'react'
import { formulaOperators, checkValidError, quarterArray, monthArray } from 'src/utils/constant'
import { format, parse } from 'date-fns'

export const translate = (str, engToVietList) => {
  const find = engToVietList.find((item) => item.eng == str)
  if (find) {
    return find.viet
  }
  return str
}

export const isNumeric = (str) => {
  return !isNaN(str)
}

export const mappedKpi = (str, kpiList) => {
  return kpiList.filter(
    (item) => item.kpi_template_name.normalize() === str.replaceAll('_', ' ').normalize(),
  )
}

export const checkValid = (formulaString, kpiList) => {
  const finalFormulaElements = []
  const formulaElements = formulaString.trim().split(/\s+/)

  for (var i = 0; i < formulaElements.length; i++) {
    if (formulaElements[i].length == 1) {
      if (formulaElements[i] === '.') {
        return {
          errorMessage: 'Dấu "." chỉ được sử dụng trong số thập phân, không được đứng đơn lẻ',
        }
      } else if (formulaOperators.includes(formulaElements[i]) || isNumeric(formulaElements[i])) {
        finalFormulaElements.push(formulaElements[i])
      } else {
        return {
          errorMessage: checkValidError(formulaElements[i]),
        }
      }
    } else {
      if (isNumeric(formulaElements[i])) {
        finalFormulaElements.push(formulaElements[i])
      } else if (formulaElements[i][0] == '-') {
        const mapKpi = mappedKpi(formulaElements[i].slice(1), kpiList)
        if (mapKpi.length != 0) {
          finalFormulaElements.push('KPI' + mapKpi[0].kpi_template_id)
        } else {
          return {
            errorMessage: checkValidError(formulaElements[i].slice(1).replaceAll('_', ' ')),
          }
        }
      } else {
        const mapKpi = mappedKpi(formulaElements[i], kpiList)
        if (mapKpi.length != 0) {
          finalFormulaElements.push('KPI' + mapKpi[0].kpi_template_id)
        } else {
          return {
            errorMessage: checkValidError(formulaElements[i].replaceAll('_', ' ')),
          }
        }
      }
    }
  }
  return { formulaArray: finalFormulaElements }
}

export const checkFormulaLogic = (formulaArray) => {
  const numberOrKpi = []
  const operator = []
  let isTrue = true

  for (var i = 0; i < formulaArray.length; i++) {
    if (isNumeric(formulaArray[i]) || formulaArray[i].length > 1) {
      numberOrKpi.push(formulaArray[i])
      if (isTrue) {
        isTrue = false
      } else {
        return {
          errorMessage: 'Đảm bảo rằng giữa các số và KPI đều có phép toán (nhất là phép "*")',
        }
      }
    } else if (formulaOperators.slice(0, 4).includes(formulaArray[i])) {
      operator.push(formulaArray[i])
      isTrue = true
    } else {
      if (formulaArray[i] == '(') {
        operator.push(formulaArray[i])
      } else {
        let flag = true
        while (operator.length != 0) {
          let c = operator.pop()
          if (c == '(') {
            flag = false
            break
          } else {
            if (numberOrKpi.length < 2) {
              return {
                errorMessage: 'Đảm bảo rằng có đủ hai toán hạng trong các phép toán +, -, *, /',
              }
            } else {
              numberOrKpi.pop()
            }
          }
        }
        if (flag) {
          return {
            errorMessage: 'Đảm bảo thứ tự cũng như sự thừa hoặc thiếu của các dấu ngoặc',
          }
        }
      }
    }
  }
  while (operator.length != 0) {
    let c = operator.pop()
    if (!formulaOperators.slice(0, 4).includes(c)) {
      return {
        errorMessage: 'Đảm bảo thứ tự cũng như sự thừa hoặc thiếu của các dấu ngoặc',
      }
    }
    if (numberOrKpi.length < 2) {
      return {
        errorMessage: 'Đảm bảo rằng có đủ hai toán hạng trong các phép toán +, -, *, /',
      }
    } else {
      numberOrKpi.pop()
    }
  }
  if (numberOrKpi.length > 1 || operator.length != 0) {
    return {
      errorMessage: 'Trong công thức đang dư thừa phép toán, dấu ngoặc, số hoặc KPI',
    }
  }
  return true
}

export const findKpi = (str, kpiList) => {
  const find = kpiList.find((item) => item.kpi_template_id === Number(str))
  if (find) {
    return find.kpi_template_name.replaceAll(' ', '_')
  } else {
    return ''
  }
}

export const convertFormula = (str, kpiList) => {
  if (!str) {
    return ''
  }
  let finalString = ''
  const formulaArray = str.trim().split(' ')
  formulaArray.map((element) => {
    if (isNumeric(element) || formulaOperators.includes(element)) {
      finalString = finalString + element + ' '
    } else if (element[0] == '-') {
      finalString = finalString + findKpi(Number(element.slice(4)), kpiList) + ' '
    } else {
      finalString = finalString + findKpi(Number(element.slice(3)), kpiList) + ' '
    }
  })
  return finalString.trim()
}

export const checkOverlap = (start1, end1, start2, end2) => {
  if (start1 <= end2 && end1 >= start2) {
    return true
  }
  return false
}

export const checkTimeRange = (start, end, planList) => {
  const result = sortPlanList(planList)
  const sortList = result.oldPlan.concat(result.currentPlan.concat(result.futurePlan))
  for (var i = 0; i < sortList.length; i++) {
    const check = checkOverlap(start, end, sortList[i].start_date, sortList[i].end_date)
    if (check) {
      return sortList[i]
    }
  }
  return {}
}

export const checkYearOverlap = (year, planList) => {
  for (var i = 0; i < planList.length; i++) {
    if (year === planList[i].year) {
      return planList[i]
    }
  }
  return {}
}

export const sortPlanList = (planList) => {
  if (planList.length === 0) {
    return { oldPlan: [], currentPlan: [], futurePlan: [] }
  }
  const today = new Date().toLocaleDateString('en-CA')
  const oldPlan = []
  const currentPlan = []
  const futurePlan = []
  planList.map((planItem) => {
    if (planItem.start_date > today) {
      futurePlan.push(planItem)
    } else if (planItem.end_date < today) {
      oldPlan.push(planItem)
    } else {
      currentPlan.push(planItem)
    }
  })
  return { oldPlan: oldPlan, currentPlan: currentPlan, futurePlan: futurePlan }
}

export const sortPlanListByYear = (planList) => {
  if (planList.length === 0) {
    return { oldPlan: [], currentPlan: [], futurePlan: [] }
  }
  const today = new Date().getFullYear()
  const oldPlan = []
  const currentPlan = []
  const futurePlan = []
  planList.map((planItem) => {
    if (planItem.year > today) {
      futurePlan.push(planItem)
    } else if (planItem.year < today) {
      oldPlan.push(planItem)
    } else {
      currentPlan.push(planItem)
    }
  })
  return { oldPlan: oldPlan, currentPlan: currentPlan, futurePlan: futurePlan }
}

export const calculateTimeProgress = (start, end) => {
  const today = new Date().toLocaleDateString('en-CA')
  return Math.ceil(((new Date(today) - new Date(start)) / (new Date(end) - new Date(start))) * 100)
}

export const formatDate = (str) => {
  if (str) {
    const date = parse(str, 'yyyy-MM-dd', new Date())
    const result = format(date, 'dd/MM/yyyy')
    return result
  }
  return ''
}

export const compareToToday = (end_date) => {
  const today = new Date().toLocaleDateString('en-CA')
  if (end_date < today) {
    return false
  }
  return true
}

export const compareYear = (year) => {
  const today = new Date().getFullYear
  if (year < today) {
    return false
  }
  return true
}

export const getYearsList = () => {
  const currentYear = new Date().getFullYear()
  const returnList = []
  for (var i = 0; i < 5; i++) {
    returnList.push(currentYear + i)
  }
  return returnList
}

export const formatNumber = (num) => {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}

export const convertPercent = (num) => {
  return num / 100
}

export const convertColor = (colorHex) => {
  switch (colorHex) {
    case '#b80000':
      return 'Đỏ'
    case '#fccb00':
      return 'Vàng'
    case '#008b02':
      return 'Xanh'
    default:
      return 'Tím' //kbh xảy ra
  }
}

export const reverseConvertColor = (color) => {
  switch (color) {
    case 'Đỏ':
      return '#b80000'
    case 'Vàng':
      return '#fccb00'
    case 'Xanh':
      return '#008b02'
    default:
      return '#008b02' //kbh xảy ra
  }
}

export const convertComparison = (comp) => {
  switch (comp) {
    case 'Greater than':
      return '>'
    case 'Greater than or equal':
      return '>='
    case 'Less than':
      return '<'
    case 'Less than or equal':
      return '<='
    case 'Equal to':
      return '='
    case 'Not equal to':
      return '!='
    default:
      return ''
  }
}

export const handleColor = (color) => {
  if (color.charAt(0) === '#') {
    return color
  }
  return '#673ab7' //Tím
}

export const transparentColor = (color) => {
  return color + '33'
}

export const planTooltip = (planItem) => {
  return (
    <div>
      Tên kế hoạch: {planItem.plan_name}
      <br />
      Mô tả: {planItem.description}
      <br />
      Năm thực hiện: {planItem.year}
      <br />
    </div>
  )
}

export const kpiTooltip = (kpiItem) => {
  return (
    <div>
      Tên KPI: {kpiItem.kpi_template_name}
      <br />
      Mô tả: {kpiItem.description ? kpiItem.description : 'Không có'}
      <br />
      Công thức tổng hợp: {kpiItem.aggregation}
      <br />
      Đơn vị: {kpiItem.unit}
      <br />
      Cách đo lường:
      <br />
      {kpiItem.measures.items.length > 0
        ? kpiItem.measures.items.map((item, index) => {
            return (
              <div key={index} className="d-flex flex-row">
                Kết quả {convertComparison(item.comparison)} {item.percentOfTarget}% Chỉ tiêu: Đạt
                được {item.percentOfKpi}% KPI.{' '}
                <div
                  className="ms-2"
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '2px',
                    background: `${item.color}`,
                  }}
                />
                <br />
              </div>
            )
          })
        : 'Không có'}
    </div>
  )
}

export const timeOfChart = (dateType, period, year) => {
  const yearString = `năm ${year}`
  switch (dateType) {
    case 'Năm':
      return yearString
    case 'Quý':
      if (period.length === 1) {
        return `quý ${period[0]} ` + yearString
      } else {
        return (
          `quý ${period[0]} ` + yearString + ` - quý ${period[period.length - 1]} ` + yearString
        )
      }
    case 'Tháng':
      if (period.length === 1) {
        return `tháng ${period[0]} ` + yearString
      } else {
        return (
          `tháng ${period[0]} ` + yearString + ` - tháng ${period[period.length - 1]} ` + yearString
        )
      }
    default:
      return ''
  }
}

export const currentTime = (str, planYear) => {
  try {
    const year = str.slice(0, 4)
    if (Number(planYear) < Number(year)) {
      return { quarter: 4, month: 12 }
    }
    const month = str.slice(5, 7)
    if (['01', '02', '03'].includes(month)) {
      return { quarter: 1, month: Number(month.charAt(1)) }
    } else if (['04', '05', '06'].includes(month)) {
      return { quarter: 2, month: Number(month.charAt(1)) }
    } else if (['07', '08', '09'].includes(month)) {
      return { quarter: 3, month: Number(month.charAt(1)) }
    } else if (['10', '11', '12'].includes(month)) {
      return { quarter: 4, month: Number(month) }
    } else {
      return { quarter: 4, month: 12 } //kbh xảy ra
    }
  } catch (error) {
    return { quarter: 4, month: 12 }
  }
}

export const quarterOption = (quarter) => {
  const options = []
  quarterArray.map((item) => {
    if (item > quarter) {
      options.push({ value: item, label: item, isDisabled: true })
    } else {
      options.push({ value: item, label: item })
    }
  })
  return options
}

export const monthOption = (month) => {
  const options = []
  monthArray.map((item) => {
    if (item > month) {
      options.push({ value: item, label: item, isDisabled: true })
    } else {
      options.push({ value: item, label: item })
    }
  })
  return options
}
