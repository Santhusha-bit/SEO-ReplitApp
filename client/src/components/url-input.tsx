import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, Search, Star, HelpCircle } from "lucide-react";
import { EXAMPLE_URLS } from "@/lib/types";

interface UrlInputProps {
  onAnalyze: (url: string) => void;
  isAnalyzing: boolean;
}

export function UrlInput({ onAnalyze, isAnalyzing }: UrlInputProps) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      let fullUrl = url.trim();
      // Remove protocol if present and add https://
      fullUrl = fullUrl.replace(/^https?:\/\//, '');
      fullUrl = `https://${fullUrl}`;
      onAnalyze(fullUrl);
    }
  };

  const handleExampleClick = (exampleUrl: string) => {
    const fullUrl = `https://${exampleUrl}`;
    setUrl(fullUrl);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Search className="text-white w-4 h-4" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">SEO Tag Analyzer</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <HelpCircle className="w-4 h-4" />
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Star className="w-4 h-4 mr-2" />
                Upgrade
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* URL Input Form */}
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Check How Your Website Appears Online
            </h2>
            <p className="text-gray-600 mb-4">
              See exactly how your site looks in Google search results, Facebook shares, and Twitter posts
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Google Preview</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Facebook Cards</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>X Cards</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>SEO Score</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <div className="flex space-x-3">
              <div className="flex-1 relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="pl-10"
                  disabled={isAnalyzing}
                />
              </div>
              <Button 
                type="submit" 
                disabled={isAnalyzing || !url.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Search className="w-4 h-4 mr-2" />
                {isAnalyzing ? 'Analyzing...' : 'Analyze'}
              </Button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-500">Try these examples:</span>
              {EXAMPLE_URLS.map((exampleUrl) => (
                <button
                  key={exampleUrl}
                  type="button"
                  onClick={() => handleExampleClick(exampleUrl)}
                  className="text-sm text-blue-600 hover:underline"
                  disabled={isAnalyzing}
                >
                  {exampleUrl}
                </button>
              ))}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
