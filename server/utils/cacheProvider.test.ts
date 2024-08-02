import { Crm5Response } from '@crm5'
import { crmApiCache, sdsAuthCache } from './cacheProvider'

describe('CacheProvider', () => {
  describe('crmApiCache', () => {
    // beforeEach(() => {
    //   const crmResponse: Crm5Response = {
    //     formDetails: {
    //       usn: 1234567,
    //       hasPreviousApplication: 'No',
    //       previousApplicationRef: '',
    //       appealedPrevDecision: 'No',
    //       appealedPrevDecisionDetails: '',
    //       urgent: 'Yes',
    //       urgencyReason: 'Urgent',
    //       Firm: {
    //         firmAddress: '1 Some Lane',
    //         firmName: 'ABC Firm',
    //         firmPhone: '123456789',
    //         firmSupplierNo: '1234AB',
    //         firmContactName: 'Some Firm',
    //         firmSolicitorName: 'Some Solicitor',
    //         firmSolicitorRef: 'Ref1',
    //       },
    //       StatementOfCase: 'Statement Of Case',
    //       DetailsOfWorkCompleted: 'Some Details of Work Completed',
    //       DetailsOfApplication: 'Some Details of Application',
    //     },
    //     evidenceFiles: {
    //       files: [],
    //     },
    //   }
    //   crmApiCache.set('some-key', crmResponse)
    // })
  })

  describe('sdsAuthCache', () => {
    beforeEach(() => {
      sdsAuthCache.set('some-key', '123456')
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
  })
})
