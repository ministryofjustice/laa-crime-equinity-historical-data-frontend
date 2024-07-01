import SDSApiClient from '../data/api/sdsApiClient'

export default class DownloadEvidenceService {
  constructor(private readonly sdsApiClient: SDSApiClient) {}

  async getEvidenceFileUrl(fileKey: string): Promise<string> {
    const response = await this.sdsApiClient.retrieveFile(fileKey)
    return response.fileURL
  }
}
