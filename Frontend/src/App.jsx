import React, { useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

import { Pie } from 'react-chartjs-2';
// Register components
ChartJS.register(ArcElement, Tooltip, Legend);



const App = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [data, setData] = useState(null);

  const analyzeComments = async () => {
    try {
      const commentsRes = await axios.post("https://youtube-comment-analyzer-49cl.onrender.com/fetch-comments", { videoUrl });
      console.log(commentsRes);
      const analysisRes = await axios.post("https://youtube-comment-analyzer-49cl.onrender.com/analyze-comments", commentsRes.data);
      setData(analysisRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h1>YouTube Comments Analyzer</h1>
      <input type="text" placeholder="Enter video URL" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
      <button onClick={analyzeComments}>Analyze</button>

      {data && (
        <div>
          <Pie
            data={{
              labels: ["Agree", "Disagree", "Neutral"],
              datasets: [{ data: [data.agree, data.disagree, data.neutral], backgroundColor: ["green", "red", "gray"] }],
            }}
          />
        </div>
      )}
    </div>
  );
};

export default App;
