import csv from "csv-parser";
import { Readable } from "stream";
import { NormalizedReview } from "@/types/analysis";

export function parseCsv(buffer: Buffer): Promise<NormalizedReview[]> {
  return new Promise((resolve, reject) => {
    const results: NormalizedReview[] = [];

    Readable.from(buffer)
      .pipe(
        csv({
          trim: true,
          headers: true,
        } as any)
      )
      .on("data", (data: any) => {
        let reviewText = "";

        reviewText = (data.review_text || data.text || "").trim();

        if (!reviewText) {
          const keys = Object.keys(data);
          let bestMatch = "";
          keys.forEach((key) => {
            const value = (data[key] || "").trim();
            if (
              value.length > bestMatch.length &&
              !key.toLowerCase().includes("id")
            ) {
              bestMatch = value;
            }
          });
          reviewText = bestMatch;
        }

        if (
          reviewText &&
          reviewText.length > 10 &&
          !reviewText.toLowerCase().includes("review")
        ) {
          results.push({
            original_text: reviewText,
            ...data,
          } as NormalizedReview);
        }
      })
      .on("end", () => {
        resolve(results);
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}
