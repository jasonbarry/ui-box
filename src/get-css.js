import prefixer from './prefixer'
import valueToString from './value-to-string'
import getClassName from './get-class-name'

/**
 * Generates the class name and styles.
 */
export default function getCss(propertyInfo, value) {
  let rules

  // Protect against unexpected values
  const valueType = typeof value
  if (valueType !== 'string' && valueType !== 'number') {
    if (process.env.NODE_ENV !== 'production') {
      const name = propertyInfo.jsName
      const encodedValue = JSON.stringify(value)
      console.error(
        `ui-box: property “${name}” was passed invalid value “${encodedValue}”. Only numbers and strings are supported.`
      )
    }
    return null
  }

  const valueString = valueToString(value, propertyInfo.defaultUnit)

  const className = getClassName(propertyInfo, valueString)

  // Avoid running the prefixer when possible because it's slow
  if (propertyInfo.isPrefixed) {
    rules = prefixer(propertyInfo.jsName, valueString)
  } else {
    rules = [{property: propertyInfo.cssName, value: valueString}]
  }

  let styles
  if (process.env.NODE_ENV === 'production') {
    const rulesString = rules
      .map(rule => `${rule.property}:${rule.value}`)
      .join(';')
    styles = `.${className}{${rulesString}}`
  } else {
    const rulesString = rules
      .map(rule => `  ${rule.property}: ${rule.value};`)
      .join('\n')
    styles = `
.${className} {
${rulesString}
}`
  }

  return {className, styles}
}
