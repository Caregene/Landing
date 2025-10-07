"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Activity,
  Upload,
  FileText,
  BarChart3,
  TrendingUp,
  Database,
  Microscope,
  Settings,
  Play,
  ArrowLeft,
  Download,
  Share2,
} from "lucide-react"
import Link from "next/link"

export default function GeneExpressionPage() {
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    // Handle file selection
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/research-platform">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Research Platform
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-blue-900">Gene Expression Analysis Suite</h1>
                <p className="text-blue-700">
                  Comprehensive differential gene expression analysis with advanced statistical methods
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Analysis Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Analysis Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-600" />
                  Analysis Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="analysis-type" className="text-sm font-medium">
                        Analysis Type
                      </Label>
                      <Select defaultValue="differential">
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="differential">Differential Expression</SelectItem>
                          <SelectItem value="time-series">Time Series Analysis</SelectItem>
                          <SelectItem value="single-cell">Single Cell RNA-seq</SelectItem>
                          <SelectItem value="pathway">Pathway Enrichment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="organism" className="text-sm font-medium">
                        Organism
                      </Label>
                      <Select defaultValue="human">
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="human">Homo sapiens</SelectItem>
                          <SelectItem value="mouse">Mus musculus</SelectItem>
                          <SelectItem value="rat">Rattus norvegicus</SelectItem>
                          <SelectItem value="zebrafish">Danio rerio</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="statistical-method" className="text-sm font-medium">
                        Statistical Method
                      </Label>
                      <Select defaultValue="deseq2">
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="deseq2">DESeq2 (Recommended)</SelectItem>
                          <SelectItem value="edger">edgeR</SelectItem>
                          <SelectItem value="limma">limma-voom</SelectItem>
                          <SelectItem value="wilcoxon">Wilcoxon Rank Sum</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="pvalue-cutoff" className="text-sm font-medium">
                        P-value Cutoff
                      </Label>
                      <Input
                        id="pvalue-cutoff"
                        defaultValue="0.05"
                        type="number"
                        step="0.001"
                        min="0"
                        max="1"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="fold-change" className="text-sm font-medium">
                        Log2 Fold Change Threshold
                      </Label>
                      <Input id="fold-change" defaultValue="1.0" type="number" step="0.1" className="mt-1" />
                    </div>

                    <div>
                      <Label htmlFor="multiple-testing" className="text-sm font-medium">
                        Multiple Testing Correction
                      </Label>
                      <Select defaultValue="fdr">
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fdr">FDR (Benjamini-Hochberg)</SelectItem>
                          <SelectItem value="bonferroni">Bonferroni</SelectItem>
                          <SelectItem value="holm">Holm</SelectItem>
                          <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-blue-600" />
                  Data Upload
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-dashed border-2 border-gray-300 hover:border-blue-400 transition-colors">
                    <CardContent className="p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm font-medium mb-1">Expression Matrix</p>
                      <p className="text-xs text-gray-500 mb-3">CSV, TSV, or Excel format</p>
                      <Button variant="outline" size="sm">
                        Choose File
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-dashed border-2 border-gray-300 hover:border-blue-400 transition-colors">
                    <CardContent className="p-6 text-center">
                      <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm font-medium mb-1">Sample Metadata</p>
                      <p className="text-xs text-gray-500 mb-3">Condition labels and covariates</p>
                      <Button variant="outline" size="sm">
                        Choose File
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Analysis Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Visualization Options
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="cursor-pointer hover:bg-blue-50 transition-colors border-blue-200">
                    <CardContent className="p-4 text-center">
                      <BarChart3 className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                      <p className="text-sm font-medium">Volcano Plot</p>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:bg-blue-50 transition-colors border-blue-200">
                    <CardContent className="p-4 text-center">
                      <TrendingUp className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                      <p className="text-sm font-medium">MA Plot</p>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:bg-blue-50 transition-colors border-blue-200">
                    <CardContent className="p-4 text-center">
                      <Database className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                      <p className="text-sm font-medium">Heatmap</p>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:bg-blue-50 transition-colors border-blue-200">
                    <CardContent className="p-4 text-center">
                      <Microscope className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                      <p className="text-sm font-medium">PCA Plot</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Analysis Progress */}
            {isAnalyzing && (
              <Card>
                <CardHeader>
                  <CardTitle>Analysis Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Processing</span>
                      <span className="text-sm text-gray-500">{analysisProgress}%</span>
                    </div>
                    <Progress value={analysisProgress} className="w-full" />
                    <p className="text-xs text-gray-500">
                      {analysisProgress < 30 && "Preprocessing data..."}
                      {analysisProgress >= 30 && analysisProgress < 60 && "Running differential expression analysis..."}
                      {analysisProgress >= 60 && analysisProgress < 90 && "Performing pathway enrichment..."}
                      {analysisProgress >= 90 && "Generating visualizations..."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between">
              <div className="flex gap-2">
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Advanced Settings
                </Button>
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Load Example Data
                </Button>
              </div>
              <Button
                onClick={handleGeneExpressionAnalysis}
                disabled={isAnalyzing}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Play className="h-4 w-4 mr-2" />
                {isAnalyzing ? "Analyzing..." : "Start Analysis"}
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Analysis Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    DESeq2
                  </Badge>
                  <span className="text-sm">Statistical Analysis</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    GSEA
                  </Badge>
                  <span className="text-sm">Pathway Enrichment</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    Interactive
                  </Badge>
                  <span className="text-sm">Visualizations</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    Export
                  </Badge>
                  <span className="text-sm">Publication Ready</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Analyses */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Analyses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium">Cardiac Development Study</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="outline">
                      <Download className="h-3 w-3 mr-1" />
                      Results
                    </Button>
                    <Button size="sm" variant="outline">
                      <Share2 className="h-3 w-3 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium">Neuronal Differentiation</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="outline">
                      <Download className="h-3 w-3 mr-1" />
                      Results
                    </Button>
                    <Button size="sm" variant="outline">
                      <Share2 className="h-3 w-3 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Help & Documentation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Help & Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start text-sm">
                  <FileText className="h-4 w-4 mr-2" />
                  User Guide
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  <Database className="h-4 w-4 mr-2" />
                  Example Datasets
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  <Settings className="h-4 w-4 mr-2" />
                  API Documentation
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
