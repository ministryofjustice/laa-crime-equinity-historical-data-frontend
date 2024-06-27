import { createMock, DeepMocked } from '@golevelup/ts-jest'
import type { NextFunction, Request, Response } from 'express'
import DownloadEvidenceService from '../services/downloadEvidenceService'
import DownloadEvidenceController from './downloadEvidenceController'

jest.mock('../services/downloadEvidenceService')

describe('downloadEvidenceController', () => {
  let mockDownloadEvidenceService: jest.Mocked<DownloadEvidenceService>
  let request: DeepMocked<Request>
  let response: DeepMocked<Response>
  const next: DeepMocked<NextFunction> = createMock<NextFunction>({})

  beforeEach(() => {
    request = createMock<Request>({})
    response = createMock<Response>({})
    mockDownloadEvidenceService = new DownloadEvidenceService(null) as jest.Mocked<DownloadEvidenceService>
  })

  it('should download the request evidence file', async () => {
    mockDownloadEvidenceService.getEvidenceFileUrl.mockResolvedValue('https://test.com/some-file.txt')

    const downloadEvidenceController = new DownloadEvidenceController(mockDownloadEvidenceService)
    const requestHandler = downloadEvidenceController.download()
    request.query = {
      fileName: 'some-file.txt',
    }

    await requestHandler(request, response, next)

    expect(response.redirect).toHaveBeenCalledWith('https://test.com/some-file.txt')

    expect(mockDownloadEvidenceService.getEvidenceFileUrl).toHaveBeenCalledWith('some-file.txt')
  })
})
