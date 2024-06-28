import SDSApiClient from '../data/api/sdsApiClient'

export default class DownloadEvidenceService {
  constructor(private readonly sdsApiClient: SDSApiClient) {}

  async getEvidenceFileUrl(fileName: string): Promise<string> {
    const response = await this.sdsApiClient.retrieveFile(fileName)
    return response.fileURL
  }
}
