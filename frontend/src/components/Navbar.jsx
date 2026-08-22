import { Link } from 'react-router-dom'

function Navbar({ title }) {
  return (
    <nav>
      <h2>{title}</h2>

      <Link to="/">Home</Link>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
    </nav>
  )
}

export default Navbar