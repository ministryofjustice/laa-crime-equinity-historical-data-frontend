import SdsApiClient from '../data/api/sdsApiClient'
import DownloadEvidenceService from './downloadEvidenceService'

jest.mock('../data/api/sdsApiClient')

describe('Download Evidence Service', () => {
  let mockSdsApiClient: jest.Mocked<SdsApiClient>

  beforeEach(() => {
    mockSdsApiClient = new SdsApiClient() as jest.Mocked<SdsApiClient>
  })

  it('should return the evidence file url for the given file name', async () => {
    mockSdsApiClient.retrieveFile.mockResolvedValue({ fileURL: 'https://test.com/some-file.txt' })

    const downloadEvidenceService = new DownloadEvidenceService(mockSdsApiClient)

    const result = await downloadEvidenceService.getEvidenceFileUrl('some-file.txt')

    expect(result).toEqual('https://test.com/some-file.txt')
  })
})
