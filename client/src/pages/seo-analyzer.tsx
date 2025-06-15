import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { LoaderIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { UrlInput } from "@/components/url-input";
import { AnalysisResults } from "@/components/analysis-results";
import { apiRequest } from "@/lib/queryClient";
import type { AnalysisResult } from "@shared/schema";

export default function SeoAnalyzer() {
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string>("");
  const { toast } = useToast();

  const analyzeMutation = useMutation({
    mutationFn: async (url: string) => {
      const response = await apiRequest("POST", "/api/analyze", { url });
      return response.json();
    },
    onSuccess: (data: AnalysisResult) => {
      setCurrentAnalysis(data);
      toast({
        title: "Analysis Complete",
        description: `Successfully analyzed ${data.analysis.url}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze the website. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAnalyze = (url: string) => {
    setCurrentUrl(url);
    setCurrentAnalysis(null);
    analyzeMutation.mutate(url);
  };

  const handleReanalyze = () => {
    if (currentUrl) {
      analyzeMutation.mutate(currentUrl);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <UrlInput onAnalyze={handleAnalyze} isAnalyzing={analyzeMutation.isPending} />

        {/* Loading State */}
        {analyzeMutation.isPending && (
          <Card className="shadow-sm">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-full mb-4">
                  <LoaderIcon className="w-6 h-6 text-blue-600 animate-spin" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Analyzing Website...</h3>
                <p className="text-gray-600">Fetching HTML and extracting SEO tags</p>
                <div className="mt-4 w-64 mx-auto bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full transition-all duration-300 animate-pulse" style={{ width: '65%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analysis Results */}
        {currentAnalysis && !analyzeMutation.isPending && (
          <AnalysisResults result={currentAnalysis} onReanalyze={handleReanalyze} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <i className="fas fa-search text-white text-xs"></i>
              </div>
              <span className="font-semibold text-gray-900">SEO Tag Analyzer</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <a href="#" className="hover:text-gray-900">Privacy Policy</a>
              <a href="#" className="hover:text-gray-900">Terms of Service</a>
              <a href="#" className="hover:text-gray-900">API Documentation</a>
              <a href="#" className="hover:text-gray-900">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
