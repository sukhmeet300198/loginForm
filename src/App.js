import logo from './logo.svg';
import './App.css';
import { BrowserRouter } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Routes, Route, Outlet, Link } from "react-router-dom";
import { useEffect, useState } from 'react';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/layout" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="dashboard" element={<Dashboard />} />
          {/* Using path="*" means "match anything", so this route
                acts like a catch-all for URLs that we don't have explicit
                routes for. */}
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}


function Layout() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSessionExpiration = () => {
      const session = JSON.parse(localStorage.getItem('session'));
      if (session) {
        const now = new Date();
        const expirationTime = new Date(session.expires);

        if (now > expirationTime) {
          console.log('Session expired');
          localStorage.removeItem('session');
          navigate('/'); // Redirect to login page
        } 
      } else {
        // No session found, redirect to login page
        navigate('/');
      }
    };

    checkSessionExpiration();

    // Set an interval for continuous check
    const intervalId = setInterval(checkSessionExpiration, 60000); // Check every 60 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [navigate]);


  return (
    <div>
      {/* A "layout route" is a good place to put markup you want to
          share across all the pages on your site, like navigation. */}
      <nav>
        <ul>
          <li>
            <Link to="home">Home</Link>
          </li>
          <li>
            <Link to="about">About</Link>
          </li>
          <li>
            <Link to="dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="nothing-here">Nothing Here</Link>
          </li>
        </ul>
      </nav>

      <hr />

      {/* An <Outlet> renders whatever child route is currently active,
          so you can think about this <Outlet> as a placeholder for
          the child routes we defined above. */}
      <Outlet />
    </div>
  );
}

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    event.preventDefault();
    const now = new Date();
    // Corrected to set expiration time for 2 minutes from now
    const expirationTime = new Date(now.getTime() + 2 * 60000); // 2 minutes from now
    console.log("session expire after ---",new Date(now.getTime() + 2 * 60000))
  
    localStorage.setItem('session', JSON.stringify({
      email: email,
      password: password,
      expires: expirationTime.toISOString(),
    }));
    navigate('/layout');
  };

  return (

    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
}

function Home() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}

function About() {
  return (
    <div>
      <h2>About</h2>
    </div>
  );
}

function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
    </div>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the Login Page</Link>
      </p>
    </div>
  );
}


export default App;
