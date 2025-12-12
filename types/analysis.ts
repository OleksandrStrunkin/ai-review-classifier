export type AnalyzedReview = {
  review_id?: string;
  review_date: string;
  original_text: string;
  sentiment: "Positive" | "Negative" | "Neutral" | "Error";
  topic: "Доставка" | "Якість" | "Ціна" | "Підтримка" | "Інше" | string;
};

export type NormalizedReview = {
  review_id: string;
  review_date: string;
  original_text: string;
  [key: string]: any;
};

export type GeminiAnalysisResult = {
  sentiment: "Positive" | "Negative" | "Neutral";
  topic: "Доставка" | "Якість" | "Ціна" | "Підтримка" | "Інше";
};

export type SentimentMetric = {
  label: string;
  value: number;
  color: string;
};

export type TopicMetric = {
  topic: string;
  count: number;
};

export type SentimentTimelinePoint = {
  month: string;
  Positive: number;
  Negative: number;
  Neutral: number;
};

export type AnalysisResults = {
  totalReviews: number;
  sentimentData: SentimentMetric[];
  topicData: TopicMetric[];
  analyzedReviews: AnalyzedReview[];
  sentimentTimeline: SentimentTimelinePoint[];
};

export type UploadAreaProps = {
  onAnalyze: (file: File) => void;
  onShowExample: () => void;
  isLoading: boolean;
};
