# Notice

**The development of this project is continued in https://github.com/artcom/acms-ui.**

**For the sake of backwards compatibility this repository is archived and set to read-only.**

# CMS Frontend

A frontend webapp which allows browsing/editing the json content served by the git-json-api service.

## Usage

The CMS frontend bootstraps the necessary parameters either from environmental variables or from a `config.json` file located in the same serving directory. See below.

### Development

```bash
npm install
ASSET_SERVER_URI=<uri> CONFIG_SERVER_URI=<uri> CMS_CONFIG_PATH=<path> npm run watch
```

### Production

```bash
ASSET_SERVER_URI=<uri> CONFIG_SERVER_URI=<uri> CMS_CONFIG_PATH=<path> npm start
```
The web app is served on port `5000` by default if environment variable `PORT` is not set.

## Documentation

### Environment Variables

`ASSET_SERVER_URI`: Fully qualified URI to a [`WebDav enabled server`](https://github.com/artcom/git-json-cms-asset-server).  
`CONFIG_SERVER_URI`: Fully qualified URI to the [`git-json-api`](https://github.com/artcom/git-json-api) service.  
`CMS_CONFIG_PATH`: Directory path inside the configuration to the CMS frontend configuration (e.g. `/cmsConfig.json` => `cmsConfig`).

### Config file

The environment variables can be omitted if a `config.json` file providing the following information is served:
```json5
{
  "assetServerUri": "<uri>",
  "configServerUri": "<uri>",
  "cmsConfigPath": "<path>"
}
```

### CMS Configuration

```json5
{
  "title": "CMS",               // optional title shown in the header
  "contentPath": "content",     // root directory containing the content data
  "templatesPath": "templates", // root directory containing the (nested) template files
  "childrenLabel": "Children",  // optional label shown above the children, default: "Children"
  "fieldsLabel": "Fields",      // optional label shown above the fields, default: "Fields"
  "saveLabel": "Save",          // optional label of the save button, default: "Save"
  "languages": [                // optional list of supported languages, the first one is the default language
    {
      "id": "en",
      "name": "English"
    }
  ],
  "users": [                    // optional list of users to filter content based on allowList patterns
    {
      "id": "admin",
      "name": "Admin",
      "allowList": [
        "**"
      ]
    }
  ]
}
```

### Templates

Template files specify the structure of the content data while the actual values are located in the `content` directory. Every template entity can have children which themself are structured by a template. Nested templates within the `templates` directory are referenced via local path. E.g.:

```json5
/templates/template1.json            // => `template1`
/templates/template2.json            // => `template2`
/templates/template3/index.json      // => `template3`
/templates/template3/template4.json  // => `template3/template4`

```

#### Example
```json5
{
  "fields": [                      // optional list of fields
        {
            "id": "title",         // unique id within the whole template
            "name": "Main Title",  // optional display name shown in the CMS frontend, default startCase(id)
            "type": "string",      // field type see below
            "maxLength": 8         // optional type specific properties
        },
        {
            "id": "enabled",
            "name": "Page Enabled",
            "type": "boolean"
        },
        {
            "id": "numLoops",
            "name": "Number of Loops performed",
            "type": "number"
        }
  ]
  "fixedChildren": [               // optional list of fixed/named children
    {
      "id": "frontScreen",         // unique id within the whole template
      "name": "Front of the Entry",// optional display name shown in the CMS frontend, default startCase(id)
      "template": "location"       // template id/path
    },
    {
      "id": "backScreen",
      "name": "Back of the Entry",
      "template": "location"
    }
  ],
  "children": [                    // optional list of of allowed templates for the children 
    "template1",
    "template2"
  ],
  "enabledField": "enabled",       // optional field reference defining if the instance is shown enabled or disabled in its parent children list
  "subtitleField": "title"         // optional field reference defining a subtitle shown in its parent children list
}
```

### Field Types

The following field types are supported:

#### `audio`,`image`, `file`, `video`
An uploadable asset which is stored on the asset server with a unique (hashed) filename

Example:
```json5
{
    "id": "coverImage",
    "name": "Front Cover Image",
    "type": "image"
}
```

#### `string`, `markdown`
A string type with the following otional properties:
  * `multiline`: Defines wether the string can have multiple lines, default: `false`
  * `maxLength`: Defines the maximum number of characters, default: `Infinity`

Example:
```json5
{
    "id": "label",
    "name": "Start Label",
    "type": "string",
    "maxLength": 32,
    "multiline": true
}
```

#### `number`
A number type with the following optional properties:
* `min`: The minimum value, default `-Infinity`
* `max`: The maximum value, default `Infinity`

Example:
```json5
{
    "id": "numLoops",
    "name": "Number of loops",
    "type": "number",
    "min": 0,
    "max": 100
}
```

#### `boolean`
A boolean either being `true` or `false`.

Example:
```json5
{
    "id": "active",
    "name": "Active State",
    "type": "boolean"
}
```

### `enum`
A list of selectable `string` values.

Example:
```json5
{
    "id": "myEnum",
    "name": "My Enum Type",
    "type": "enum",
    "values": [
        {
            "id": "value1",
            "name": "First Value"
        },
        {
            "id": "value2",
            "name": "Second Value"
        },
        {
            "id": "value3",
            "name": "Third Value"
        }
    ]
}
```
Note: If you want to omit the `name` properties you can simplify `values` to a list of strings: `["value1", "value2", "value3"]`

### Field Condition

It is possible to hide/show fields in the CMS frontend depending on sibling fields value. A typical case is an `enum` field which specifies a layout type (e.g. `videoCover`/`imageCover`). Based on the field value you want to either show an `image` or `video` field. This can be achieved with the following `GET`and `EQUALS` operators:

```json5
{
    "id": "layoutType",
    "type": "enum",
    "values": ["videoCover", "imageCover"]
},
{
    "id": "coverVideo",
    "type": "video",
    "condition": [ "EQUALS", [ "GET", "layoutType" ], "videoCover" ]
},
{
    "id": "coverImage",
    "type": "image",
    "condition": [ "EQUALS", [ "GET", "layoutType" ], "imageCover" ]

}
```

If several values should be considered you can use the `IN` and `LIST` operator:
```json5
{
    "id": "coverVideo",
    "type": "string",
    "condition": [ "IN", [ "GET", "layoutType" ], [ "LIST", "videoCover", "imageCover" ] ]
}
```
