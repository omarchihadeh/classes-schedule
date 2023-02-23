import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Table1 from './components/Table1';
import NavBar from './components/Navbar';
import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale, //x axis
  LinearScale, //y axis
  PointElement,
  Legend,
  Tooltip
} from 'chart.js';

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
)

function App() {
  const data = {
    labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
    datasets: [{
      label: 'Number of Scheduled Classes Per Day',
      data: [3, 1, 2],
      backgroundColor: 'black',
      borderColor: 'gray',
      pointBorderColor: 'black',
      fill: true,
      tension: 0.4
    }]
  }

  const options = {
    plugins: {
      legend: true
    },
    scales: {
      y: {
        min: 0,
        max: 20
      }
    }
  }


  return (
    <Router>
      <div className="App">
        <NavBar />
        <br />
        <Routes>
          <Route path="/" exact element={<Table1 />} />
          <Route path="/line" element={<div className='container' style={{ width: '1000px', height: '500px', padding: '20px' }}><Line data={data} options={options}></Line></div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
