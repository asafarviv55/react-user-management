# React User Management

A React application for managing users with CRUD operations, built with React 18 and react-table.

## Features

- **User List** with sortable columns and pagination
- **Search** users by email
- **Add User** with form validation (email, age 18+, phone format)
- **Edit/Delete** users with confirmation dialogs
- **Export to CSV** - download filtered user data
- **Error Boundary** - graceful error handling
- **Loading States** - visual feedback during API calls
- **Responsive Design** - Bootstrap 5 styling

## Tech Stack

- **Framework**: React 18
- **Routing**: React Router v6
- **Table**: react-table v7 (sorting, pagination)
- **HTTP Client**: Axios
- **Styling**: Bootstrap 5, Font Awesome

## Installation

```bash
# Clone the repository
git clone https://github.com/asafarviv55/react-user-management.git
cd react-user-management

# Install dependencies
npm install

# Set up environment
cp .env.example .env

# Start development server
npm start
```

The app runs at `http://localhost:8081`

## Environment Variables

Create a `.env` file:

```env
PORT=8081
REACT_APP_API_URL=http://localhost:8080/api/users
```

## API Endpoints Expected

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/list` | Get all users |
| GET | `/:id` | Get user by ID |
| POST | `/addOrUpdate` | Create user |
| PUT | `/addOrUpdate/:id` | Update user |
| DELETE | `/:id` | Delete user |
| DELETE | `/` | Delete all users |

## Project Structure

```
src/
├── components/
│   ├── AddUser.js       # User creation form with validation
│   ├── UsersList.js     # User table with search/sort/pagination
│   ├── User.js          # User detail/edit view
│   └── ErrorBoundary.js # Error handling wrapper
├── services/
│   └── UserService.js   # API calls
├── http-common.js       # Axios configuration
└── App.js               # Routes and layout
```

## Docker

```bash
# Build image
docker build -t react-user-management .

# Run container
docker run -p 80:80 react-user-management
```

## Available Scripts

- `npm start` - Run development server
- `npm build` - Build for production
- `npm test` - Run tests

## Business Features

- **Form Validation**: Email format, minimum age (18), phone format
- **Pagination**: Configurable page size (5, 10, 20, 50)
- **Sorting**: Click column headers to sort
- **Search**: Filter users by email in real-time
- **CSV Export**: Download filtered data with timestamp
- **Confirmation Dialogs**: Prevent accidental deletions

## License

MIT
