import { createMock, DeepMocked } from '@golevelup/ts-jest'
import nock from 'nock'
import type { NextFunction, Request, Response } from 'express'
import DownloadEvidenceService from '../services/downloadEvidenceService'
import DownloadEvidenceController from './downloadEvidenceController'

jest.mock('../services/downloadEvidenceService')

describe('downloadEvidenceController', () => {
  let fakeRestClient: nock.Scope
  let mockDownloadEvidenceService: jest.Mocked<DownloadEvidenceService>
  let request: DeepMocked<Request>
  let response: DeepMocked<Response>
  const next: DeepMocked<NextFunction> = createMock<NextFunction>({})

  beforeEach(() => {
    fakeRestClient = nock('https://test.com')
    request = createMock<Request>({})
    response = createMock<Response>({})
    mockDownloadEvidenceService = new DownloadEvidenceService(null) as jest.Mocked<DownloadEvidenceService>
  })

  afterEach(() => {
    nock.cleanAll()
  })

  it('should download the requested evidence file', async () => {
    mockDownloadEvidenceService.getEvidenceFileUrl.mockResolvedValue('https://test.com/some-file.txt')

    const downloadData = { fakeData: '????' }
    fakeRestClient
      .get('/some-file.txt')
      .matchHeader('content-type', 'application/octet-stream')
      .reply(200, downloadData)

    const downloadEvidenceController = new DownloadEvidenceController(mockDownloadEvidenceService)
    const requestHandler = downloadEvidenceController.download()
    request.query = {
      fileKey: '0000.att',
      fileName: 'some-file.txt',
    }

    await requestHandler(request, response, next)

    expect(response.setHeader).toHaveBeenCalledWith('Content-Disposition', 'attachment; filename="some-file.txt"')
    expect(response.send).toHaveBeenCalledWith(downloadData)

    expect(mockDownloadEvidenceService.getEvidenceFileUrl).toHaveBeenCalledWith('0000.att')
  })

  it('should download the requested evidence filename with special characters', async () => {
    mockDownloadEvidenceService.getEvidenceFileUrl.mockResolvedValue('https://test.com/some-file.txt')

    const downloadData = { fakeData: '????' }
    fakeRestClient
      .get('/some-file.txt')
      .matchHeader('content-type', 'application/octet-stream')
      .reply(200, downloadData)

    const downloadEvidenceController = new DownloadEvidenceController(mockDownloadEvidenceService)
    const requestHandler = downloadEvidenceController.download()
    request.query = {
      fileKey: '0000.att',
      fileName: "Someone's Bank Statements.pdf",
    }

    await requestHandler(request, response, next)

    expect(response.setHeader).toHaveBeenCalledWith(
      'Content-Disposition',
      'attachment; filename="Someone\'s Bank Statements.pdf"',
    )
    expect(response.send).toHaveBeenCalledWith(downloadData)

    expect(mockDownloadEvidenceService.getEvidenceFileUrl).toHaveBeenCalledWith('0000.att')
  })
})
