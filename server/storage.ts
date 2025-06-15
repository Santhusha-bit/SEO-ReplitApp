import { seoAnalyses, type SeoAnalysis, type InsertSeoAnalysis } from "@shared/schema";

export interface IStorage {
  getSeoAnalysis(id: number): Promise<SeoAnalysis | undefined>;
  getSeoAnalysisByUrl(url: string): Promise<SeoAnalysis | undefined>;
  createSeoAnalysis(analysis: InsertSeoAnalysis): Promise<SeoAnalysis>;
}

export class MemStorage implements IStorage {
  private analyses: Map<number, SeoAnalysis>;
  private currentId: number;

  constructor() {
    this.analyses = new Map();
    this.currentId = 1;
  }

  async getSeoAnalysis(id: number): Promise<SeoAnalysis | undefined> {
    return this.analyses.get(id);
  }

  async getSeoAnalysisByUrl(url: string): Promise<SeoAnalysis | undefined> {
    return Array.from(this.analyses.values()).find(
      (analysis) => analysis.url === url,
    );
  }

  async createSeoAnalysis(insertAnalysis: InsertSeoAnalysis): Promise<SeoAnalysis> {
    const id = this.currentId++;
    const analysis: SeoAnalysis = { 
      ...insertAnalysis,
      title: insertAnalysis.title ?? null,
      description: insertAnalysis.description ?? null,
      keywords: insertAnalysis.keywords ?? null,
      ogTitle: insertAnalysis.ogTitle ?? null,
      ogDescription: insertAnalysis.ogDescription ?? null,
      ogImage: insertAnalysis.ogImage ?? null,
      ogSiteName: insertAnalysis.ogSiteName ?? null,
      twitterCard: insertAnalysis.twitterCard ?? null,
      twitterTitle: insertAnalysis.twitterTitle ?? null,
      twitterDescription: insertAnalysis.twitterDescription ?? null,
      twitterImage: insertAnalysis.twitterImage ?? null,
      id, 
      createdAt: new Date() 
    };
    this.analyses.set(id, analysis);
    return analysis;
  }
}

export const storage = new MemStorage();
