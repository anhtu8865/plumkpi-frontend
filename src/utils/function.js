//chứa những hàm để xử lý dữ liệu

import { formulaOperators, checkValidError } from 'src/utils/constant'

export const translate = (str, engToVietList) => {
  return engToVietList.filter((item) => item.eng == str)[0].viet
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
  return kpiList
    .filter((item) => item.kpi_template_id == str)[0]
    .kpi_template_name.replaceAll(' ', '_')
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
