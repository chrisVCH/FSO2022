const _= require('lodash')

const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  const arrayoflikes = blogs.map(b => b.likes)
  const reducer = (sum, item) => {
    return sum + item
  }
  return blogs.length === 0
    ? 0
    : arrayoflikes.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const arrayoflikes = blogs.map(b => b.likes)
  const maxnumberoflikes = Math.max(...arrayoflikes)
  const filteredblog = blogs.filter(b => b.likes === maxnumberoflikes)
  return blogs.length === 0
    ? { title: 'none', author: 'none', likes: 0 }
    : { title: filteredblog[0].title, author: filteredblog[0].author, likes: filteredblog[0].likes }
}

const mostBlogs = (blogs) => {

  const blogcount = _(blogs)
    .groupBy(b => b.author)
    .map((value, key) => ({ author: key, blogs: value.length }))
    .value()
  return blogs.length === 0
    ? { author: 'none', blogs: 0 }
    : _.maxBy(blogcount, 'blogs')
}

const mostLikes = (blogs) => {

  const likesum = _(blogs)
    .groupBy(b => b.author)
    .map((value, key) => ({ author: key, likes: _.sumBy(value,'likes') }))
    .value()

  return blogs.length === 0
    ? { author: 'none', likes: 0 }
    : _.maxBy(likesum, 'likes')
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}