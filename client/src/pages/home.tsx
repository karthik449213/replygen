import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Copy, Mail, Palette, Zap, Shield, Brain, RefreshCw, Loader2, CheckCircle } from "lucide-react";

const TONE_OPTIONS = [
  { value: "professional", label: "📋 Professional - Formal and business-appropriate", emoji: "📋" },
  { value: "friendly", label: "😊 Friendly - Warm and approachable", emoji: "😊" },
  { value: "apologetic", label: "🙏 Apologetic - Expressing regret or understanding", emoji: "🙏" },
  { value: "enthusiastic", label: "🎉 Enthusiastic - Positive and energetic", emoji: "🎉" },
  { value: "concise", label: "⚡ Concise - Brief and to the point", emoji: "⚡" },
  { value: "detailed", label: "📝 Detailed - Comprehensive and thorough", emoji: "📝" },
  { value: "diplomatic", label: "🤝 Diplomatic - Tactful and careful", emoji: "🤝" },
];

interface GenerateReplyRequest {
  email: string;
  tone: string;
}

interface GenerateReplyResponse {
  reply: string;
  stats: {
    words: number;
    characters: number;
    generationTime: string;
  };
}

export default function Home() {
  const [emailContent, setEmailContent] = useState("");
  const [selectedTone, setSelectedTone] = useState("");
  const [generatedReply, setGeneratedReply] = useState("");
  const [replyStats, setReplyStats] = useState<GenerateReplyResponse["stats"] | null>(null);
  const [showReply, setShowReply] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generateMutation = useMutation({
    mutationFn: async (data: GenerateReplyRequest): Promise<GenerateReplyResponse> => {
      const response = await apiRequest("POST", "/api/generate-reply", data);
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedReply(data.reply);
      setReplyStats(data.stats);
      setShowReply(true);
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate reply. Please try again.",
        variant: "destructive",
      });
    },
  });

  const isFormValid = emailContent.trim().length > 10 && selectedTone !== "";
  const charCount = emailContent.length;

  const handleGenerate = () => {
    if (!isFormValid) return;
    generateMutation.mutate({ email: emailContent, tone: selectedTone });
  };

  const handleRegenerate = () => {
    if (isFormValid) {
      handleGenerate();
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedReply);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Reply copied to clipboard successfully.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStepClass = (step: number) => {
    const hasEmail = emailContent.trim().length > 10;
    const hasTone = selectedTone !== "";
    
    let isActive = false;
    if (step === 1) isActive = true;
    if (step === 2) isActive = hasEmail;
    if (step === 3) isActive = hasEmail && hasTone;

    return isActive ? "text-blue-600" : "text-slate-400";
  };

  const getStepCircleClass = (step: number) => {
    const hasEmail = emailContent.trim().length > 10;
    const hasTone = selectedTone !== "";
    
    let isActive = false;
    if (step === 1) isActive = true;
    if (step === 2) isActive = hasEmail;
    if (step === 3) isActive = hasEmail && hasTone;

    return isActive 
      ? "w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium"
      : "w-6 h-6 bg-slate-200 text-slate-400 rounded-full flex items-center justify-center text-xs font-medium";
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans antialiased">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 rounded-lg p-2">
                <Mail className="text-white w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">ReplyGen</h1>
                <p className="text-sm text-slate-500">AI Email Reply Generator</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-4">
              <span className="text-sm text-slate-600 flex items-center">
                <Shield className="text-green-500 w-4 h-4 mr-1" />
                No signup required
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Generate Professional Email Replies in Seconds
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Paste any email, choose your tone, and get AI-powered replies that sound natural and professional. Perfect for busy professionals, freelancers, and students.
          </p>
        </div>

        {/* Main Application */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Step Indicators */}
          <div className="border-b border-slate-200 px-6 py-4">
            <div className="flex items-center justify-between text-sm">
              <div className={`flex items-center space-x-2 ${getStepClass(1)}`}>
                <div className={getStepCircleClass(1)}>1</div>
                <span className="font-medium">Paste Email</span>
              </div>
              <div className="flex-1 h-px bg-slate-200 mx-4"></div>
              <div className={`flex items-center space-x-2 ${getStepClass(2)}`}>
                <div className={getStepCircleClass(2)}>2</div>
                <span>Select Tone</span>
              </div>
              <div className="flex-1 h-px bg-slate-200 mx-4"></div>
              <div className={`flex items-center space-x-2 ${getStepClass(3)}`}>
                <div className={getStepCircleClass(3)}>3</div>
                <span>Generate Reply</span>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Email Input Section */}
            <div>
              <label htmlFor="email-input" className="block text-sm font-medium text-slate-700 mb-2">
                <Mail className="inline w-4 h-4 text-slate-400 mr-2" />
                Paste the email you want to reply to
              </label>
              <div className="relative">
                <Textarea
                  id="email-input"
                  placeholder="Hi Sarah,

I hope this email finds you well. I wanted to follow up on our discussion about the project timeline. Could we schedule a quick call this week to go over the details?

Best regards,
John"
                  className="w-full h-40 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                />
                <div className="absolute bottom-3 right-3 text-xs text-slate-400">
                  {charCount} characters
                </div>
              </div>
              <p className="mt-2 text-xs text-slate-500 flex items-center">
                <Shield className="w-3 h-3 mr-1" />
                Your email content is processed locally and not stored anywhere.
              </p>
            </div>

            {/* Tone Selection */}
            <div>
              <label htmlFor="tone-select" className="block text-sm font-medium text-slate-700 mb-2">
                <Palette className="inline w-4 h-4 text-slate-400 mr-2" />
                Choose reply tone
              </label>
              <Select value={selectedTone} onValueChange={setSelectedTone}>
                <SelectTrigger className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                  <SelectValue placeholder="Select a tone..." />
                </SelectTrigger>
                <SelectContent>
                  {TONE_OPTIONS.map((tone) => (
                    <SelectItem key={tone.value} value={tone.value}>
                      {tone.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Generate Button */}
            <div className="flex items-center justify-center pt-2">
              <Button
                onClick={handleGenerate}
                disabled={!isFormValid || generateMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-lg transition duration-200 flex items-center space-x-2 disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                {generateMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Zap className="w-4 h-4" />
                )}
                <span>{generateMutation.isPending ? "Generating..." : "Generate Reply"}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Loading Section */}
        {generateMutation.isPending && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full mb-4">
                <Loader2 className="text-amber-600 w-6 h-6 animate-spin" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Generating your reply...</h3>
              <p className="text-slate-600 text-sm">AI is crafting the perfect response for you</p>
              <div className="mt-4 bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full animate-pulse w-3/5"></div>
              </div>
            </div>
          </div>
        )}

        {/* Generated Reply Section */}
        {showReply && !generateMutation.isPending && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="border-b border-slate-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                  <Mail className="text-blue-600 w-5 h-5 mr-2" />
                  Generated Reply
                </h3>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRegenerate}
                    disabled={!isFormValid || generateMutation.isPending}
                    className="text-slate-500 hover:text-slate-700 text-sm flex items-center space-x-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Regenerate</span>
                  </Button>
                  <Button
                    onClick={copyToClipboard}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-4 py-2 rounded-md flex items-center space-x-2 transition duration-200"
                  >
                    {copied ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copied ? "Copied!" : "Copy Reply"}</span>
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div className="text-sm text-slate-700 whitespace-pre-wrap">
                  {generatedReply}
                </div>
              </div>
              
              {/* Reply Stats */}
              {replyStats && (
                <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center space-x-4">
                    <span>{replyStats.words} words</span>
                    <span>{replyStats.characters} characters</span>
                  </div>
                  <span>Generated in {replyStats.generationTime}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
              <Zap className="text-blue-600 w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Lightning Fast</h3>
            <p className="text-slate-600 text-sm">Generate professional replies in under 3 seconds. No waiting, no delays.</p>
          </div>

          <div className="text-center p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
              <Shield className="text-green-600 w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Privacy First</h3>
            <p className="text-slate-600 text-sm">No accounts, no data storage. Your emails stay private and secure.</p>
          </div>

          <div className="text-center p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
              <Brain className="text-purple-600 w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">AI Powered</h3>
            <p className="text-slate-600 text-sm">Advanced AI understands context and generates human-like responses.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="bg-blue-600 rounded-lg p-2">
                <Mail className="text-white w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">ReplyGen</p>
                <p className="text-xs text-slate-500">Powered by DeepSeek AI</p>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-sm text-slate-500">
              <a href="#" className="hover:text-slate-700">Privacy Policy</a>
              <a href="#" className="hover:text-slate-700">Terms of Service</a>
              <a href="#" className="hover:text-slate-700">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
