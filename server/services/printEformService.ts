import PrintApiClient from '../data/api/printApiClient'

export default class PrintEformService {
  constructor(private readonly printApiClient: PrintApiClient) {}

  async getPdf(): Promise<unknown> {
    return this.printApiClient.getPdf()
  }
}
