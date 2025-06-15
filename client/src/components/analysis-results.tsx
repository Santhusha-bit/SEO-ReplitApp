import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Tags, AlertTriangle, XCircle, Download, Share, RefreshCw, Search, Facebook, Eye, Zap } from "lucide-react";
import { PreviewTabs } from "./preview-tabs";
import type { AnalysisResult } from "@shared/schema";

interface AnalysisResultsProps {
  result: AnalysisResult;
  onReanalyze: () => void;
}

export function AnalysisResults({ result, onReanalyze }: AnalysisResultsProps) {
  const { analysis, score } = result;

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const getOverallGrade = (score: number) => {
    if (score >= 90) return { grade: 'A+', color: 'text-green-600', bg: 'bg-green-50', description: 'Excellent SEO! Your website is well-optimized.' };
    if (score >= 80) return { grade: 'A', color: 'text-green-600', bg: 'bg-green-50', description: 'Great SEO! Minor improvements can make it perfect.' };
    if (score >= 70) return { grade: 'B', color: 'text-blue-600', bg: 'bg-blue-50', description: 'Good SEO foundation with room for improvement.' };
    if (score >= 60) return { grade: 'C', color: 'text-yellow-600', bg: 'bg-yellow-50', description: 'Fair SEO. Several important tags need attention.' };
    if (score >= 40) return { grade: 'D', color: 'text-orange-600', bg: 'bg-orange-50', description: 'Poor SEO. Missing critical optimization elements.' };
    return { grade: 'F', color: 'text-red-600', bg: 'bg-red-50', description: 'Critical SEO issues. Immediate action required.' };
  };

  const gradeInfo = getOverallGrade(score.overallScore);

  return (
    <div className="space-y-8">
      {/* SEO Health Summary */}
      <Card className="shadow-lg border-0 overflow-hidden">
        <div className={`${gradeInfo.bg} border-l-4 ${gradeInfo.color.replace('text-', 'border-')} p-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`text-4xl font-bold ${gradeInfo.color}`}>{gradeInfo.grade}</div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">SEO Health Report</h2>
                  <p className="text-gray-600">{gradeInfo.description}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">{score.overallScore}<span className="text-lg text-gray-500">/100</span></div>
              <p className="text-sm text-gray-500">Overall Score</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Overview Summary */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">SEO Analysis Overview</h3>
            <div className="flex items-center space-x-4">
              {/* Large Score Display */}
              <div className="flex items-center space-x-3">
                <div className="relative w-16 h-16">
                  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-gray-200"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="transparent"
                      d="M18 3 a 15 15 0 0 1 0 30 a 15 15 0 0 1 0 -30"
                    />
                    <path
                      className={score.overallScore >= 70 ? "text-green-500" : score.overallScore >= 50 ? "text-yellow-500" : "text-red-500"}
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="transparent"
                      strokeDasharray={`${score.overallScore * 0.94}, 100`}
                      d="M18 3 a 15 15 0 0 1 0 30 a 15 15 0 0 1 0 -30"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-900">{score.overallScore}</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Overall Score</div>
                  <div className="text-xs text-gray-500">out of 100</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Analyzed:</span>
                <span className="text-sm font-medium text-gray-900">
                  {analysis.createdAt ? formatTimeAgo(new Date(analysis.createdAt)) : 'Just now'}
                </span>
              </div>
            </div>
          </div>

          {/* Category Score Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Basic SEO Category */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Search className="w-8 h-8" />
                      <div>
                        <h3 className="font-semibold text-lg">Basic SEO</h3>
                        <p className="text-blue-100 text-sm">Title & Description</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{score.categoryScores?.basicSeo || 0}/100</div>
                      <div className="text-blue-100 text-xs">
                        {(score.categoryScores?.basicSeo || 0) >= 80 ? 'Excellent' : 
                         (score.categoryScores?.basicSeo || 0) >= 60 ? 'Good' : 
                         (score.categoryScores?.basicSeo || 0) >= 40 ? 'Fair' : 'Poor'}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Title Tag</span>
                      {analysis.title ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />Present
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <XCircle className="w-3 h-3 mr-1" />Missing
                        </Badge>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Meta Description</span>
                      {analysis.description ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />Present
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <XCircle className="w-3 h-3 mr-1" />Missing
                        </Badge>
                      )}
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            (score.categoryScores?.basicSeo || 0) >= 80 ? 'bg-green-500' : 
                            (score.categoryScores?.basicSeo || 0) >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${score.categoryScores?.basicSeo || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Media Category */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Facebook className="w-8 h-8" />
                      <div>
                        <h3 className="font-semibold text-lg">Social Media</h3>
                        <p className="text-purple-100 text-sm">Open Graph & X</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{score.categoryScores?.socialMedia || 0}/100</div>
                      <div className="text-purple-100 text-xs">
                        {(score.categoryScores?.socialMedia || 0) >= 80 ? 'Excellent' : 
                         (score.categoryScores?.socialMedia || 0) >= 60 ? 'Good' : 
                         (score.categoryScores?.socialMedia || 0) >= 40 ? 'Fair' : 'Poor'}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Facebook Preview</span>
                      {analysis.ogTitle && analysis.ogDescription ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />Ready
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <AlertTriangle className="w-3 h-3 mr-1" />Incomplete
                        </Badge>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">X Preview</span>
                      {analysis.twitterCard ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />Ready
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <AlertTriangle className="w-3 h-3 mr-1" />Basic
                        </Badge>
                      )}
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            (score.categoryScores?.socialMedia || 0) >= 80 ? 'bg-green-500' : 
                            (score.categoryScores?.socialMedia || 0) >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${score.categoryScores?.socialMedia || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Search Engine Category */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Eye className="w-8 h-8" />
                      <div>
                        <h3 className="font-semibold text-lg">Search Engine</h3>
                        <p className="text-emerald-100 text-sm">Visibility & Keywords</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{score.categoryScores?.searchEngine || 0}/100</div>
                      <div className="text-emerald-100 text-xs">
                        {(score.categoryScores?.searchEngine || 0) >= 80 ? 'Excellent' : 
                         (score.categoryScores?.searchEngine || 0) >= 60 ? 'Good' : 
                         (score.categoryScores?.searchEngine || 0) >= 40 ? 'Fair' : 'Poor'}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Google Preview</span>
                      {analysis.title && analysis.description ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />Optimized
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <XCircle className="w-3 h-3 mr-1" />Missing Tags
                        </Badge>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Keywords</span>
                      {analysis.keywords ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />Present
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <AlertTriangle className="w-3 h-3 mr-1" />Optional
                        </Badge>
                      )}
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            (score.categoryScores?.searchEngine || 0) >= 80 ? 'bg-green-500' : 
                            (score.categoryScores?.searchEngine || 0) >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${score.categoryScores?.searchEngine || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <Tags className="text-blue-600 w-8 h-8 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-700">{score.tagsFound}</p>
              <p className="text-blue-600 text-sm font-medium">Tags Found</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <CheckCircle className="text-green-600 w-8 h-8 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-700">{score.tagsFound - score.missingCount - score.issuesCount}</p>
              <p className="text-green-600 text-sm font-medium">Optimized</p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
              <AlertTriangle className="text-amber-600 w-8 h-8 mx-auto mb-2" />
              <p className="text-2xl font-bold text-amber-700">{score.issuesCount}</p>
              <p className="text-amber-600 text-sm font-medium">Issues</p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <XCircle className="text-red-600 w-8 h-8 mx-auto mb-2" />
              <p className="text-2xl font-bold text-red-700">{score.missingCount}</p>
              <p className="text-red-600 text-sm font-medium">Missing</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-600 mb-2">Analyzed URL:</p>
            <p className="font-mono text-sm bg-gray-100 p-2 rounded border break-all">
              {analysis.url}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Preview Interface */}
      <PreviewTabs result={result} />

      {/* Quick Tools Section */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick SEO Tools</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="flex items-center justify-center p-4 h-auto hover:border-blue-600 hover:bg-blue-50 group"
            >
              <div className="text-center">
                <Download className="w-6 h-6 text-gray-400 group-hover:text-blue-600 mb-2 mx-auto" />
                <p className="font-medium text-gray-900">Export Report</p>
                <p className="text-sm text-gray-500">Download PDF analysis</p>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="flex items-center justify-center p-4 h-auto hover:border-blue-600 hover:bg-blue-50 group"
            >
              <div className="text-center">
                <Share className="w-6 h-6 text-gray-400 group-hover:text-blue-600 mb-2 mx-auto" />
                <p className="font-medium text-gray-900">Share Results</p>
                <p className="text-sm text-gray-500">Get shareable link</p>
              </div>
            </Button>
            
            <Button
              variant="outline"
              onClick={onReanalyze}
              className="flex items-center justify-center p-4 h-auto hover:border-blue-600 hover:bg-blue-50 group"
            >
              <div className="text-center">
                <RefreshCw className="w-6 h-6 text-gray-400 group-hover:text-blue-600 mb-2 mx-auto" />
                <p className="font-medium text-gray-900">Re-analyze</p>
                <p className="text-sm text-gray-500">Check for updates</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
