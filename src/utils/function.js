//chứa những hàm để xử lý dữ liệu

import { formulaOperators, checkValidError } from 'src/utils/constant'
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
