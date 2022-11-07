import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { WelcomeScreen, HomeScreen, AnalyzeScreen, UpdateScreen, AccessControlPolicies } from './components';
import './App.css';

export default function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<WelcomeScreen/>}/> 
          <Route path="/home" element={<HomeScreen/>}/>
          <Route path="/analyze" element={<AnalyzeScreen/>}/>
          <Route path="/accessControlPolicies" element={<AccessControlPolicies/>}/>
          <Route path="/update" element={<UpdateScreen/>}/>
        </Routes>
      </div>
    </Router>
  );
}
