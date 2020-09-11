import React from "react"
import { render } from "react-dom"
import { Provider } from "react-redux"

import { loadData } from "./actions/data"
import { updatePath } from "./actions/path"
import { updateUser } from "./actions/user"

import bootstrap from "./bootstrap"
import { configureStore } from "./store"

import Application from "./containers/application"
import Entity from "./containers/entity"
import EntityCreationModal from "./modals/entityCreationModal"
import EntityRenamingModal from "./modals/entityRenamingModal"
import FieldLocalizationModal from "./modals/fieldLocalizationModal"

import "bootstrap/dist/css/bootstrap.min.css"

bootstrap().then(async ({ assetServer, cmsConfigPath, configServer }) => {
  const store = configureStore()

  await store.dispatch(loadData(configServer, cmsConfigPath))

  store.dispatch(updateUser())

  window.addEventListener("hashchange", updatePathFromHash)
  updatePathFromHash()

  function updatePathFromHash() {
    store.dispatch(updatePath(window.location.hash))
  }

  render(
    <Provider store={ store } >
      <Application configServer={ configServer } configPath={ cmsConfigPath }>
        <Entity assetServer={ assetServer } />
        <EntityCreationModal />
        <EntityRenamingModal />
        <FieldLocalizationModal />
      </Application>
    </Provider>
    , document.getElementById("app"))
})
