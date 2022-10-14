import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import './App.css';
import {HomeScreen} from './components';
import {fetchArticleDetails} from './actions';
import {useDispatch} from 'react-redux';

export default function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/users">Users</Link>
            </li>
          </ul>
        </nav>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Routes>
          <Route path="/about" element={<About/>}/> 
          <Route path="/users" element={<Users/>}/>
          <Route path="/" element={<HomeScreen/>}/>
        </Routes>
      </div>
    </Router>
  );
}

function About() {
  return <a href="http://localhost:4000/auth/login">About</a>;
}

function Users() {
  const dispatch = useDispatch();
  return <button onClick={() => dispatch(fetchArticleDetails())}>Users</button>;
}
