import { Crm5Response } from '@crm5'
import { crmApiCache, sdsAuthCache } from './cacheProvider'

describe('CacheProvider', () => {
  describe('crmApiCache', () => {
    let crmResponse: Crm5Response
    beforeEach(() => {
      crmResponse = {
        formDetails: {
          usn: 1234567,
          hasPreviousApplication: 'No',
          previousApplicationRef: '',
          appealedPrevDecision: 'No',
          appealedPrevDecisionDetails: '',
          urgent: 'Yes',
          urgencyReason: 'Urgent',
          Firm: {
            firmAddress: '1 Some Lane',
            firmName: 'ABC Firm',
            firmPhone: '123456789',
            firmSupplierNo: '1234AB',
            firmContactName: 'Some Firm',
            firmSolicitorName: 'Some Solicitor',
            firmSolicitorRef: 'Ref1',
          },
          StatementOfCase: 'Statement Of Case',
          DetailsOfWorkCompleted: 'Some Details of Work Completed',
          DetailsOfApplication: 'Some Details of Application',
        },
        FurtherInformation: [],
        evidenceFiles: {
          files: [],
        },
      }
      crmApiCache.set('some-key', crmResponse)
    })

    afterEach(() => {
      crmApiCache.clear()
    })

    it('should get item from cache', () => {
      const result = crmApiCache.get('some-key')

      expect(result).toEqual(crmResponse)
    })

    it('should return true if key exists in cache', () => {
      const result = crmApiCache.has('some-key')

      expect(result).toBe(true)
    })

    it('should return false if key does not exist in cache', () => {
      const result = crmApiCache.has('???')

      expect(result).toBe(false)
    })

    it('should clear cache', () => {
      crmApiCache.clear()

      expect(crmApiCache.has('some-key')).toBe(false)
    })
  })

  describe('sdsAuthCache', () => {
    beforeEach(() => {
      sdsAuthCache.set('some-key', '123456')
    })

    afterEach(() => {
      sdsAuthCache.clear()
    })

    it('should get item from cache', () => {
      const result = sdsAuthCache.get('some-key')

      expect(result).toEqual('123456')
    })

    it('should return true if key exists in cache', () => {
      const result = sdsAuthCache.has('some-key')

      expect(result).toBe(true)
    })

    it('should return false if key does not exist in cache', () => {
      const result = sdsAuthCache.has('???')

      expect(result).toBe(false)
    })

    it('should clear cache', () => {
      sdsAuthCache.clear()

      expect(sdsAuthCache.has('some-key')).toBe(false)
    })
  })
})
