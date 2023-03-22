import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders blog title and author, but does not render its URL or number of likes', () => {
  const user1= {
    username: 'cchen',
    name: 'Chris Chen'
  }

  const blog = {
    title: 'Experience Has Taught Well',
    author: 'Tucker Tomson',
    url: 'http://theonion.com',
    likes: 9,
    user: user1
  }

  window.localStorage.setItem(
    'loggedBlogappUser', JSON.stringify(user1)
  )

  render(<Blog blog={blog} />)

  const title = screen.queryByText('Experience Has Taught Well')
  expect(title).toBeDefined()

  const author = screen.queryByText('Tucker Tomson')
  expect(author).toBeDefined()

  const url = screen.queryByText('http://theonion.com')
  expect(url).toBeNull()

  const likes = screen.queryByText('9')
  expect(likes).toBeNull()

})

test('clicking view button to display the blog url and number of likes', async () => {
  const user1= {
    username: 'cchen',
    name: 'Chris Chen'
  }

  const blog = {
    title: 'Experience Has Taught Well',
    author: 'Tucker Tomson',
    url: 'http://theonion.com',
    likes: 9,
    user: user1
  }

  window.localStorage.setItem(
    'loggedBlogappUser', JSON.stringify(user1)
  )

  render(<Blog blog={blog} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const url = screen.queryByText('http://theonion.com')
  expect(url).toBeDefined()

  const likes = screen.queryByText('2')
  expect(likes).toBeDefined()

})

test('clicking likes button twice, event handler of the component is called twice', async () => {
  const user1= {
    username: 'cchen',
    name: 'Chris Chen'
  }

  const blog = {
    title: 'Experience Has Taught Well',
    author: 'Tucker Tomson',
    url: 'http://theonion.com',
    likes: 9,
    user: user1
  }

  window.localStorage.setItem(
    'loggedBlogappUser', JSON.stringify(user1)
  )

  const mockHandler = jest.fn()

  render(<Blog blog={blog} handleLikes={mockHandler}/>)
  const user = userEvent.setup()
  const button1 = screen.getByText('view')
  await user.click(button1)
  const button2 = screen.getByText('like')
  await user.click(button2)
  await user.click(button2)

  expect(mockHandler.mock.calls).toHaveLength(2)

})