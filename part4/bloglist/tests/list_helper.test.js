const listHelper = require('../utils/list_helper')
const listWithOneBlog = [
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  }
]

const listWithMoreBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
  }
]

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)

})

describe('total likes', () => {

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(listWithMoreBlogs)
    expect(result).toBe(36)
  })
})

describe('favorite blog', () => {
  test('of empty blog list is zero', () => {
    const result = listHelper.favoriteBlog([])
    const nonvalue = { title: 'none', author: 'none', likes: 0 }
    expect(result).toEqual(nonvalue)
  })

  test('when list has only one blog equals that blog with its likes', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    const theblog = { title: 'Go To Statement Considered Harmful', author: 'Edsger W. Dijkstra', likes: 5 }
    expect(result).toEqual(theblog)
  })

  test('when list has more than one blog with the most likes', () => {
    const result = listHelper.favoriteBlog(listWithMoreBlogs)
    const theblog = { title: 'Canonical string reduction', author: 'Edsger W. Dijkstra', likes: 12 }
    expect(result).toEqual(theblog)
  })

  describe('most blogs', () => {
    test('of empty blog list is zero', () => {
      const result = listHelper.mostBlogs([])
      const nonvalue = { author: 'none', blogs: 0 }
      expect(result).toEqual(nonvalue)
    })

    test('when list has only one blog equals that blog with its blog count', () => {
      const result = listHelper.mostBlogs(listWithOneBlog)
      const theblog = { author: 'Edsger W. Dijkstra', blogs: 1 }
      expect(result).toEqual(theblog)
    })

    test('when list has more than one author with most blog count', () => {
      const result = listHelper.mostBlogs(listWithMoreBlogs)
      const theblog = { author: 'Robert C. Martin', blogs: 3 }
      expect(result).toEqual(theblog)
    })
  })

  describe('most likes', () => {
    test('of empty blog list is zero', () => {
      const result = listHelper.mostLikes([])
      const nonvalue = { author: 'none', likes: 0 }
      expect(result).toEqual(nonvalue)
    })

    test('when list has only one blog equals that blog with its likes', () => {
      const result = listHelper.mostLikes(listWithOneBlog)
      const theblog = { author: 'Edsger W. Dijkstra', likes: 5 }
      expect(result).toEqual(theblog)
    })

    test('when list has more than one author with most likes', () => {
      const result = listHelper.mostLikes(listWithMoreBlogs)
      const theblog = { author: 'Edsger W. Dijkstra', likes: 17 }
      expect(result).toEqual(theblog)
    })
  })

})
