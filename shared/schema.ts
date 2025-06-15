import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const seoAnalyses = pgTable("seo_analyses", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  title: text("title"),
  description: text("description"),
  keywords: text("keywords"),
  ogTitle: text("og_title"),
  ogDescription: text("og_description"),
  ogImage: text("og_image"),
  ogSiteName: text("og_site_name"),
  twitterCard: text("twitter_card"),
  twitterTitle: text("twitter_title"),
  twitterDescription: text("twitter_description"),
  twitterImage: text("twitter_image"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSeoAnalysisSchema = createInsertSchema(seoAnalyses).omit({
  id: true,
  createdAt: true,
});

export const urlAnalysisSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
});

export type InsertSeoAnalysis = z.infer<typeof insertSeoAnalysisSchema>;
export type SeoAnalysis = typeof seoAnalyses.$inferSelect;
export type UrlAnalysisRequest = z.infer<typeof urlAnalysisSchema>;

// Additional types for the analysis results
export const seoScoreSchema = z.object({
  overallScore: z.number().min(0).max(100),
  tagsFound: z.number(),
  issuesCount: z.number(),
  missingCount: z.number(),
  categoryScores: z.object({
    basicSeo: z.number().min(0).max(100),
    socialMedia: z.number().min(0).max(100),
    searchEngine: z.number().min(0).max(100),
  }).optional(),
});

export type SeoScore = z.infer<typeof seoScoreSchema>;

export interface SeoRecommendation {
  id: string;
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  suggestion: string;
  tag?: string;
}

export interface AnalysisResult {
  analysis: SeoAnalysis;
  score: SeoScore;
  recommendations: SeoRecommendation[];
}
