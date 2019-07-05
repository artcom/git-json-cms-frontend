import axios from "axios"

export default class GitJsonApi {
  constructor(url = "/content") {
    this.api = axios.create({
      baseURL: url,
      auth: {
        username: "admin",
        password: "testtest"
      }
    })
  }

  async loadData(version = "master") {
    const response = await this.api.get(version)

    return {
      data: response.data,
      version: response.headers["git-commit-hash"]
    }
  }

  async updateContent(content, version) {
    await this.api.post(`${version}/content`, content)
  }
}
