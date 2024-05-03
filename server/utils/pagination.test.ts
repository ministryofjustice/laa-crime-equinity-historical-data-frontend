import getPagination from './pagination'

describe('pagination', () => {
  it('should return [1],2,...,100 next for 1st page of 100', () => {
    const result = getPagination(1, 100)

    expect(result).toEqual({
      items: [
        {
          current: true,
          href: '#',
          number: 1,
        },
        {
          href: '#',
          number: 2,
        },
        {
          ellipsis: true,
        },
        {
          href: '#',
          number: 100,
        },
      ],
      next: {
        href: '#',
      },
    })
  })

  it('should return prev 1,[2],3,...,100 next for 2nd page of 100', () => {
    const result = getPagination(2, 100)

    expect(result).toEqual({
      previous: {
        href: '#',
      },
      items: [
        {
          href: '#',
          number: 1,
        },
        {
          current: true,
          href: '#',
          number: 2,
        },
        {
          href: '#',
          number: 3,
        },
        {
          ellipsis: true,
        },
        {
          href: '#',
          number: 100,
        },
      ],
      next: {
        href: '#',
      },
    })
  })

  it('should return prev 1,2,[3],4,...,100 next for 3rd page of 100', () => {
    const result = getPagination(3, 100)

    expect(result).toEqual({
      previous: {
        href: '#',
      },
      items: [
        {
          href: '#',
          number: 1,
        },
        {
          href: '#',
          number: 2,
        },
        {
          current: true,
          href: '#',
          number: 3,
        },
        {
          href: '#',
          number: 4,
        },
        {
          ellipsis: true,
        },
        {
          href: '#',
          number: 100,
        },
      ],
      next: {
        href: '#',
      },
    })
  })

  it('should return prev 1,...,3,[4],5,...,100 next for 4th page of 100', () => {
    const result = getPagination(4, 100)

    expect(result).toEqual({
      previous: {
        href: '#',
      },
      items: [
        {
          href: '#',
          number: 1,
        },
        {
          ellipsis: true,
        },
        {
          href: '#',
          number: 3,
        },
        {
          current: true,
          href: '#',
          number: 4,
        },
        {
          href: '#',
          number: 5,
        },
        {
          ellipsis: true,
        },
        {
          href: '#',
          number: 100,
        },
      ],
      next: {
        href: '#',
      },
    })
  })

  it('should return prev 1,...,4,[5],6,...,100 next for 5th page of 100', () => {
    const result = getPagination(5, 100)

    expect(result).toEqual({
      previous: {
        href: '#',
      },
      items: [
        {
          href: '#',
          number: 1,
        },
        {
          ellipsis: true,
        },
        {
          href: '#',
          number: 4,
        },
        {
          current: true,
          href: '#',
          number: 5,
        },
        {
          href: '#',
          number: 6,
        },
        {
          ellipsis: true,
        },
        {
          href: '#',
          number: 100,
        },
      ],
      next: {
        href: '#',
      },
    })
  })

  it('should return prev 1,...,97,[98],99,100 for 99th page of 100', () => {
    const result = getPagination(98, 100)

    expect(result).toEqual({
      previous: {
        href: '#',
      },
      items: [
        {
          href: '#',
          number: 1,
        },
        {
          ellipsis: true,
        },
        {
          href: '#',
          number: 97,
        },
        {
          current: true,
          href: '#',
          number: 98,
        },
        {
          href: '#',
          number: 99,
        },

        {
          href: '#',
          number: 100,
        },
      ],
      next: {
        href: '#',
      },
    })
  })

  it('should return prev 1,...,98,[99],100 for 99th page of 100', () => {
    const result = getPagination(99, 100)

    expect(result).toEqual({
      previous: {
        href: '#',
      },
      items: [
        {
          href: '#',
          number: 1,
        },
        {
          ellipsis: true,
        },
        {
          href: '#',
          number: 98,
        },
        {
          current: true,
          href: '#',
          number: 99,
        },
        {
          href: '#',
          number: 100,
        },
      ],
      next: {
        href: '#',
      },
    })
  })

  it('should return prev 1,...,99,[100] for last page of 100', () => {
    const result = getPagination(100, 100)

    expect(result).toEqual({
      previous: {
        href: '#',
      },
      items: [
        {
          href: '#',
          number: 1,
        },
        {
          ellipsis: true,
        },
        {
          href: '#',
          number: 99,
        },
        {
          current: true,
          href: '#',
          number: 100,
        },
      ],
    })
  })
})
