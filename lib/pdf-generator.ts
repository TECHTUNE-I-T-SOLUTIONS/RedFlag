import { jsPDF } from 'jspdf'

interface AnalysisData {
  contentType: 'text' | 'url' | 'image'
  contentPreview: string
  riskScore: number
  riskLevel: 'low' | 'medium' | 'high'
  confidence: number
  redFlags: string[]
  explanation: string
  recommendation: string
  createdAt: string
}

const COMPANY_NAME = 'RedFlag'
const COMPANY_COLOR = '#DC2626' // red for high risk theme

function getRiskLevelColor(level: 'low' | 'medium' | 'high'): string {
  switch (level) {
    case 'low':
      return '#22C55E' // green
    case 'medium':
      return '#EAB308' // yellow
    case 'high':
      return '#DC2626' // red
    default:
      return '#666666'
  }
}

function getRiskScore(level: 'low' | 'medium' | 'high'): string {
  switch (level) {
    case 'low':
      return 'Low Risk - Safe'
    case 'medium':
      return 'Medium Risk - Caution'
    case 'high':
      return 'High Risk - Dangerous'
    default:
      return 'Unknown'
  }
}

export async function generateAnalysisPDF(analysis: AnalysisData): Promise<Blob> {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 15
  const contentWidth = pageWidth - margin * 2
  let yPosition = margin

  // Header with logo/branding
  pdf.setFillColor(31, 41, 55) // dark background
  pdf.rect(0, 0, pageWidth, 35, 'F')

  // Company name
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(24)
  pdf.setTextColor(220, 38, 38)
  pdf.text(COMPANY_NAME, margin, 15)

  // Tagline
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)
  pdf.setTextColor(150, 150, 150)
  pdf.text('AI-Powered Phishing & Scam Detection', margin, 22)

  yPosition = 45

  // Report title
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(16)
  pdf.setTextColor(0, 0, 0)
  pdf.text('Security Analysis Report', margin, yPosition)
  yPosition += 12

  // Timestamp
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)
  pdf.setTextColor(100, 100, 100)
  const date = new Date(analysis.createdAt).toLocaleString()
  pdf.text(`Generated: ${date}`, margin, yPosition)
  yPosition += 8

  // Divider line
  pdf.setDrawColor(220, 220, 220)
  pdf.line(margin, yPosition, pageWidth - margin, yPosition)
  yPosition += 8

  // Risk Score Section
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(12)
  pdf.text('Risk Assessment', margin, yPosition)
  yPosition += 8

  // Risk bubble/box
  const riskColor = getRiskLevelColor(analysis.riskLevel)
  const riskColorRGB = parseInt(riskColor.substring(1), 16)
  pdf.setFillColor(
    (riskColorRGB >> 16) & 255,
    (riskColorRGB >> 8) & 255,
    riskColorRGB & 255
  )
  pdf.rect(margin, yPosition - 5, contentWidth, 18, 'F')

  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(24)
  pdf.setTextColor(255, 255, 255)
  pdf.text(`${analysis.riskScore}`, margin + 10, yPosition + 8)

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(12)
  pdf.text(getRiskScore(analysis.riskLevel), margin + 30, yPosition + 5)

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)
  pdf.text(`${analysis.confidence}% Confidence`, margin + 30, yPosition + 12)

  yPosition += 25

  // Content Analysis
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(12)
  pdf.setTextColor(0, 0, 0)
  pdf.text('Content Analyzed', margin, yPosition)
  yPosition += 6

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)
  pdf.setTextColor(100, 100, 100)
  pdf.text(`Type: ${analysis.contentType.toUpperCase()}`, margin, yPosition)
  yPosition += 5

  // Preview text
  const previewText = `Content: ${analysis.contentPreview.substring(0, 100)}${analysis.contentPreview.length > 100 ? '...' : ''}`
  const wrappedPreview = pdf.splitTextToSize(previewText, contentWidth - 10)
  pdf.text(wrappedPreview, margin + 5, yPosition)
  yPosition += wrappedPreview.length * 4 + 8

  // Red Flags Section
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(12)
  pdf.setTextColor(220, 38, 38)
  pdf.text('Red Flags Identified', margin, yPosition)
  yPosition += 6

  if (analysis.redFlags.length > 0) {
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(10)
    pdf.setTextColor(0, 0, 0)

    analysis.redFlags.forEach((flag) => {
      pdf.setTextColor(220, 38, 38)
      pdf.text('•', margin + 3, yPosition)
      const wrappedFlag = pdf.splitTextToSize(flag, contentWidth - 15)
      pdf.setTextColor(0, 0, 0)
      pdf.text(wrappedFlag, margin + 10, yPosition)
      yPosition += wrappedFlag.length * 4 + 2
    })
  } else {
    pdf.setFont('helvetica', 'italic')
    pdf.setTextColor(100, 100, 100)
    pdf.text('No red flags detected', margin + 5, yPosition)
    yPosition += 6
  }

  yPosition += 4

  // AI Explanation
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(12)
  pdf.setTextColor(0, 0, 0)
  pdf.text('AI Analysis', margin, yPosition)
  yPosition += 6

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)
  pdf.setTextColor(60, 60, 60)
  const wrappedExplanation = pdf.splitTextToSize(analysis.explanation, contentWidth - 5)
  pdf.text(wrappedExplanation, margin + 2, yPosition)
  yPosition += wrappedExplanation.length * 5 + 4

  // Recommendation
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(12)
  pdf.setTextColor(0, 0, 0)
  pdf.text('Recommended Action', margin, yPosition)
  yPosition += 6

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)
  pdf.setTextColor(60, 60, 60)
  const wrappedRecommendation = pdf.splitTextToSize(
    analysis.recommendation,
    contentWidth - 5
  )
  pdf.text(wrappedRecommendation, margin + 2, yPosition)
  yPosition += wrappedRecommendation.length * 5 + 8

  // Footer
  pdf.setDrawColor(220, 220, 220)
  pdf.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(8)
  pdf.setTextColor(150, 150, 150)
  pdf.text(
    `${COMPANY_NAME} - AI Phishing & Scam Detection | Page 1 of 1`,
    margin,
    pageHeight - 10
  )
  pdf.text(
    'Keep this report for your records. Never share with untrusted sources.',
    margin,
    pageHeight - 5
  )

  return pdf.output('blob')
}

export async function downloadPDF(analysis: AnalysisData) {
  const blob = await generateAnalysisPDF(analysis)
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${COMPANY_NAME}_Analysis_${new Date().toISOString().split('T')[0]}.pdf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}
