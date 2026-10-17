import { beforeEach, describe, expect, it, vi } from 'vitest'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { fakeToken, renderApp } from './helpers'

vi.mock('../services/authService', () => ({
  loginUser: vi.fn(),
  googleAuth: vi.fn(),
  registerUser: vi.fn(),
  getProfile: vi.fn(),
}))
vi.mock('../services/bookService', () => ({
  getBooks: vi.fn(),
  createBook: vi.fn(),
  updateBook: vi.fn(),
  removeBook: vi.fn(),
}))
vi.mock('../components/auth/GoogleButton', () => ({
  default: ({ onCredential }) => (
    <button type="button" onClick={() => onCredential('google-credential')}>
      Google (test)
    </button>
  ),
}))
vi.mock('../services/userService', () => ({
  getUsers: vi.fn(),
  createUser: vi.fn(),
  updateUser: vi.fn(),
  deleteUser: vi.fn(),
}))

const { loginUser, registerUser, googleAuth } = await import('../services/authService')
const { getBooks, createBook, updateBook, removeBook } = await import('../services/bookService')
const { getUsers } = await import('../services/userService')

const USER_ID = '64b000000000000000000001'
const OTHER_ID = '64b000000000000000000002'

const book = (over = {}) => ({
  _id: 'b1',
  nomi: 'Clean Code',
  muallifi: 'Robert Martin',
  sahifasi: 464,
  Janr: 'Programming',
  sotuvdaBor: true,
  user: { _id: USER_ID, ism: 'Kamol' },
  ...over,
})

const page = (books) => ({
  books,
  pagination: { page: 1, limit: 9, totalBooks: books.length, totalPages: 1, hasNextPage: false, hasPreviousPage: false },
})

function loginAs(role, id = USER_ID) {
  localStorage.setItem('token', fakeToken({ id, role, ism: 'Kamol', email: 'k@test.uz' }))
}

beforeEach(() => {
  vi.clearAllMocks()
  getBooks.mockResolvedValue(page([book()]))
  getUsers.mockResolvedValue([])
})

describe('login', () => {
  it('logs in, stores the token and goes to /books', async () => {
    const token = fakeToken({ id: USER_ID, role: 'user', ism: 'Kamol', email: 'k@test.uz' })
    loginUser.mockResolvedValue({ data: { token, user: { ism: 'Kamol' } } })

    renderApp('/login')
    const user = userEvent.setup()

    await user.type(screen.getByLabelText('Email'), 'k@test.uz')
    await user.type(screen.getByLabelText('Password'), 'secret123')
    await user.click(screen.getByRole('button', { name: 'Log in' }))

    expect(await screen.findByRole('heading', { name: 'Books' })).toBeInTheDocument()
    expect(loginUser).toHaveBeenCalledWith({ email: 'k@test.uz', password: 'secret123' })
    expect(localStorage.getItem('token')).toBe(token)
    expect(screen.getAllByRole('link', { name: /Kamol/ }).length).toBeGreaterThan(0)
  })

  it('shows the server error when the password is wrong', async () => {
    loginUser.mockRejectedValue({ response: { status: 401, data: { message: "Email yoki parol noto'g'ri!" } } })

    renderApp('/login')
    const user = userEvent.setup()

    await user.type(screen.getByLabelText('Email'), 'k@test.uz')
    await user.type(screen.getByLabelText('Password'), 'wrongpass')
    await user.click(screen.getByRole('button', { name: 'Log in' }))

    expect(await screen.findByRole('alert')).toHaveTextContent("Email yoki parol noto'g'ri!")
    expect(localStorage.getItem('token')).toBeNull()
  })

  it('returns to the page the user wanted after logging in', async () => {
    const token = fakeToken({ id: USER_ID, role: 'user', ism: 'Kamol' })
    loginUser.mockResolvedValue({ data: { token, user: { ism: 'Kamol' } } })

    renderApp('/profile')
    const user = userEvent.setup()

    await user.type(await screen.findByLabelText('Email'), 'k@test.uz')
    await user.type(screen.getByLabelText('Password'), 'secret123')
    await user.click(screen.getByRole('button', { name: 'Log in' }))

    await waitFor(() => expect(screen.queryByLabelText('Email')).not.toBeInTheDocument())
  })
})

