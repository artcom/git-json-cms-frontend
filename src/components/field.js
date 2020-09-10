import React from "react"

import Card from "react-bootstrap/Card"
import ListGroup from "react-bootstrap/ListGroup"
import FieldHeader from "./fieldHeader"

import { getLanguageName } from "../utils/language"

import { uploadFile } from "../actions/upload"
import { changeValue } from "../actions/value"

import editors from "./editors"

export default function Field(props) {
  const style = fieldStyle(props.field)

  return (
    <Card border={ style } className="mb-3">
      <Card.Header className={ style ? `list-group-item-${style}` : "" }>
        <FieldHeader { ...props } />
      </Card.Header>
      { renderContent(props) }
    </Card>
  )
}

function renderContent({ assetServer, dispatch, field, languages }) {
  const Editor = editors[field.type]

  if (!Editor) {
    return <span>Unknown field type <code>{ field.type }</code></span>
  }

  return field.isLocalized
    ? renderLocalizedEditors(field, languages, assetServer, dispatch, Editor)
    : renderEditor(field, assetServer, dispatch, Editor)
}

function renderLocalizedEditors(field, languages, assetServer, dispatch, Editor) {
  const items = Object.keys(field.value).map(languageId => {
    const languageField = { ...field,
      path: [...field.path, languageId],
      value: field.value[languageId]
    }

    return (
      <ListGroup.Item key={ languageId } style={ { padding: "0px" } }>
        <Card.Header className="text-muted"
          style={ { paddingTop: "0.3rem", paddingBottom: "0.3rem" } }>
          { getLanguageName(languageId, languages) }
        </Card.Header>

        { renderEditor(languageField, assetServer, dispatch, Editor) }
      </ListGroup.Item>
    )
  })

  return <ListGroup variant="flush">{ items }</ListGroup>
}

function renderEditor(field, assetServer, dispatch, Editor) {
  return (
    <Editor
      field={ field }
      onChange={ event => dispatch(changeValue(field.path, event.target.value)) }
      onFileSelect={ files => dispatch(uploadFile(field.path, files[0], assetServer)) } />
  )
}

function fieldStyle({ hasChanged, isNew, type }) {
  if (isNew) {
    return "success"
  }

  if (!editors[type]) {
    return "danger"
  }

  if (hasChanged) {
    return "warning"
  }
}
