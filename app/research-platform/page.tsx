"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import {
  Search,
  Filter,
  BookOpen,
  Database,
  BarChart3,
  Download,
  Share2,
  Bookmark,
  Dna,
  Microscope,
  TrendingUp,
  Globe,
  Star,
  Clock,
  Tag,
  ArrowUpRight,
  ChevronRight,
  SortAsc,
  Mic,
  Activity,
  Zap,
} from "lucide-react"
import { useState, useRef } from "react"
import Link from "next/link"
import PageWrapper from "@/components/page-wrapper"

export default function ResearchPlatformPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("search")
  const [isListening, setIsListening] = useState(false)
  const [geneExpressionOpen, setGeneExpressionOpen] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleVoiceInput = () => {
    setIsListening(!isListening)
    // Voice recognition logic would go here
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    // Handle file selection
  }

  const handleSuggestionClick = (topic: string) => {
    setSearchQuery(topic)
  }

  const handleGeneExpressionAnalysis = () => {
    setIsAnalyzing(true)
    setAnalysisProgress(0)

    // Simulate analysis progress
    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsAnalyzing(false)
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  // Mock data for research papers
  const mockPapers = [
    {
      id: 1,
      title: "CRISPR-Cas9 mediated genome editing in human embryonic stem cells",
      authors: ["Zhang, L.", "Chen, M.", "Wang, K.", "Liu, J."],
      journal: "Nature Genetics",
      year: 2024,
      citations: 127,
      doi: "10.1038/ng.2024.001",
      abstract:
        "We demonstrate efficient CRISPR-Cas9 mediated genome editing in human embryonic stem cells with minimal off-target effects...",
      tags: ["CRISPR", "Genome Editing", "Stem Cells", "Human Genetics"],
      impact: 9.2,
      openAccess: true,
    },
    {
      id: 2,
      title: "Single-cell RNA sequencing reveals novel cell types in human brain development",
      authors: ["Rodriguez, A.", "Kim, S.", "Thompson, R."],
      journal: "Cell",
      year: 2024,
      citations: 89,
      doi: "10.1016/j.cell.2024.001",
      abstract:
        "Using single-cell RNA sequencing, we identified previously unknown cell populations during human brain development...",
      tags: ["scRNA-seq", "Brain Development", "Cell Types", "Neuroscience"],
      impact: 8.7,
      openAccess: false,
    },
    {
      id: 3,
      title: "Polygenic risk scores for cardiovascular disease in diverse populations",
      authors: ["Patel, N.", "Johnson, E.", "Williams, D.", "Brown, S."],
      journal: "Nature Medicine",
      year: 2023,
      citations: 203,
      doi: "10.1038/nm.2023.045",
      abstract:
        "We developed and validated polygenic risk scores for cardiovascular disease across diverse ancestral populations...",
      tags: ["Polygenic Risk", "Cardiovascular", "Population Genetics", "Precision Medicine"],
      impact: 8.9,
      openAccess: true,
    },
  ]

  const databases = [
    { name: "PubMed", count: "35M+ articles", type: "Literature" },
    { name: "NCBI GenBank", count: "250M+ sequences", type: "Genomic" },
    { name: "UniProt", count: "200M+ proteins", type: "Protein" },
    { name: "GWAS Catalog", count: "5K+ studies", type: "Association" },
    { name: "ClinVar", count: "2M+ variants", type: "Clinical" },
    { name: "dbSNP", count: "1B+ variants", type: "Variation" },
  ]

  return (
    <PageWrapper>
      <div className="min-h-screen bg-background">
        <main className="px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12">
          <div className="max-w-7xl mx-auto">
            <section className="relative flex flex-col items-center justify-center min-h-[50vh] sm:min-h-[60vh] py-8 sm:py-12">
              <div className="text-center mb-8 sm:mb-12">
                <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-3 sm:mb-4">
                  <span className="text-black">AI-Powered Research</span>
                </h1>
                <h2 className="font-serif text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-medium leading-tight mb-6 sm:mb-8">
                  <span className="text-blue-600">for genetics scientists worldwide</span>
                </h2>
              </div>

              <div className="w-full max-w-4xl mb-6 sm:mb-8">
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-6">
                      <div className="flex items-start gap-3 sm:gap-4 flex-1">
                        <div className="p-2 sm:p-3 bg-blue-100 rounded-xl flex-shrink-0">
                          <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                            Gene Expression Analysis Suite
                          </h3>
                          <p className="text-sm sm:text-base text-gray-600 mb-2 sm:mb-3">
                            Advanced differential expression analysis with pathway enrichment and visualization
                          </p>
                          <div className="flex flex-wrap gap-1 sm:gap-2">
                            <Badge variant="secondary" className="text-xs">
                              DESeq2
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              GSEA
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              Volcano Plots
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              Heatmaps
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="w-full lg:w-auto">
                        <Dialog open={geneExpressionOpen} onOpenChange={setGeneExpressionOpen}>
                          <DialogTrigger asChild>
                            <Link href="/gene-expression">
                              <Button
                                size="lg"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-2 sm:py-3 w-full lg:w-auto touch-manipulation"
                              >
                                <Zap className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                                Launch Analysis
                              </Button>
                            </Link>
                          </DialogTrigger>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="w-full max-w-4xl">
                <div className="mb-4 sm:mb-6 flex flex-wrap justify-center gap-2 sm:gap-3">
                  <button
                    onClick={() => handleSuggestionClick("CRISPR gene editing mechanisms")}
                    className="px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm hover:shadow-md touch-manipulation"
                  >
                    CRISPR Gene Editing
                  </button>
                  <button
                    onClick={() => handleSuggestionClick("Single-cell RNA sequencing analysis")}
                    className="px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm hover:shadow-md touch-manipulation"
                  >
                    Single-cell RNA-seq
                  </button>
                  <button
                    onClick={() => handleSuggestionClick("Polygenic risk scores cardiovascular")}
                    className="px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm hover:shadow-md touch-manipulation"
                  >
                    Polygenic Risk Scores
                  </button>
                </div>

                <form className="flex items-center bg-white border border-gray-300 rounded-full shadow-lg hover:shadow-xl transition-all hover:border-gray-400 p-2 sm:p-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 sm:p-3 rounded-full hover:bg-gray-100 text-gray-600 transition-colors touch-manipulation"
                    title="Attach research files"
                  >
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                      />
                    </svg>
                  </button>

                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search 35+ million publications with AI assistance"
                    className="flex-1 border-0 bg-transparent px-3 sm:px-6 py-3 sm:py-4 text-base sm:text-lg leading-relaxed focus:ring-0 focus:outline-none placeholder:text-gray-400"
                  />

                  <button
                    type="button"
                    onClick={handleVoiceInput}
                    className={`p-2 sm:p-3 rounded-full transition-colors touch-manipulation ${
                      isListening ? "bg-red-500 text-white animate-pulse" : "hover:bg-gray-100 text-gray-600"
                    }`}
                    title={isListening ? "Stop listening" : "Start voice search"}
                  >
                    <Mic className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>

                  <button
                    type="submit"
                    disabled={!searchQuery.trim()}
                    className="p-2 sm:p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                  >
                    <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 11l5-5m0 0l5 5m-5-5v12"
                      />
                    </svg>
                  </button>
                </form>

                <div className="text-center mt-3 sm:mt-4">
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Powered by AI • Search across PubMed, arXiv, bioRxiv, and 35M+ publications
                  </p>
                </div>

                {isListening && (
                  <div className="text-center mt-2 sm:mt-3">
                    <p className="text-sm text-blue-600 animate-pulse">Listening... Ask about research topics</p>
                  </div>
                )}
              </div>
            </section>

            <div className="pb-8 sm:pb-12">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 sm:space-y-8">
                <div className="w-full overflow-x-auto">
                  <TabsList className="inline-flex bg-gray-100/50 p-1 rounded-2xl min-w-max w-full sm:w-auto">
                    <TabsTrigger
                      value="search"
                      className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:bg-gray-50/80 data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-100 data-[state=inactive]:hover:text-gray-900 rounded-xl px-3 sm:px-4 py-2 transition-all duration-300 ease-out font-medium touch-manipulation"
                    >
                      <Search className="h-4 w-4" />
                      <span className="hidden sm:inline">Literature Search</span>
                      <span className="sm:hidden">Search</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="tools"
                      className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:bg-gray-50/80 data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-100 data-[state=inactive]:hover:text-gray-900 rounded-xl px-3 sm:px-4 py-2 transition-all duration-300 ease-out font-medium touch-manipulation"
                    >
                      <Database className="h-4 w-4" />
                      <span className="hidden sm:inline">Analysis Tools</span>
                      <span className="sm:hidden">Tools</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="databases"
                      className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:bg-gray-50/80 data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-100 data-[state=inactive]:hover:text-gray-900 rounded-xl px-3 sm:px-4 py-2 transition-all duration-300 ease-out font-medium touch-manipulation"
                    >
                      <Globe className="h-4 w-4" />
                      <span className="hidden sm:inline">Databases</span>
                      <span className="sm:hidden">Data</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="workspace"
                      className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-900 rounded-xl px-3 sm:px-4 py-2 transition-all duration-300 ease-out font-medium touch-manipulation"
                    >
                      <BookOpen className="h-4 w-4" />
                      <span className="hidden sm:inline">My Workspace</span>
                      <span className="sm:hidden">Workspace</span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Literature Search Tab */}
                <TabsContent value="search" className="space-y-4 sm:space-y-6">
                  <Card className="border-gray-200 shadow-sm">
                    <CardHeader className="bg-white pb-3 sm:pb-4">
                      <CardTitle className="flex items-center gap-2 text-gray-900 text-base sm:text-lg">
                        <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                        Advanced Literature Search
                      </CardTitle>
                      <CardDescription className="text-gray-600 text-sm">
                        Search across 35M+ biomedical publications with AI-powered insights
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4 sm:pt-6">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <div className="flex-1">
                          <Input
                            placeholder="Search for papers, authors, keywords, or DOI..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="text-sm sm:text-base border-gray-200 focus:border-blue-400"
                          />
                        </div>
                        <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto touch-manipulation">
                          <Search className="h-4 w-4 mr-2" />
                          Search
                        </Button>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Select>
                          <SelectTrigger className="w-full sm:w-40">
                            <SelectValue placeholder="Publication Year" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2024">2024</SelectItem>
                            <SelectItem value="2023">2023</SelectItem>
                            <SelectItem value="2022">2022</SelectItem>
                            <SelectItem value="last5">Last 5 years</SelectItem>
                            <SelectItem value="last10">Last 10 years</SelectItem>
                          </SelectContent>
                        </Select>

                        <Select>
                          <SelectTrigger className="w-full sm:w-40">
                            <SelectValue placeholder="Journal" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="nature">Nature</SelectItem>
                            <SelectItem value="science">Science</SelectItem>
                            <SelectItem value="cell">Cell</SelectItem>
                            <SelectItem value="nejm">NEJM</SelectItem>
                          </SelectContent>
                        </Select>

                        <Select>
                          <SelectTrigger className="w-full sm:w-40">
                            <SelectValue placeholder="Study Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="clinical">Clinical Trial</SelectItem>
                            <SelectItem value="meta">Meta-Analysis</SelectItem>
                            <SelectItem value="review">Review</SelectItem>
                            <SelectItem value="case">Case Study</SelectItem>
                          </SelectContent>
                        </Select>

                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full sm:w-auto bg-transparent touch-manipulation"
                        >
                          <Filter className="h-4 w-4 mr-2" />
                          More Filters
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Search Results */}
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <h3 className="text-base sm:text-lg font-semibold">Search Results (1,247 papers)</h3>
                      <div className="flex items-center gap-2">
                        <Select defaultValue="relevance">
                          <SelectTrigger className="w-full sm:w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="relevance">Relevance</SelectItem>
                            <SelectItem value="date">Publication Date</SelectItem>
                            <SelectItem value="citations">Citations</SelectItem>
                            <SelectItem value="impact">Impact Factor</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="outline" size="sm" className="touch-manipulation bg-transparent">
                          <SortAsc className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {mockPapers.map((paper) => (
                      <Card key={paper.id} className="hover:shadow-md transition-shadow border-gray-200">
                        <CardContent className="p-4 sm:p-6">
                          <div className="space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <h4 className="text-base sm:text-lg font-semibold text-foreground hover:text-primary cursor-pointer">
                                  {paper.title}
                                </h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {paper.authors.join(", ")} • {paper.journal} • {paper.year}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                {paper.openAccess && (
                                  <Badge variant="secondary" className="text-xs">
                                    Open Access
                                  </Badge>
                                )}
                                <Button variant="ghost" size="sm" className="touch-manipulation">
                                  <Bookmark className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="touch-manipulation">
                                  <Share2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            <p className="text-sm text-muted-foreground line-clamp-2">{paper.abstract}</p>

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                              <div className="flex flex-wrap gap-1">
                                {paper.tags.map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Star className="h-3 w-3" />
                                  IF: {paper.impact}
                                </span>
                                <span>{paper.citations} citations</span>
                                <Button variant="link" size="sm" className="p-0 h-auto touch-manipulation">
                                  View Full Text
                                  <ArrowUpRight className="h-3 w-3 ml-1" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Analysis Tools Tab */}
                <TabsContent value="tools" className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                    <Card className="hover:shadow-lg transition-all cursor-pointer border-gray-200 hover:border-blue-300 touch-manipulation">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 sm:p-3 bg-gray-50 rounded-xl">
                            <Dna className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
                          </div>
                          <div>
                            <CardTitle className="text-base sm:text-lg">BLAST Search</CardTitle>
                            <Badge variant="outline" className="text-xs mt-1">
                              Sequence Analysis
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Basic Local Alignment Search Tool for sequence similarity
                        </p>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 touch-manipulation">
                          Launch Tool
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-all cursor-pointer border-blue-200 hover:border-blue-400 bg-gradient-to-br from-blue-50 to-indigo-50 touch-manipulation">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 sm:p-3 bg-blue-100 rounded-xl">
                            <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-base sm:text-lg text-blue-900">
                              Gene Expression Analysis
                            </CardTitle>
                            <Badge variant="secondary" className="text-xs mt-1 bg-blue-200 text-blue-800">
                              Enhanced Suite
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-blue-700 mb-3">
                          Advanced differential expression analysis with DESeq2, pathway enrichment, and interactive
                          visualizations
                        </p>
                        <div className="flex flex-wrap gap-1 mb-4">
                          <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">
                            DESeq2
                          </Badge>
                          <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">
                            GSEA
                          </Badge>
                          <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">
                            Volcano
                          </Badge>
                        </div>
                        <Link href="/gene-expression">
                          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white touch-manipulation">
                            <Zap className="h-4 w-4 mr-2" />
                            Launch Analysis Suite
                            <ChevronRight className="h-4 w-4 ml-2" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-all cursor-pointer border-gray-200 hover:border-blue-300 touch-manipulation">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 sm:p-3 bg-gray-50 rounded-xl">
                            <Microscope className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
                          </div>
                          <div>
                            <CardTitle className="text-base sm:text-lg">Variant Annotation</CardTitle>
                            <Badge variant="outline" className="text-xs mt-1">
                              Variant Analysis
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Annotate genetic variants with functional predictions
                        </p>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 touch-manipulation">
                          Launch Tool
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-all cursor-pointer border-gray-200 hover:border-blue-300 touch-manipulation">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 sm:p-3 bg-gray-50 rounded-xl">
                            <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
                          </div>
                          <div>
                            <CardTitle className="text-base sm:text-lg">Pathway Enrichment</CardTitle>
                            <Badge variant="outline" className="text-xs mt-1">
                              Pathway Analysis
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">Identify enriched biological pathways</p>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 touch-manipulation">
                          Launch Tool
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Quick Analysis Section */}
                  <Card className="border-gray-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base sm:text-lg">Quick Analysis</CardTitle>
                      <CardDescription className="text-sm">Upload your data for immediate analysis</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center">
                        <svg
                          className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-3 sm:mb-4 text-muted-foreground"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                          />
                        </svg>
                        <p className="text-sm text-muted-foreground mb-2">
                          Drag and drop your files here, or click to browse
                        </p>
                        <p className="text-xs text-muted-foreground mb-3 sm:mb-4">
                          Supports: FASTA, VCF, CSV, TSV, Excel files
                        </p>
                        <Button variant="outline" className="bg-transparent touch-manipulation">
                          Choose Files
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Databases Tab */}
                <TabsContent value="databases" className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {databases.map((db, index) => (
                      <Card
                        key={index}
                        className="hover:shadow-md transition-shadow cursor-pointer border-gray-200 touch-manipulation"
                      >
                        <CardContent className="p-3 sm:p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-sm sm:text-base">{db.name}</h4>
                              <p className="text-xs sm:text-sm text-muted-foreground">{db.count}</p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {db.type}
                            </Badge>
                          </div>
                          <Button variant="ghost" size="sm" className="w-full mt-3 touch-manipulation">
                            Access Database
                            <ArrowUpRight className="h-3 w-3 ml-2" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Database Search */}
                  <Card className="border-gray-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base sm:text-lg">Cross-Database Search</CardTitle>
                      <CardDescription className="text-sm">
                        Search across multiple databases simultaneously
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Input placeholder="Enter gene name, protein ID, or keyword..." className="flex-1" />
                        <Button className="w-full sm:w-auto touch-manipulation">
                          <Search className="h-4 w-4 mr-2" />
                          Search All
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="cursor-pointer text-xs touch-manipulation">
                          PubMed
                        </Badge>
                        <Badge variant="outline" className="cursor-pointer text-xs touch-manipulation">
                          GenBank
                        </Badge>
                        <Badge variant="outline" className="cursor-pointer text-xs touch-manipulation">
                          UniProt
                        </Badge>
                        <Badge variant="outline" className="cursor-pointer text-xs touch-manipulation">
                          ClinVar
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Workspace Tab */}
                <TabsContent value="workspace" className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                      {/* Recent Activity */}
                      <Card className="border-gray-200">
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                            <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                            Recent Activity
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                            <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">Literature search: "CRISPR gene therapy"</p>
                              <p className="text-xs text-muted-foreground">2 hours ago • 127 results</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                            <Download className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">Downloaded: "Polygenic risk scores analysis"</p>
                              <p className="text-xs text-muted-foreground">1 day ago</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                            <BarChart3 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">Completed: Gene expression analysis</p>
                              <p className="text-xs text-muted-foreground">3 days ago</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Saved Papers */}
                      <Card className="border-gray-200">
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                            <Bookmark className="h-4 w-4 sm:h-5 sm:w-5" />
                            Saved Papers (12)
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {mockPapers.slice(0, 2).map((paper) => (
                            <div key={paper.id} className="p-3 rounded-lg border">
                              <h5 className="font-medium text-sm line-clamp-1">{paper.title}</h5>
                              <p className="text-xs text-muted-foreground mt-1">
                                {paper.authors[0]} et al. • {paper.journal} • {paper.year}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs touch-manipulation">
                                  View
                                </Button>
                                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs touch-manipulation">
                                  Remove
                                </Button>
                              </div>
                            </div>
                          ))}
                          <Button variant="outline" size="sm" className="w-full bg-transparent touch-manipulation">
                            View All Saved Papers
                          </Button>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="space-y-4 sm:space-y-6">
                      {/* Quick Stats */}
                      <Card className="border-gray-200">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base sm:text-lg">Research Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Papers Reviewed</span>
                            <span className="font-semibold">247</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Analyses Run</span>
                            <span className="font-semibold">18</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Collaborations</span>
                            <span className="font-semibold">5</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Citations</span>
                            <span className="font-semibold">1,203</span>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Research Collections */}
                      <Card className="border-gray-200">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base sm:text-lg">My Collections</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex items-center justify-between p-2 rounded hover:bg-muted/50 cursor-pointer touch-manipulation">
                            <div className="flex items-center gap-2">
                              <Tag className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">CRISPR Research</span>
                            </div>
                            <span className="text-xs text-muted-foreground">23 papers</span>
                          </div>
                          <div className="flex items-center justify-between p-2 rounded hover:bg-muted/50 cursor-pointer touch-manipulation">
                            <div className="flex items-center gap-2">
                              <Tag className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">Polygenic Scores</span>
                            </div>
                            <span className="text-xs text-muted-foreground">15 papers</span>
                          </div>
                          <div className="flex items-center justify-between p-2 rounded hover:bg-muted/50 cursor-pointer touch-manipulation">
                            <div className="flex items-center gap-2">
                              <Tag className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">Single Cell</span>
                            </div>
                            <span className="text-xs text-muted-foreground">31 papers</span>
                          </div>
                          <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent touch-manipulation">
                            Create Collection
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </PageWrapper>
  )
}
