import axios from "axios"
import { join } from "path"
import { format, parse } from "url"

export default class AssetServer {
  constructor(url = "/assets") {
    this.api = axios.create({
      baseURL: url,
      auth: {
        username: process.env.BASIC_AUTH_USER,
        password: process.env.BASIC_AUTH_PASSWORD
      }
    })
    this.url = parse(url)
  }

  async uploadFile(path, file, options) {
    await this.api.put(path, file, options)
  }

  assetUrl(path) {
    return format({ ...this.url, pathname: join(this.url.pathname, path) })
  }
}
