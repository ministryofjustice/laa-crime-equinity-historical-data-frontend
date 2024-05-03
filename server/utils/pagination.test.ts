import getPagination from './pagination'

const baseLink = '/results?'

describe('pagination', () => {
  it('should return [1],2,...,100 next for 1st page of 100', () => {
    const result = getPagination(1, 100, baseLink)

    expect(result).toEqual({
      items: [
        {
          current: true,
          href: '/results?page=1',
          number: 1,
        },
        {
          href: '/results?page=2',
          number: 2,
        },
        {
          ellipsis: true,
        },
        {
          href: '/results?page=100',
          number: 100,
        },
      ],
      next: {
        href: '/results?page=2',
      },
    })
  })

  it('should return prev 1,[2],3,...,100 next for 2nd page of 100', () => {
    const result = getPagination(2, 100, baseLink)

    expect(result).toEqual({
      previous: {
        href: '/results?page=1',
      },
      items: [
        {
          href: '/results?page=1',
          number: 1,
        },
        {
          current: true,
          href: '/results?page=2',
          number: 2,
        },
        {
          href: '/results?page=3',
          number: 3,
        },
        {
          ellipsis: true,
        },
        {
          href: '/results?page=100',
          number: 100,
        },
      ],
      next: {
        href: '/results?page=3',
      },
    })
  })

  it('should return prev 1,2,[3],4,...,100 next for 3rd page of 100', () => {
    const result = getPagination(3, 100, baseLink)

    expect(result).toEqual({
      previous: {
        href: '/results?page=2',
      },
      items: [
        {
          href: '/results?page=1',
          number: 1,
        },
        {
          href: '/results?page=2',
          number: 2,
        },
        {
          current: true,
          href: '/results?page=3',
          number: 3,
        },
        {
          href: '/results?page=4',
          number: 4,
        },
        {
          ellipsis: true,
        },
        {
          href: '/results?page=100',
          number: 100,
        },
      ],
      next: {
        href: '/results?page=4',
      },
    })
  })

  it('should return prev 1,...,3,[4],5,...,100 next for 4th page of 100', () => {
    const result = getPagination(4, 100, baseLink)

    expect(result).toEqual({
      previous: {
        href: '/results?page=3',
      },
      items: [
        {
          href: '/results?page=1',
          number: 1,
        },
        {
          ellipsis: true,
        },
        {
          href: '/results?page=3',
          number: 3,
        },
        {
          current: true,
          href: '/results?page=4',
          number: 4,
        },
        {
          href: '/results?page=5',
          number: 5,
        },
        {
          ellipsis: true,
        },
        {
          href: '/results?page=100',
          number: 100,
        },
      ],
      next: {
        href: '/results?page=5',
      },
    })
  })

  it('should return prev 1,...,4,[5],6,...,100 next for 5th page of 100', () => {
    const result = getPagination(5, 100, baseLink)

    expect(result).toEqual({
      previous: {
        href: '/results?page=4',
      },
      items: [
        {
          href: '/results?page=1',
          number: 1,
        },
        {
          ellipsis: true,
        },
        {
          href: '/results?page=4',
          number: 4,
        },
        {
          current: true,
          href: '/results?page=5',
          number: 5,
        },
        {
          href: '/results?page=6',
          number: 6,
        },
        {
          ellipsis: true,
        },
        {
          href: '/results?page=100',
          number: 100,
        },
      ],
      next: {
        href: '/results?page=6',
      },
    })
  })

  it('should return prev 1,...,97,[98],99,100 for 99th page of 100', () => {
    const result = getPagination(98, 100, baseLink)

    expect(result).toEqual({
      previous: {
        href: '/results?page=97',
      },
      items: [
        {
          href: '/results?page=1',
          number: 1,
        },
        {
          ellipsis: true,
        },
        {
          href: '/results?page=97',
          number: 97,
        },
        {
          current: true,
          href: '/results?page=98',
          number: 98,
        },
        {
          href: '/results?page=99',
          number: 99,
        },

        {
          href: '/results?page=100',
          number: 100,
        },
      ],
      next: {
        href: '/results?page=99',
      },
    })
  })

  it('should return prev 1,...,98,[99],100 for 99th page of 100', () => {
    const result = getPagination(99, 100, baseLink)

    expect(result).toEqual({
      previous: {
        href: '/results?page=98',
      },
      items: [
        {
          href: '/results?page=1',
          number: 1,
        },
        {
          ellipsis: true,
        },
        {
          href: '/results?page=98',
          number: 98,
        },
        {
          current: true,
          href: '/results?page=99',
          number: 99,
        },
        {
          href: '/results?page=100',
          number: 100,
        },
      ],
      next: {
        href: '/results?page=100',
      },
    })
  })

  it('should return prev 1,...,99,[100] for last page of 100', () => {
    const result = getPagination(100, 100, baseLink)

    expect(result).toEqual({
      previous: {
        href: '/results?page=99',
      },
      items: [
        {
          href: '/results?page=1',
          number: 1,
        },
        {
          ellipsis: true,
        },
        {
          href: '/results?page=99',
          number: 99,
        },
        {
          current: true,
          href: '/results?page=100',
          number: 100,
        },
      ],
    })
  })
})
