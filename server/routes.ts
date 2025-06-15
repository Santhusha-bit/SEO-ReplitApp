import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { urlAnalysisSchema, insertSeoAnalysisSchema, type AnalysisResult, type SeoRecommendation } from "@shared/schema";
import { z } from "zod";
import axios from "axios";
import * as cheerio from "cheerio";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Analyze URL endpoint
  app.post("/api/analyze", async (req, res) => {
    try {
      const { url } = urlAnalysisSchema.parse(req.body);
      
      // Fetch the HTML content
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      const html = response.data;
      const $ = cheerio.load(html);
      
      // Extract SEO tags
      const title = $('title').text().trim() || null;
      const description = $('meta[name="description"]').attr('content') || null;
      const keywords = $('meta[name="keywords"]').attr('content') || null;
      
      // Open Graph tags
      const ogTitle = $('meta[property="og:title"]').attr('content') || null;
      const ogDescription = $('meta[property="og:description"]').attr('content') || null;
      const ogImage = $('meta[property="og:image"]').attr('content') || null;
      const ogSiteName = $('meta[property="og:site_name"]').attr('content') || null;
      
      // Twitter Card tags
      const twitterCard = $('meta[name="twitter:card"]').attr('content') || null;
      const twitterTitle = $('meta[name="twitter:title"]').attr('content') || null;
      const twitterDescription = $('meta[name="twitter:description"]').attr('content') || null;
      const twitterImage = $('meta[name="twitter:image"]').attr('content') || null;
      
      // Create analysis object
      const analysisData = {
        url,
        title,
        description,
        keywords,
        ogTitle,
        ogDescription,
        ogImage,
        ogSiteName,
        twitterCard,
        twitterTitle,
        twitterDescription,
        twitterImage,
      };
      
      // Validate and store analysis
      const validatedAnalysis = insertSeoAnalysisSchema.parse(analysisData);
      const analysis = await storage.createSeoAnalysis(validatedAnalysis);
      
      // Calculate SEO score
      const score = calculateSeoScore(analysis);
      
      // Generate recommendations
      const recommendations = generateRecommendations(analysis);
      
      const result: AnalysisResult = {
        analysis,
        score,
        recommendations,
      };
      
      res.json(result);
      
    } catch (error) {
      console.error('Analysis error:', error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid request data", 
          errors: error.errors 
        });
      }
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          return res.status(408).json({ 
            message: "Request timeout - the website took too long to respond" 
          });
        }
        if (error.response?.status === 404) {
          return res.status(404).json({ 
            message: "Website not found - please check the URL" 
          });
        }
        return res.status(500).json({ 
          message: "Failed to fetch website - please check the URL and try again" 
        });
      }
      
      res.status(500).json({ 
        message: "An error occurred while analyzing the website" 
      });
    }
  });
  
  // Get analysis by ID
  app.get("/api/analysis/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const analysis = await storage.getSeoAnalysis(id);
      
      if (!analysis) {
        return res.status(404).json({ message: "Analysis not found" });
      }
      
      const score = calculateSeoScore(analysis);
      const recommendations = generateRecommendations(analysis);
      
      const result: AnalysisResult = {
        analysis,
        score,
        recommendations,
      };
      
      res.json(result);
    } catch (error) {
      console.error('Get analysis error:', error);
      res.status(500).json({ message: "Failed to retrieve analysis" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function calculateSeoScore(analysis: any) {
  let score = 0;
  let tagsFound = 0;
  let issuesCount = 0;
  let missingCount = 0;
  
  // Category scores
  let basicSeoScore = 0;
  let socialMediaScore = 0;
  let searchEngineScore = 0;
  
  // Basic SEO (Title & Description) - 40 points total
  if (analysis.title) {
    tagsFound++;
    searchEngineScore += 10;
    if (analysis.title.length >= 30 && analysis.title.length <= 60) {
      score += 20;
      basicSeoScore += 20;
    } else if (analysis.title.length > 60) {
      score += 10;
      basicSeoScore += 10;
      issuesCount++;
    } else {
      score += 5;
      basicSeoScore += 5;
      issuesCount++;
    }
  } else {
    missingCount++;
  }
  
  if (analysis.description) {
    tagsFound++;
    searchEngineScore += 10;
    if (analysis.description.length >= 120 && analysis.description.length <= 160) {
      score += 20;
      basicSeoScore += 20;
    } else if (analysis.description.length > 160) {
      score += 10;
      basicSeoScore += 10;
      issuesCount++;
    } else {
      score += 5;
      basicSeoScore += 5;
      issuesCount++;
    }
  } else {
    missingCount++;
  }
  
  // Open Graph tags (Social Media) - 40 points total
  if (analysis.ogTitle) {
    tagsFound++;
    score += 15;
    socialMediaScore += 15;
  } else {
    missingCount++;
  }
  
  if (analysis.ogDescription) {
    tagsFound++;
    score += 10;
    socialMediaScore += 10;
  } else {
    missingCount++;
  }
  
  if (analysis.ogImage) {
    tagsFound++;
    score += 15;
    socialMediaScore += 15;
  } else {
    missingCount++;
  }
  
  // Twitter Card tags - 20 points total
  if (analysis.twitterCard) {
    tagsFound++;
    score += 10;
    socialMediaScore += 10;
  }
  
  if (analysis.twitterTitle) {
    tagsFound++;
    score += 5;
    socialMediaScore += 5;
  }
  
  if (analysis.twitterImage) {
    tagsFound++;
    score += 5;
    socialMediaScore += 5;
  }
  
  // Keywords (bonus)
  if (analysis.keywords) {
    tagsFound++;
    searchEngineScore += 5;
  }
  
  return {
    overallScore: Math.min(score, 100),
    tagsFound,
    issuesCount,
    missingCount,
    categoryScores: {
      basicSeo: Math.round((Math.min(basicSeoScore, 40) / 40) * 100),
      socialMedia: Math.round((Math.min(socialMediaScore, 50) / 50) * 100),
      searchEngine: Math.round((Math.min(searchEngineScore, 25) / 25) * 100)
    }
  };
}

function generateRecommendations(analysis: any): SeoRecommendation[] {
  const recommendations: SeoRecommendation[] = [];
  
  // High priority recommendations
  if (!analysis.title) {
    recommendations.push({
      id: 'missing-title',
      priority: 'high',
      title: 'Add Title Tag',
      description: 'Your page is missing a title tag, which is critical for SEO and user experience.',
      suggestion: 'Add: <title>Your Page Title</title>',
      tag: 'title'
    });
  } else if (analysis.title.length > 60) {
    recommendations.push({
      id: 'title-too-long',
      priority: 'high',
      title: 'Shorten Title Tag',
      description: `Your title tag is ${analysis.title.length} characters long. Keep it under 60 characters to prevent truncation in search results.`,
      suggestion: 'Reduce title length to 50-60 characters',
      tag: 'title'
    });
  } else if (analysis.title.length < 30) {
    recommendations.push({
      id: 'title-too-short',
      priority: 'medium',
      title: 'Expand Title Tag',
      description: `Your title tag is only ${analysis.title.length} characters. Consider adding more descriptive keywords.`,
      suggestion: 'Expand title to 30-60 characters with relevant keywords',
      tag: 'title'
    });
  }
  
  if (!analysis.description) {
    recommendations.push({
      id: 'missing-description',
      priority: 'high',
      title: 'Add Meta Description',
      description: 'Your page is missing a meta description, which is essential for search engine results.',
      suggestion: 'Add: <meta name="description" content="Your page description">',
      tag: 'description'
    });
  } else if (analysis.description.length > 160) {
    recommendations.push({
      id: 'description-too-long',
      priority: 'medium',
      title: 'Shorten Meta Description',
      description: `Your meta description is ${analysis.description.length} characters long. Keep it under 160 characters.`,
      suggestion: 'Reduce description length to 120-160 characters',
      tag: 'description'
    });
  }
  
  if (!analysis.ogImage) {
    recommendations.push({
      id: 'missing-og-image',
      priority: 'high',
      title: 'Add Open Graph Image',
      description: 'Your page is missing an og:image tag, which is essential for proper social media sharing.',
      suggestion: 'Add: <meta property="og:image" content="your-image-url.jpg">',
      tag: 'og:image'
    });
  }
  
  // Medium priority recommendations
  if (!analysis.ogTitle) {
    recommendations.push({
      id: 'missing-og-title',
      priority: 'medium',
      title: 'Add Open Graph Title',
      description: 'Add an og:title tag to control how your page title appears when shared on social media.',
      suggestion: 'Add: <meta property="og:title" content="Your Social Title">',
      tag: 'og:title'
    });
  }
  
  if (!analysis.ogDescription) {
    recommendations.push({
      id: 'missing-og-description',
      priority: 'medium',
      title: 'Add Open Graph Description',
      description: 'Add an og:description tag to control how your page description appears on social media.',
      suggestion: 'Add: <meta property="og:description" content="Your social description">',
      tag: 'og:description'
    });
  }
  
  if (!analysis.twitterCard) {
    recommendations.push({
      id: 'missing-twitter-card',
      priority: 'medium',
      title: 'Add Twitter Card Type',
      description: 'Add a twitter:card tag to control how your page appears when shared on Twitter.',
      suggestion: 'Add: <meta name="twitter:card" content="summary_large_image">',
      tag: 'twitter:card'
    });
  }
  
  // Low priority recommendations
  if (!analysis.keywords) {
    recommendations.push({
      id: 'missing-keywords',
      priority: 'low',
      title: 'Consider Adding Keywords Meta Tag',
      description: 'While not critical for modern SEO, a keywords meta tag can provide additional context.',
      suggestion: 'Add: <meta name="keywords" content="keyword1, keyword2, keyword3">',
      tag: 'keywords'
    });
  }
  
  return recommendations;
}