describe('register', () => {
  it('validates the form before calling the API', async () => {
    renderApp('/register')
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: 'Create account' }))

    expect(registerUser).not.toHaveBeenCalled()
    expect(screen.getAllByText('At least 2 characters').length).toBe(2)
    expect(screen.getByText('Enter a valid email address')).toBeInTheDocument()
  })

  it('registers and logs the new user in automatically', async () => {
    registerUser.mockResolvedValue({ data: {} })
    const token = fakeToken({ id: USER_ID, role: 'user', ism: 'Ali' })
    loginUser.mockResolvedValue({ data: { token } })

    renderApp('/register')
    const user = userEvent.setup()

    await user.type(screen.getByLabelText('First name'), 'Ali')
    await user.type(screen.getByLabelText('Last name'), 'Valiyev')
    await user.type(screen.getByLabelText('Age'), '21')
    await user.type(screen.getByLabelText('Email'), 'ali@test.uz')
    await user.type(screen.getByLabelText('Password'), 'secret123')
    await user.click(screen.getByRole('button', { name: 'Create account' }))

    expect(await screen.findByRole('heading', { name: 'Books' })).toBeInTheDocument()
    expect(registerUser).toHaveBeenCalledWith({
      ism: 'Ali',
      familiya: 'Valiyev',
      yosh: 21,
      email: 'ali@test.uz',
      password: 'secret123',
    })
    expect(localStorage.getItem('token')).toBe(token)
  })
})

describe('route protection', () => {
  it('sends guests from /users to the login page', async () => {
    renderApp('/users')
    expect(await screen.findByRole('heading', { name: 'Welcome back' })).toBeInTheDocument()
  })

  it('shows "access denied" to a plain user on /users', async () => {
    loginAs('user')
    renderApp('/users')
    expect(await screen.findByRole('heading', { name: 'Access denied' })).toBeInTheDocument()
    expect(getUsers).not.toHaveBeenCalled()
  })

  it('lets an admin see users but not change them', async () => {
    loginAs('admin')
    getUsers.mockResolvedValue([
      { _id: OTHER_ID, ism: 'Vali', familiya: 'Aliyev', email: 'vali@test.uz', yosh: 30, role: 'user' },
    ])
    renderApp('/users')

    expect(await screen.findByText('vali@test.uz')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Add user/ })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Delete/ })).not.toBeInTheDocument()
  })

  it('lets a superAdmin edit and delete users, but not delete themselves', async () => {
    loginAs('superAdmin')
    getUsers.mockResolvedValue([
      { _id: USER_ID, ism: 'Kamol', email: 'k@test.uz', yosh: 22, role: 'superAdmin' },
      { _id: OTHER_ID, ism: 'Vali', email: 'vali@test.uz', yosh: 30, role: 'user' },
    ])
    renderApp('/users')

    expect(await screen.findByText('vali@test.uz')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Add user/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Delete: Kamol' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Delete: Vali' })).toBeEnabled()
  })
})

