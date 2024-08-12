import { SearchResponse } from '../../../server/@types/searchEform'

const getSearchByTypeResponse = (type: number, typeName: string): SearchResponse => {
  return {
    results: [
      {
        usn: 1234567,
        type: typeName,
        clientName: 'Doe',
        originatedDate: '2022-08-18',
        submittedDate: '2022-08-24',
        providerAccount: '123ABC',
        providerName: '123ABC, 1 SOME DR',
        status: 'Completed',
      },
      {
        usn: 2345678,
        type: typeName,
        clientName: 'Doe2',
        originatedDate: '2022-09-18',
        submittedDate: '2022-09-24',
        providerAccount: '234BCD',
        providerName: '234BCD, 1 SOME ST',
        status: 'Completed',
      },
      {
        usn: 3456789,
        type: typeName,
        clientName: 'Doe3',
        originatedDate: '2022-10-18',
        submittedDate: '2022-10-24',
        providerAccount: '345CDE',
        providerName: '345CDE, 1 SOME LANE',
        status: 'Completed',
      },
    ],
    paging: {
      size: 10,
      number: 0,
      total: 3,
      itemsPage: 10,
      itemsTotal: 3,
    },
  }
}

export default getSearchByTypeResponse
