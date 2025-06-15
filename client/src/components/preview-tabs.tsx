import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search, Facebook, Code, Lightbulb, CheckCircle, AlertTriangle, XCircle, Info, X } from "lucide-react";
import type { AnalysisResult } from "@shared/schema";

interface PreviewTabsProps {
  result: AnalysisResult;
}

export function PreviewTabs({ result }: PreviewTabsProps) {
  const [activeTab, setActiveTab] = useState('google');
  const { analysis, score, recommendations } = result;

  const tabs = [
    { id: 'google', label: 'Google Preview', icon: Search },
    { id: 'facebook', label: 'Facebook', icon: Facebook },
    { id: 'twitter', label: 'X (Twitter)', icon: X },
    { id: 'details', label: 'Tag Details', icon: Code },
    { id: 'recommendations', label: 'Recommendations', icon: Lightbulb },
  ];

  const getStatusBadge = (present: boolean, optimal: boolean = true) => {
    if (!present) {
      return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Missing</Badge>;
    }
    if (!optimal) {
      return <Badge variant="secondary"><AlertTriangle className="w-3 h-3 mr-1" />Warning</Badge>;
    }
    return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Good</Badge>;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'medium': return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'low': return <Lightbulb className="w-4 h-4 text-green-600" />;
      default: return <Info className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <Card className="shadow-sm">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <CardContent className="p-6">
        {activeTab === 'google' && (
          <div>
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Google Search Results Preview</h4>
              <p className="text-gray-600 text-sm mb-3">This is exactly how your website appears when people search for it on Google. The title and description directly impact whether users click on your site.</p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-white text-xs font-bold">i</span>
                  </div>
                  <div className="text-sm text-blue-800">
                    <strong>Why this matters:</strong> A compelling title and description can increase your click-through rate by up to 30%. Make sure they accurately describe your content and include relevant keywords.
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
              <div className="max-w-2xl">
                <div className="mb-2">
                  <div className="flex items-center space-x-2 text-sm mb-1">
                    <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                    <span className="text-green-700 font-medium">{new URL(analysis.url).hostname}</span>
                    <span className="text-gray-500">›</span>
                    <span className="text-gray-500 text-xs">{new URL(analysis.url).pathname}</span>
                  </div>
                  <div className="text-gray-500 text-xs mb-2">{analysis.url}</div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-blue-600 text-xl hover:underline cursor-pointer font-normal leading-tight">
                    {analysis.title || 'No title found - This will appear as the clickable link in search results'}
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {analysis.description || 'No meta description found - This text appears below the title in search results and influences click-through rates.'}
                  </p>
                </div>
                <div className="mt-3 flex items-center space-x-4 text-xs text-gray-500">
                  <span>About this result</span>
                  <span>•</span>
                  <span>Feedback</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">Title Tag</span>
                  {getStatusBadge(!!analysis.title, analysis.title ? analysis.title.length <= 60 : false)}
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {analysis.title ? `${analysis.title.length} characters` : '0 characters'} (Optimal: 50-60)
                </p>
                <Progress 
                  value={analysis.title ? Math.min((analysis.title.length / 60) * 100, 100) : 0} 
                  className="w-full h-2"
                />
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">Meta Description</span>
                  {getStatusBadge(!!analysis.description, analysis.description ? analysis.description.length <= 160 : false)}
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {analysis.description ? `${analysis.description.length} characters` : '0 characters'} (Optimal: 120-160)
                </p>
                <Progress
                  value={analysis.description ? Math.min((analysis.description.length / 160) * 100, 100) : 0}
                  className="w-full h-2"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'facebook' && (
          <div>
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Facebook Share Preview</h4>
              <p className="text-gray-600 text-sm mb-3">When someone shares your website on Facebook, this is how it appears in their feed. A good preview encourages more clicks and engagement.</p>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                  <div className="text-sm text-purple-800">
                    <strong>Pro tip:</strong> Facebook uses Open Graph tags (og:title, og:description, og:image) to create these previews. Without them, Facebook might choose random content from your page.
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 rounded-lg p-6 mb-6">
              <div className="max-w-lg mx-auto">
                {/* Facebook Post Header */}
                <div className="bg-white rounded-t-lg p-3 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">U</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">User Name</div>
                      <div className="text-gray-500 text-xs">Just now • 🌐</div>
                    </div>
                  </div>
                  <div className="mt-3 text-gray-800 text-sm">
                    Check out this website: {analysis.url}
                  </div>
                </div>
                
                {/* Facebook Link Preview */}
                <div className="bg-white border border-gray-200 overflow-hidden">
                  {analysis.ogImage && (
                    <div className="relative">
                      <img 
                        src={analysis.ogImage} 
                        alt="Open Graph" 
                        className="w-full h-64 object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  {!analysis.ogImage && (
                    <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                      <div className="text-gray-400 text-center">
                        <div className="text-4xl mb-2">🖼️</div>
                        <div className="text-sm">No og:image found</div>
                      </div>
                    </div>
                  )}
                  <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <div className="text-xs text-gray-500 uppercase mb-1">
                      {new URL(analysis.url).hostname}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 leading-tight text-lg">
                      {analysis.ogTitle || analysis.title || 'Missing og:title - Will use page title as fallback'}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {analysis.ogDescription || analysis.description || 'Missing og:description - Add this tag to control how your content appears when shared on Facebook'}
                    </p>
                  </div>
                </div>
                
                {/* Facebook Engagement */}
                <div className="bg-white rounded-b-lg p-3 border-t border-gray-200">
                  <div className="flex items-center justify-between text-gray-500 text-sm">
                    <div className="flex items-center space-x-4">
                      <span>👍 Like</span>
                      <span>💬 Comment</span>
                      <span>↗️ Share</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">og:title</span>
                  {getStatusBadge(!!analysis.ogTitle)}
                </div>
                <p className="text-xs text-gray-600">
                  {analysis.ogTitle ? 'Title displays correctly' : 'Using page title as fallback'}
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">og:description</span>
                  {getStatusBadge(!!analysis.ogDescription)}
                </div>
                <p className="text-xs text-gray-600">
                  {analysis.ogDescription ? 'Description is optimal' : 'Using meta description as fallback'}
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">og:image</span>
                  {getStatusBadge(!!analysis.ogImage)}
                </div>
                <p className="text-xs text-gray-600">
                  {analysis.ogImage ? 'Image is present' : 'No image specified'}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'twitter' && (
          <div>
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">X Card Preview</h4>
              <p className="text-gray-600 text-sm mb-3">This shows how your website looks when shared on X (formerly Twitter). X Cards make your links more engaging and can significantly increase click-through rates.</p>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <div className="w-5 h-5 bg-slate-500 rounded-full flex items-center justify-center mt-0.5">
                    <X className="text-white w-3 h-3" />
                  </div>
                  <div className="text-sm text-slate-800">
                    <strong>X Cards:</strong> Use twitter:card, twitter:title, and twitter:image tags for better control. Without them, X falls back to Open Graph tags or basic link previews.
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-black rounded-lg p-6 mb-6">
              <div className="max-w-lg mx-auto">
                {/* Twitter/X Post Header */}
                <div className="bg-black text-white p-3 rounded-t-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">U</span>
                    </div>
                    <div>
                      <div className="font-semibold text-white text-sm">User Name</div>
                      <div className="text-gray-400 text-xs">@username • now</div>
                    </div>
                  </div>
                  <div className="text-white text-sm mb-3">
                    Check out this interesting website: {analysis.url || ''}
                  </div>
                </div>
                
                {/* Twitter Card */}
                <div className="bg-white border border-gray-700 overflow-hidden rounded-b-lg">
                  {(analysis.twitterImage || analysis.ogImage) && (
                    <div className="relative">
                      <img 
                        src={analysis.twitterImage || analysis.ogImage} 
                        alt="Twitter Card" 
                        className="w-full h-56 object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  {!(analysis.twitterImage || analysis.ogImage) && (
                    <div className="w-full h-56 bg-gray-100 flex items-center justify-center border-b border-gray-200">
                      <div className="text-gray-400 text-center">
                        <div className="text-4xl mb-2">🖼️</div>
                        <div className="text-sm">No twitter:image or og:image found</div>
                      </div>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 leading-tight text-base">
                      {analysis.twitterTitle || analysis.ogTitle || analysis.title || 'Missing twitter:title - Add this tag for better Twitter sharing'}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {analysis.twitterDescription || analysis.ogDescription || analysis.description || 'Missing twitter:description - Add this tag to control how your content appears on Twitter/X'}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <span>🔗</span>
                      <span className="ml-1">{new URL(analysis.url).hostname}</span>
                    </div>
                  </div>
                </div>
                
                {/* Twitter Engagement */}
                <div className="bg-black text-white p-3 rounded-b-lg">
                  <div className="flex items-center justify-between text-gray-400 text-sm">
                    <div className="flex items-center space-x-6">
                      <span>💬 Reply</span>
                      <span>🔄 Repost</span>
                      <span>❤️ Like</span>
                      <span>📤 Share</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">twitter:card</span>
                  {getStatusBadge(!!analysis.twitterCard)}
                </div>
                <p className="text-xs text-gray-600">
                  {analysis.twitterCard ? `Using ${analysis.twitterCard}` : 'No card type specified'}
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">twitter:title</span>
                  {getStatusBadge(!!analysis.twitterTitle)}
                </div>
                <p className="text-xs text-gray-600">
                  {analysis.twitterTitle ? 'Title is properly set' : 'Using fallback title'}
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">twitter:image</span>
                  {getStatusBadge(!!(analysis.twitterImage || analysis.ogImage))}
                </div>
                <p className="text-xs text-gray-600">
                  {analysis.twitterImage ? 'Image meets requirements' : analysis.ogImage ? 'Using OG image' : 'No image specified'}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'details' && (
          <div>
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Detailed Tag Analysis</h4>
              <p className="text-gray-600 text-sm">Complete breakdown of all detected SEO tags</p>
            </div>

            <div className="space-y-4">
              {/* Title Tag */}
              <div className={`border rounded-lg p-4 ${analysis.title ? 'border-gray-200' : 'border-red-200 bg-red-50'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(!!analysis.title)}
                    <h5 className="font-medium text-gray-900">&lt;title&gt;</h5>
                  </div>
                  <span className="text-xs text-gray-500">Critical</span>
                </div>
                {analysis.title ? (
                  <>
                    <div className="bg-gray-50 rounded p-3 mb-3">
                      <code className="text-sm text-gray-800">{analysis.title}</code>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>
                        <strong>Length:</strong> {analysis.title.length} characters ({analysis.title.length >= 30 && analysis.title.length <= 60 ? 'Optimal' : analysis.title.length > 60 ? 'Too long' : 'Too short'})
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-gray-600">
                    <p>No title tag found. This is critical for SEO.</p>
                  </div>
                )}
              </div>

              {/* Meta Description */}
              <div className={`border rounded-lg p-4 ${analysis.description ? 'border-gray-200' : 'border-red-200 bg-red-50'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(!!analysis.description)}
                    <h5 className="font-medium text-gray-900">&lt;meta name="description"&gt;</h5>
                  </div>
                  <span className="text-xs text-gray-500">Critical</span>
                </div>
                {analysis.description ? (
                  <>
                    <div className="bg-gray-50 rounded p-3 mb-3">
                      <code className="text-sm text-gray-800">{analysis.description}</code>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>
                        <strong>Length:</strong> {analysis.description.length} characters ({analysis.description.length >= 120 && analysis.description.length <= 160 ? 'Optimal' : analysis.description.length > 160 ? 'Too long' : 'Too short'})
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-gray-600">
                    <p>No meta description found. This is critical for SEO.</p>
                  </div>
                )}
              </div>

              {/* Open Graph Tags */}
              {(analysis.ogTitle || analysis.ogDescription || analysis.ogImage) && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Badge variant="default" className="bg-blue-100 text-blue-800"><Info className="w-3 h-3 mr-1" />Open Graph</Badge>
                      <h5 className="font-medium text-gray-900">Social Media Tags</h5>
                    </div>
                    <span className="text-xs text-gray-500">Important</span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    {analysis.ogTitle && <p><strong>og:title:</strong> {analysis.ogTitle}</p>}
                    {analysis.ogDescription && <p><strong>og:description:</strong> {analysis.ogDescription}</p>}
                    {analysis.ogImage && <p><strong>og:image:</strong> {analysis.ogImage}</p>}
                    {analysis.ogSiteName && <p><strong>og:site_name:</strong> {analysis.ogSiteName}</p>}
                  </div>
                </div>
              )}

              {/* Keywords */}
              <div className={`border rounded-lg p-4 ${analysis.keywords ? 'border-gray-200' : 'border-amber-200 bg-amber-50'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(!!analysis.keywords)}
                    <h5 className="font-medium text-gray-900">&lt;meta name="keywords"&gt;</h5>
                  </div>
                  <span className="text-xs text-gray-500">Low</span>
                </div>
                {analysis.keywords ? (
                  <div className="bg-gray-50 rounded p-3 mb-3">
                    <code className="text-sm text-gray-800">{analysis.keywords}</code>
                  </div>
                ) : (
                  <div className="text-sm text-gray-600">
                    <p>While not critical for modern SEO, keywords meta tag can still provide context for search engines.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div>
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">SEO Recommendations</h4>
              <p className="text-gray-600 text-sm">Actionable insights to improve your website's SEO performance</p>
            </div>

            <div className="space-y-6">
              {['high', 'medium', 'low'].map((priority) => {
                const priorityRecommendations = recommendations.filter(r => r.priority === priority);
                if (priorityRecommendations.length === 0) return null;

                return (
                  <div key={priority}>
                    <h5 className="font-medium text-gray-900 mb-4 flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-2 ${getPriorityColor(priority)}`}></span>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
                    </h5>
                    <div className="space-y-3">
                      {priorityRecommendations.map((recommendation) => (
                        <div key={recommendation.id} className={`border rounded-lg p-4 ${
                          priority === 'high' ? 'border-red-200 bg-red-50' :
                          priority === 'medium' ? 'border-amber-200 bg-amber-50' :
                          'border-green-200 bg-green-50'
                        }`}>
                          <div className="flex items-start space-x-3">
                            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${
                              priority === 'high' ? 'bg-red-100' :
                              priority === 'medium' ? 'bg-amber-100' :
                              'bg-green-100'
                            }`}>
                              {getPriorityIcon(priority)}
                            </div>
                            <div className="flex-1">
                              <h6 className={`font-medium mb-1 ${
                                priority === 'high' ? 'text-red-900' :
                                priority === 'medium' ? 'text-amber-900' :
                                'text-green-900'
                              }`}>
                                {recommendation.title}
                              </h6>
                              <p className={`text-sm mb-2 ${
                                priority === 'high' ? 'text-red-700' :
                                priority === 'medium' ? 'text-amber-700' :
                                'text-green-700'
                              }`}>
                                {recommendation.description}
                              </p>
                              <p className={`text-xs font-medium ${
                                priority === 'high' ? 'text-red-600' :
                                priority === 'medium' ? 'text-amber-600' :
                                'text-green-600'
                              }`}>
                                {recommendation.suggestion}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
