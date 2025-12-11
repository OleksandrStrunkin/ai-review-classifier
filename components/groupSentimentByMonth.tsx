import { SentimentTimelinePoint, AnalyzedReview } from "@/types/analysis";

export function groupSentimentByMonth(reviews: AnalyzedReview[]): SentimentTimelinePoint[] {
const monthlyData: {
  [key: string]: { Positive: number; Negative: number; Neutral: number };
    } = {};
    
    const validSentiments: Array<"Positive" | "Negative" | "Neutral"> = [
      "Positive",
      "Negative",
      "Neutral",
    ];

  reviews.forEach((review) => {
    if (!review.review_date) return;

    const monthKey = review.review_date.substring(0, 7);
      const sentiment = review.sentiment as "Positive" | "Negative" | "Neutral";
      
      if (!validSentiments.includes(sentiment)) {
        return;
      }

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { Positive: 0, Negative: 0, Neutral: 0 };
    }
      monthlyData[monthKey][sentiment]++;
   
  });

  const chartFormat = Object.keys(monthlyData)
    .sort()
    .map((monthKey) => ({
      month: monthKey,
      ...monthlyData[monthKey],
    }));

  return chartFormat;
}

export default groupSentimentByMonth;