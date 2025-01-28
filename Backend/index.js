const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const { PythonShell } = require("python-shell");
const connectDB = require("./config/db");
const Comment = require("./models/Comment");
const {analyzeComments}=require('./sentiment_analysis')

dotenv.config();
connectDB();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
console.log('api-key',YOUTUBE_API_KEY)

// Helper function: Mask commenter names
const maskName = (name) => name.replace(/./g, "*");

// Extract video ID
const extractVideoId = (url) => {
  const match = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/);
  return match ? match[1] : null;
};

// Fetch comments
app.post("/fetch-comments", async (req, res) => {
  const { videoUrl } = req.body;
  const videoId = extractVideoId(videoUrl);

  if (!videoId) return res.status(400).json({ error: "Invalid YouTube URL" });

  try {
    const comments = [];
    let nextPageToken = "";

    while (comments.length < 100) {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/commentThreads?key=${YOUTUBE_API_KEY}&videoId=${videoId}&part=snippet&maxResults=100&pageToken=${nextPageToken}`
      );

      response.data.items.forEach((item) => {
        const comment = item.snippet.topLevelComment.snippet;
        comments.push({
          commenterName: comment.authorDisplayName,
          commenterNameMasked: maskName(comment.authorDisplayName),
          text: comment.textDisplay,
          publishedAt: comment.publishedAt,
        });
      });

      nextPageToken = response.data.nextPageToken;
      if (!nextPageToken) break;
    }
    console.log("hiii")
    // await Comment.insertMany(comments);
    res.json({ videoUrl, comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching comments" });
  }
});

// Analyze comments
app.post("/analyze-comments", async (req, res) => {
  const { videoUrl, comments } = req.body;
  // console.log(req.body)
  // console.log(PythonShell)

    

      const analysisResults =  analyzeComments(comments)
      console.log("hh:",analysisResults)


      // Save comments and their sentiments to MongoDB
      const commentDocs = comments.map((comment, index) => ({
        videoUrl,
        commenterName: comment.commenterName,
        commenterNameMasked: comment.commenterNameMasked,
        commentText: comment.text,
        sentiment: analysisResults.sentiments[index],
        publishedAt: comment.publishedAt,
      }));

       await Comment.insertMany(commentDocs);
      res.json(analysisResults);
   
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
