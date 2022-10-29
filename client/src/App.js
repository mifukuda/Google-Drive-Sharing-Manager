import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import './App.css';
import {WelcomeScreen, HomeScreen, AnalyzeScreen} from './components';

export default function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<WelcomeScreen/>}/> 
          <Route path="/home" element={<HomeScreen/>}/>
          <Route path="/analyze" element={<AnalyzeScreen/>}/>
        </Routes>
      </div>
    </Router>
  );
}
