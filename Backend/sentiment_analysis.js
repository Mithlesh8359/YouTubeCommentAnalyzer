const Sentiment = require("sentiment");

const analyzeComments = (comments) => {
  const sentimentAnalyzer = new Sentiment();

  const results = {
    agree: 0,
    disagree: 0,
    neutral: 0,
    sentiments: [],
  };

  comments.forEach((comment) => {
    const analysis = sentimentAnalyzer.analyze(comment.text);
    const sentimentScore = analysis.score;

    if (sentimentScore > 1) {
      results.agree += 1;
      results.sentiments.push("agree");
    } else if (sentimentScore < -1) {
      results.disagree += 1;
      results.sentiments.push("disagree");
    } else {
      results.neutral += 1;
      results.sentiments.push("neutral");
    }
  });

  return results;
};

// Example Input
const comments = [
  { text: "This video is amazing!" },
  { text: "I totally disagree with the points made in the video." },
  { text: "It's okay, not too bad." },
];

// Analyze Comments
const sentimentResults = analyzeComments(comments);
console.log(sentimentResults);
module.exports= {analyzeComments}

