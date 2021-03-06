import isPlainObject from "lodash/isPlainObject"

export function isLocalized(value, languages) {
  return isPlainObject(value) && Object.keys(value).every(key => isLanguage(key, languages))
}

function isLanguage(id, languages) {
  return languages.findIndex(language => language.id === id) >= 0
}

export function getLanguageName(id, languages) {
  const language = languages.find(lang => lang.id === id)
  return language ? language.name : `Unknown Language (${id})`
}
