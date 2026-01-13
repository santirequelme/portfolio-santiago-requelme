"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, Sparkles, CheckCircle2, AlertTriangle, Palette, Type, Layout, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

type AnalysisState = "idle" | "analyzing" | "result"

interface AnalysisResult {
  score: number
  visualHierarchy: {
    score: number
    feedback: string
  }
  typography: {
    score: number
    feedback: string
  }
  color: {
    score: number
    feedback: string
  }
  strengths: string[]
  improvements: string[]
}

export default function PixelAuditPage() {
  const [state, setState] = useState<AnalysisState>("idle")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Handle paste event
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return

      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile()
          if (file) {
            handleImageFile(file)
          }
        }
      }
    }

    if (state === "idle") {
      window.addEventListener("paste", handlePaste)
      return () => window.removeEventListener("paste", handlePaste)
    }
  }, [state])

  const handleImageFile = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string
      setImagePreview(imageUrl)
      analyzeImage(imageUrl)
    }
    reader.readAsDataURL(file)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const file = e.dataTransfer.files[0]
      if (file && file.type.startsWith("image/")) {
        handleImageFile(file)
      }
    },
    [handleImageFile],
  )

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageFile(file)
    }
  }

  const analyzeImage = async (imageUrl: string) => {
    setState("analyzing")

    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Mock result
    const mockResult: AnalysisResult = {
      score: 87,
      visualHierarchy: {
        score: 90,
        feedback: "Strong visual hierarchy with clear focal points and proper content organization.",
      },
      typography: {
        score: 85,
        feedback: "Good font pairings with appropriate sizing and line heights for readability.",
      },
      color: {
        score: 86,
        feedback: "Well-balanced color palette with good contrast ratios and semantic color usage.",
      },
      strengths: [
        "Clear visual hierarchy guides user attention effectively",
        "Consistent spacing creates a clean, professional appearance",
        "Strong color contrast ensures readability",
        "Effective use of whitespace improves content digestion",
      ],
      improvements: [
        "Consider increasing heading font weights for more impact",
        "Secondary buttons could benefit from more visual distinction",
        "Some interactive elements lack hover state feedback",
        "Mobile responsiveness could be optimized for smaller screens",
      ],
    }

    setResult(mockResult)
    setState("result")
  }

  const reset = () => {
    setState("idle")
    setImagePreview(null)
    setResult(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-6">
              <ArrowLeft className="size-4" />
              Back to Home
            </Button>
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="size-8 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold">Pixel Audit</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">AI-powered interface review</p>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {/* Idle State - Upload Zone */}
          {state === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-2 border-dashed border-border hover:border-primary/50 transition-colors">
                <CardContent className="p-12">
                  <label
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`flex flex-col items-center justify-center cursor-pointer transition-colors ${
                      isDragging ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <input type="file" accept="image/*" onChange={handleFileInput} className="hidden" />
                    <Upload className={`size-16 mb-6 ${isDragging ? "animate-bounce" : ""}`} />
                    <h3 className="text-xl font-semibold mb-2 text-foreground">
                      Drag & drop, or paste your UI screenshot here
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Supports PNG, JPG, WebP (Press Ctrl+V to paste)
                    </p>
                    <Button variant="outline" size="lg" className="rounded-xl bg-transparent">
                      Or browse files
                    </Button>
                  </label>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Analyzing State - Skeleton Loader */}
          {state === "analyzing" && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <Card className="rounded-xl">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Sparkles className="size-6 text-primary animate-pulse" />
                    <CardTitle>Analyzing your interface...</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="aspect-video bg-muted rounded-xl animate-pulse" />
                  <div className="space-y-4">
                    <Skeleton className="h-32 w-32 rounded-full mx-auto" />
                    <div className="grid md:grid-cols-3 gap-4">
                      <Skeleton className="h-32 rounded-xl" />
                      <Skeleton className="h-32 rounded-xl" />
                      <Skeleton className="h-32 rounded-xl" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Skeleton className="h-48 rounded-xl" />
                      <Skeleton className="h-48 rounded-xl" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Result State - Dashboard */}
          {state === "result" && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Image Preview */}
              {imagePreview && (
                <Card className="rounded-xl overflow-hidden">
                  <CardContent className="p-6">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Uploaded UI"
                      className="w-full rounded-xl border border-border"
                    />
                  </CardContent>
                </Card>
              )}

              {/* Overall Score */}
              <Card className="rounded-xl text-center">
                <CardHeader>
                  <CardTitle>Overall Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative inline-flex items-center justify-center">
                    <svg className="size-32 -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-muted"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - result.score / 100)}`}
                        className="text-primary transition-all duration-1000"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute">
                      <div className="text-4xl font-bold">{result.score}</div>
                      <div className="text-sm text-muted-foreground">/ 100</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Category Scores */}
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="rounded-xl">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Layout className="size-5 text-primary" />
                      <CardTitle className="text-lg">Visual Hierarchy</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">{result.visualHierarchy.score}</span>
                      <Badge variant="secondary">{result.visualHierarchy.score >= 80 ? "Excellent" : "Good"}</Badge>
                    </div>
                    <Progress value={result.visualHierarchy.score} className="h-2" />
                    <p className="text-sm text-muted-foreground">{result.visualHierarchy.feedback}</p>
                  </CardContent>
                </Card>

                <Card className="rounded-xl">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Type className="size-5 text-primary" />
                      <CardTitle className="text-lg">Typography</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">{result.typography.score}</span>
                      <Badge variant="secondary">{result.typography.score >= 80 ? "Excellent" : "Good"}</Badge>
                    </div>
                    <Progress value={result.typography.score} className="h-2" />
                    <p className="text-sm text-muted-foreground">{result.typography.feedback}</p>
                  </CardContent>
                </Card>

                <Card className="rounded-xl">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Palette className="size-5 text-primary" />
                      <CardTitle className="text-lg">Color</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">{result.color.score}</span>
                      <Badge variant="secondary">{result.color.score >= 80 ? "Excellent" : "Good"}</Badge>
                    </div>
                    <Progress value={result.color.score} className="h-2" />
                    <p className="text-sm text-muted-foreground">{result.color.feedback}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Strengths and Improvements */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="rounded-xl">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="size-5 text-green-500" />
                      <CardTitle>Strengths</CardTitle>
                    </div>
                    <CardDescription>What your design does well</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {result.strengths.map((strength, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <CheckCircle2 className="size-5 text-green-500 shrink-0 mt-0.5" />
                          <span className="text-sm">{strength}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="rounded-xl">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="size-5 text-amber-500" />
                      <CardTitle>Improvements</CardTitle>
                    </div>
                    <CardDescription>Areas for enhancement</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {result.improvements.map((improvement, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <AlertTriangle className="size-5 text-amber-500 shrink-0 mt-0.5" />
                          <span className="text-sm">{improvement}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Actions */}
              <div className="flex justify-center gap-4">
                <Button onClick={reset} size="lg" className="rounded-xl">
                  <Upload className="size-4" />
                  Analyze Another
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
