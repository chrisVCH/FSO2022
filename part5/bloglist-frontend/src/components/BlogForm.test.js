import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const createBlog = jest.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const title = screen.getByPlaceholderText('blog title')
  const author = screen.getByPlaceholderText('blog author')
  const url = screen.getByPlaceholderText('blog url')

  await user.type(title, 'most beatiful travel in 2020')
  await user.type(author, 'Billy Woo')
  await user.type(url, 'https://thebestravelsite.com')

  const sendButton = screen.getByText('create')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('most beatiful travel in 2020')
  expect(createBlog.mock.calls[0][0].author).toBe('Billy Woo')
  expect(createBlog.mock.calls[0][0].url).toBe('https://thebestravelsite.com')

})