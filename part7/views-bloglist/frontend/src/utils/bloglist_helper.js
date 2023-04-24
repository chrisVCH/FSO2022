import { groupBy } from 'lodash'

export const userWithBlogs = (blogs) => {
  const blogsByUser = groupBy(blogs, (blog) => `${blog.user.id},${blog.user.name}`)
  const userBlogsCount = Object.entries(blogsByUser).reduce((array, [username, blogList]) => {
    return array.concat({
      username,
      blogs: blogList.length
    })
  }, [])

  return userBlogsCount.sort((e1, e2) => e2.username-e1.username)
}
