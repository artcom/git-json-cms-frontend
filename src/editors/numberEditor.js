import get from "lodash/get"
import React from "react"
import Form from "react-bootstrap/Form"

import { isValidField } from "../utils"

export default function NumberEditor({ field, onChange }) {
  const min = get(field, "min", -Infinity)
  const max = get(field, "max", Infinity)
  const valid = isValidField(field.value, field)

  function onChangeFloat(event) {
    onChange({
      target: {
        value: parseFloat(event.target.value)
      }
    })
  }

  return (
    <>
      <Form.Control
        style={ { border: "0px", boxShadow: "none" } }
        isInvalid={ !valid }
        type="number"
        value={ field.value }
        onChange={ onChangeFloat } />

      <Form.Control.Feedback type="invalid" tooltip>
        The number should be between { min } and { max }
      </Form.Control.Feedback>
    </>
  )
}