describe('books', () => {
  it('guests can read books but are asked to log in to add one', async () => {
    renderApp('/books')

    expect(await screen.findByText('Clean Code')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Log in to add a book' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Edit/ })).not.toBeInTheDocument()
  })

  it('owners can edit and delete their book, other users cannot', async () => {
    loginAs('user', USER_ID)
    getBooks.mockResolvedValue(
      page([
        book({ _id: 'b1', nomi: 'My Book' }),
        book({ _id: 'b2', nomi: 'Not Mine', user: { _id: OTHER_ID, ism: 'Vali' } }),
      ])
    )
    renderApp('/books')

    expect(await screen.findByText('My Book')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Edit' })).toHaveLength(1)
    expect(screen.getByRole('button', { name: 'Delete: My Book' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Delete: Not Mine' })).not.toBeInTheDocument()
  })

  it('admins can manage every book', async () => {
    loginAs('admin', OTHER_ID)
    renderApp('/books')

    expect(await screen.findByText('Clean Code')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument()
  })

  it('creates a book from the form', async () => {
    loginAs('user')
    createBook.mockResolvedValue(book())
    renderApp('/books')
    const user = userEvent.setup()

    await user.click(await screen.findByRole('button', { name: 'Add book' }))
    const dialog = await screen.findByRole('dialog')

    await user.type(within(dialog).getByLabelText('Title'), 'abc')
    await user.click(within(dialog).getByRole('button', { name: 'Add book' }))
    expect(createBook).not.toHaveBeenCalled()
    expect(within(dialog).getByText('At least 4 characters')).toBeInTheDocument()

    await user.type(within(dialog).getByLabelText('Title'), 'd')
    await user.type(within(dialog).getByLabelText('Author'), 'Eric Evans')
    await user.type(within(dialog).getByLabelText('Number of pages'), '560')
    await user.type(within(dialog).getByLabelText('Genre'), 'Programming')
    await user.click(within(dialog).getByRole('button', { name: 'Add book' }))

    await waitFor(() =>
      expect(createBook).toHaveBeenCalledWith({
        nomi: 'abcd',
        muallifi: 'Eric Evans',
        sahifasi: 560,
        Janr: 'Programming',
        sotuvdaBor: true,
        newImages: [],
        removeImages: [],
      })
    )
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(screen.getByText('Book added')).toBeInTheDocument()
  })

  it('shows the server error inside the form and keeps it open', async () => {
    loginAs('user')
    createBook.mockRejectedValue({
      response: { status: 400, data: { message: 'Validatsiya xatosi', errors: [{ field: 'sahifasi', message: 'Too small' }] } },
    })
    renderApp('/books')
    const user = userEvent.setup()

    await user.click(await screen.findByRole('button', { name: 'Add book' }))
    const dialog = await screen.findByRole('dialog')
    await user.type(within(dialog).getByLabelText('Title'), 'Domain Driven')
    await user.type(within(dialog).getByLabelText('Author'), 'Eric Evans')
    await user.type(within(dialog).getByLabelText('Number of pages'), '5')
    await user.type(within(dialog).getByLabelText('Genre'), 'Programming')
    await user.click(within(dialog).getByRole('button', { name: 'Add book' }))

    expect(await within(dialog).findByRole('alert')).toHaveTextContent('sahifasi: Too small')
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('asks for confirmation before deleting', async () => {
    loginAs('user')
    removeBook.mockResolvedValue({ message: "O'chirildi!" })
    renderApp('/books')
    const user = userEvent.setup()

    await user.click(await screen.findByRole('button', { name: 'Delete: Clean Code' }))
    const dialog = await screen.findByRole('dialog')
    expect(dialog).toHaveTextContent('“Clean Code” will be permanently removed')
    expect(removeBook).not.toHaveBeenCalled()

    await user.click(within(dialog).getByRole('button', { name: 'Delete' }))
    await waitFor(() => expect(removeBook).toHaveBeenCalledWith('b1'))
  })
})

describe('book images', () => {
  const png = (name) => new File(['x'], name, { type: 'image/png' })

  async function openForm() {
    loginAs('user')
    createBook.mockResolvedValue(book())
    renderApp('/books')
    const user = userEvent.setup()
    await user.click(await screen.findByRole('button', { name: 'Add book' }))
    return { user, dialog: await screen.findByRole('dialog') }
  }

  it('lets you attach up to 5 images and sends them with the book', async () => {
    const { user, dialog } = await openForm()
    const input = within(dialog).getByTestId('book-images-input')

    await user.upload(input, [png('1.png'), png('2.png'), png('3.png')])
    expect(within(dialog).getByText('3 / 5')).toBeInTheDocument()
    expect(within(dialog).getAllByRole('button', { name: 'Remove image' })).toHaveLength(3)

    await user.upload(input, [png('4.png'), png('5.png')])
    expect(within(dialog).getByText('5 / 5')).toBeInTheDocument()
    // the add tile disappears when the limit is reached
    expect(within(dialog).queryByRole('button', { name: 'Add image' })).not.toBeInTheDocument()

    await user.type(within(dialog).getByLabelText('Title'), 'Domain Driven')
    await user.type(within(dialog).getByLabelText('Author'), 'Eric Evans')
    await user.type(within(dialog).getByLabelText('Number of pages'), '560')
    await user.type(within(dialog).getByLabelText('Genre'), 'Programming')
    await user.click(within(dialog).getByRole('button', { name: 'Add book' }))

    await waitFor(() => expect(createBook).toHaveBeenCalled())
    const sent = createBook.mock.calls[0][0]
    expect(sent.newImages).toHaveLength(5)
    expect(sent.newImages[0].name).toBe('1.png')
  })

  it('never takes more than 5 images and removes a picked one', async () => {
    const { user, dialog } = await openForm()
    const input = within(dialog).getByTestId('book-images-input')

    await user.upload(input, Array.from({ length: 7 }, (_, i) => png(`${i}.png`)))
    expect(within(dialog).getByText('5 / 5')).toBeInTheDocument()
    expect(within(dialog).getByRole('alert')).toHaveTextContent('up to 5 images')

    await user.click(within(dialog).getAllByRole('button', { name: 'Remove image' })[0])
    expect(within(dialog).getByText('4 / 5')).toBeInTheDocument()
  })

  it('rejects files that are not images', async () => {
    const { user, dialog } = await openForm()
    const input = within(dialog).getByTestId('book-images-input')

    // applyAccept off: simulate a file the browser let through
    const picker = userEvent.setup({ applyAccept: false })
    await picker.upload(input, new File(['hi'], 'notes.txt', { type: 'text/plain' }))

    expect(within(dialog).getByRole('alert')).toHaveTextContent('Only JPG, PNG, WEBP or GIF')
    expect(within(dialog).getByText('0 / 5')).toBeInTheDocument()
    expect(user).toBeTruthy()
  })

  it('shows existing photos on the card and lets you remove one while editing', async () => {
    loginAs('user')
    getBooks.mockResolvedValue(page([book({ images: ['/uploads/a.jpg', '/uploads/b.jpg'] })]))
    updateBook.mockResolvedValue(book())
    renderApp('/books')
    const user = userEvent.setup()

    expect(await screen.findByAltText('Clean Code: photo 1')).toHaveAttribute('src', expect.stringContaining('/uploads/a.jpg'))
    await user.click(screen.getByRole('button', { name: 'Next image' }))
    expect(screen.getByAltText('Clean Code: photo 2')).toHaveAttribute('src', expect.stringContaining('/uploads/b.jpg'))

    await user.click(screen.getByRole('button', { name: 'Edit' }))
    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByText('2 / 5')).toBeInTheDocument()

    await user.click(within(dialog).getAllByRole('button', { name: 'Remove image' })[0])
    await user.click(within(dialog).getByRole('button', { name: 'Save' }))

    await waitFor(() => expect(updateBook).toHaveBeenCalled())
    expect(updateBook.mock.calls[0][0].book.removeImages).toEqual(['/uploads/a.jpg'])
  })
})

describe('google sign-in', () => {
  it('registers with Google in one click', async () => {
    const token = fakeToken({ id: USER_ID, role: 'user', ism: 'Ali' })
    googleAuth.mockResolvedValue({ data: { token, isNew: true, user: { ism: 'Ali' } } })

    renderApp('/register')
    const user = userEvent.setup()
    await user.click(await screen.findByRole('button', { name: 'Google (test)' }))

    expect(await screen.findByRole('heading', { name: 'Books' })).toBeInTheDocument()
    expect(googleAuth).toHaveBeenCalledWith('google-credential')
    expect(localStorage.getItem('token')).toBe(token)
  })

  it('shows the error when Google sign-in is refused', async () => {
    googleAuth.mockRejectedValue({ response: { status: 401, data: { message: 'Google tokeni yaroqsiz' } } })

    renderApp('/login')
    const user = userEvent.setup()
    await user.click(await screen.findByRole('button', { name: 'Google (test)' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Google tokeni yaroqsiz')
    expect(localStorage.getItem('token')).toBeNull()
  })
})

describe('theme', () => {
  it('switches between light and dark and remembers the choice', async () => {
    renderApp('/')
    const user = userEvent.setup()

    await user.click(screen.getAllByRole('button', { name: 'Dark mode' })[0])
    expect(document.documentElement).toHaveClass('dark')
    expect(localStorage.getItem('theme')).toBe('dark')

    await user.click(screen.getAllByRole('button', { name: 'Light mode' })[0])
    expect(document.documentElement).not.toHaveClass('dark')
    expect(localStorage.getItem('theme')).toBe('light')
  })
})

describe('expired session', () => {
  it('treats an expired token as logged out', async () => {
    localStorage.setItem('token', fakeToken({ id: USER_ID, role: 'admin', ism: 'Kamol', exp: 1 }))
    renderApp('/users')

    expect(await screen.findByRole('heading', { name: 'Welcome back' })).toBeInTheDocument()
    expect(localStorage.getItem('token')).toBeNull()
  })
})
