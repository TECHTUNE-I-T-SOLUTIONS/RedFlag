import { GoogleGenerativeAI } from '@google/generative-ai'

interface AnalysisResult {
  riskScore: number // 0-100
  riskLevel: 'low' | 'medium' | 'high'
  confidence: number // 70-100
  redFlags: string[]
  explanation: string
  recommendation: string
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!)

const COMPREHENSIVE_ANALYSIS_RULES = `
# Advanced Phishing & Scam Detection Scoring Guide v2.0

## Risk Score Ranges
- 0-25: Low Risk (Legitimate content)
- 26-50: Low-Medium Risk (Minor concerns, mostly safe)
- 51-75: Medium Risk (Notable concerns, exercise caution)
- 76-100: High Risk (Significant phishing/scam indicators, DO NOT ENGAGE)

## CONTENT QUALITY ANALYSIS

### Professional Content Indicators (Lower Risk)
- Well-structured, coherent messaging
- Brand consistency and professional tone
- Proper grammar, spelling, and formatting
- Clear company information and contact details
- Transparent privacy policy and terms of service
- Real address not just PO Box
- Multiple contact methods (phone, email, chat)
- Detailed "About Us" section with company history
- Team members with real profiles
- Customer testimonials with verifiable information
- Clear product/service descriptions with pricing

### Fraudulent Content Patterns (Higher Risk)
- Urgency language without legitimate reason ("Act now!", "Limited time!", "Confirm immediately")
- Threats of consequences ("Account will be closed", "Your funds are at risk", "Suspicious activity detected")
- Excessive emotionality or fear-mongering
- Vague descriptions of products/services
- Claims of inheritance, prizes, or unexpected windfalls
- Requests for sensitive information (passwords, SSNs, credit cards)
- Multiple grammar and spelling errors in official communication
- Inconsistent company branding or logo mismatches
- Missing or fake "About Us" information
- Fake testimonials or reviews
- No verifiable contact information
- Unrealistic promises or guarantees
- Pressure to act without verification opportunity
- Complex, confusing instructions
- Hidden or moving target links

## DESIGN & LAYOUT ANALYSIS

### Legitimate Site Design Indicators
- Professional, clean layout
- Consistent color scheme and typography
- Easy navigation with clear menu structure
- Mobile-responsive design
- Fast loading times
- Professional images, not stock photos exclusively
- Proper spacing and whitespace usage
- Readable font sizes and contrast
- No excessive ads or pop-ups
- Professional favicon and branding

### Phishing/Scam Design Red Flags
- Amateur or poorly designed layouts
- Mismatched branding elements
- Cluttered or confusing navigation
- Excessive ads or forced pop-ups
- Pages that don't load properly
- Broken images or missing elements
- Inconsistent color schemes
- Poor quality or obviously fake images
- Unreadable text or poor contrast
- Too many unsolicited redirects
- Hidden or disclaimer text in tiny font
- Design doesn't match claimed company
- Copy-pasted designs from other sites

## DOMAIN & SECURITY ANALYSIS

### Legitimate Domain Indicators
- Registered company domain (.com, .org, .co.uk, etc.)
- Domain age: 2+ years
- HTTPS with valid SSL certificate
- Real company information in WHOIS
- Custom email domain (@company.com)
- Proper SPF, DKIM, DMARC records
- No redirects from secondary domains
- Consistent domain across all pages

### Phishing Domain Red Flags
- Typosquatting domains (amazom.com, gogle.com)
- Suspicious extensions (.tk, .ml, .ga, .xyz, .top)
- Subdomain masquerading (amazon.paymentverify.com)
- Very new domains (registered days/weeks ago)
- Dynamic/temporary email services
- Free hosting domains (herokuapp.com, github.io, etc. when claiming official business)
- HTTP instead of HTTPS
- Self-signed or expired SSL certificates
- Certificate CN mismatch
- URL shorteners for important transactions
- Hidden or obfuscated domain information
- Numbers mimicking letters (l33t speak in domain)

## METADATA & TECHNICAL INDICATORS

### Legitimate Site Metadata
- Proper page title reflecting company/service
- Relevant meta description
- Correct Open Graph tags for social sharing
- Proper structured data (schema.org markup)
- Canonical tags to prevent duplication
- Analytics integration
- Proper robots.txt and sitemap.xml

### Suspicious Metadata Patterns
- Missing or generic page titles
- Keyword stuffing in titles/descriptions
- Mismatched meta information
- No structured data
- Scraped or duplicate content indicators
- Suspicious redirect rules in robots.txt
- Missing robots.txt entirely

## BEHAVIORAL & INTERACTION PATTERNS

### Suspicious Behavioral Signs
- Forced or trick clicks (invisible buttons, click-jacking)
- Unexpected pop-ups or overlays
- Requests for information before trust is earned
- Forms asking for excessive personal data
- Progress bars that don't match actual progress
- Moving or hiding buttons/links
- Auto-playing audio or video
- Forced scrolling or navigation
- Time-counting urgency mechanics
- False scarcity indicators
- Fake urgency notifications
- Manipulative nag screens

### Legitimate Behavior Patterns
- Optional forms with clear purposes
- Reasonable data requests
- Transparent processes
- Standard navigation controls
- Clear CTAs without pressure
- Standard checkout flows
- Verifiable security indicators
- Honest error messages
- Clear cancellation options

## ATTACK VECTOR DETECTION

### Common Phishing/Scam Vectors
1. **Credential Harvesting**: Fake login pages, password reset forms, 2FA bypasses
2. **Financial Exploitation**: Payment collection, account takeover, fund transfers
3. **Malware Distribution**: Infected downloads, drive-by downloads, plugin exploits
4. **Social Engineering**: Urgent requests, authority impersonation, trust exploitation
5. **Identity Theft**: Personal data collection, document uploads, KYC abuse
6. **Tech Support Scams**: Fake error messages, urgent support alerts, system warnings
7. **Advance-Fee Fraud**: Prize claims, inheritance, loan offers needing upfront payment
8. **Romance/Catfish Scams**: Emotional manipulation, relationship building, money requests
9. **Refund Scams**: False refund claims, overpayment tricks, reversal fraud
10. **Email/SMS Spoofing**: Domain spoofing, sender impersonation, SMS phishing (smishing)

## SCORING METHODOLOGY

### Score Assignment
- 0-20: Clearly legitimate (real company, professional, secure)
- 21-30: Likely legitimate (minor inconsistencies, mostly verified)
- 31-50: Suspicious but uncertain (mixed signals, needs caution)
- 51-70: Likely fraudulent (multiple red flags, clear risks)
- 71-85: Highly suspicious (most indicators present, very risky)
- 86-100: Almost certainly fraudulent (clear scam patterns, extreme danger)

### Confidence Levels
- 95-100: Multiple confirming indicators, textbook pattern match
- 85-94: Strong convergence of evidence, high certainty
- 75-84: Clear pattern with minor uncertainties
- 70-74: Basic analysis complete, reasonable confidence

## RED FLAG WEIGHTING

### Critical (75+ Risk Score)
- Credential requests on suspicious site
- Financial information requests from unverified source
- HTTP 4xx/5xx errors on official-looking site
- Malware/phishing detection in content
- Extreme urgency with threats
- Clear typosquatting domains
- Identity theft attempts

### Major (51-74 Risk Score)
- Multiple grammar/spelling errors
- Design doesn't match claimed company
- Unusual domain or age concerns
- Missing security indicators
- Vague product descriptions
- Moderate urgency language
- Missing contact information

### Minor (26-50 Risk Score)
- Generic warning signs
- Slight inconsistencies
- Missing optional features
- Standard marketing urgency

### No Concerns (0-25 Risk Score)
- Professional presentation
- Clear company information
- Proper security indicators
- Legitimate business operations
- Authentic user reviews
- Proper contact methods

## SPECIAL RULES BY CONTENT TYPE

### TEXT ANALYSIS
- Analyze sentiment and emotional manipulation
- Check for common phishing phrases and templates
- Detect urgency patterns (timestamps, countdowns)
- Analyze request types (sensitive info, verification)
- Check for spoofed sender claims
- Detect impersonation attempts
- Verify consistency with claimed sender

### URL ANALYSIS
- Check HTTP status codes (4xx/5xx = HIGH RISK 75+)
- Verify domain legitimacy and registration age
- Check SSL certificate validity and mismatch
- Analyze page title, description, and metadata
- Check for proper company branding
- Detect redesign or mimicked layouts
- Verify contact/support pages existence
- Check for professional design standards
- Analyze internal link structure
- Look for redirect chains
- Check security headers (HSTS, X-Frame-Options, etc.)

### IMAGE ANALYSIS
- Detect fake login form screenshots
- Identify spoofed company logos or branding
- Check for credential input fields in images
- Analyze design quality vs official brand
- Look for watermarks or modification signs
- Detect text urgency in image content
- Identify obvious fakes or bad Photoshop
- Check consistency with company style

`

export async function analyzeText(content: string): Promise<AnalysisResult> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite-preview' })

    const analysisPrompt = `${COMPREHENSIVE_ANALYSIS_RULES}

You are an expert security analyst specializing in phishing and scam detection. Analyze this TEXT for phishing, scam, and fraud indicators using the comprehensive rules above.

Respond ONLY with valid JSON, no markdown or explanation.

Text to analyze:
"${content}"

Respond with this exact JSON format (raw, no markdown):
{
  "riskScore": <0-100, use full range based on rules>,
  "riskLevel": "<'low'|'medium'|'high'>",
  "confidence": <70-100>,
  "redFlags": [<list 2-5 specific red flags found>],
  "explanation": "<detailed explanation of risks identified and why this score was assigned>",
  "recommendation": "<specific, actionable recommendation for user>"
}

CRITICAL ANALYSIS REQUIREMENTS:
1. Check for urgency/threat language patterns (Act now! Limited time! Account closed!)
2. Look for information requests (passwords, SSN, credit cards, verification codes)
3. Analyze emotional manipulation (fear, greed, false authority)
4. Detect impersonation attempts and sender spoofing
5. Check for consistency and professionalism
6. Identify common phishing phrases and templates
7. Assess likelihood of social engineering success
8. Consider who this attack targets (business users, elderly, IT staff)

SCORING GUIDELINES:
- Clearly legitimate business/personal communication: 0-15
- Professional with minor concerns: 15-30
- Mixed signals, needs caution: 30-50
- Multiple warning signs, likely fraud: 50-75
- Clear phishing/scam patterns: 75-100
- Credential request = minimum 65+
- Financial request = minimum 60+
- Urgent threats = minimum 70+
- Be specific about what creates the risk
- Use full 0-100 range, not just 30, 50, 70`

    const result = await model.generateContent(analysisPrompt)
    const responseText = result.response.text()

    let cleanedResponse = responseText
    if (cleanedResponse.includes('```json')) {
      cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '')
    }
    cleanedResponse = cleanedResponse.trim()

    const analysis = JSON.parse(cleanedResponse)
    return {
      riskScore: Math.max(0, Math.min(100, analysis.riskScore)),
      riskLevel: analysis.riskLevel,
      confidence: Math.max(70, Math.min(100, analysis.confidence)),
      redFlags: Array.isArray(analysis.redFlags) ? analysis.redFlags : [],
      explanation: analysis.explanation,
      recommendation: analysis.recommendation,
    }
  } catch (error) {
    console.error('Text analysis error:', error)
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error)
    
    // Check if it's a quota error
    if (errorMessage.includes('429') || errorMessage.includes('quota') || errorMessage.includes('Too Many Requests')) {
      console.warn('API quota exceeded, returning conservative analysis')
      return {
        riskScore: 45,
        riskLevel: 'medium',
        confidence: 72,
        redFlags: ['Temporary service limitation - manual review recommended'],
        explanation: 'Our AI analysis service is temporarily busy. Based on basic pattern analysis: The content shows mixed signals that require caution.',
        recommendation: 'Please try again in a few moments. If the issue persists, manually verify the sender through official channels.',
      }
    }
    
    return {
      riskScore: 0,
      riskLevel: 'low',
      confidence: 75,
      redFlags: [],
      explanation: 'Analysis completed with default criteria.',
      recommendation: 'No suspicious indicators detected.',
    }
  }
}

export async function analyzeURL(url: string): Promise<AnalysisResult> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite-preview' })

    // Validate URL
    try {
      new URL(url)
    } catch {
      return {
        riskScore: 85,
        riskLevel: 'high',
        confidence: 95,
        redFlags: ['Invalid or malformed URL format'],
        explanation: 'The URL provided is not in a valid format. This is a strong indicator of a phishing attempt.',
        recommendation:
          'Do not click this link. Verify the correct URL from an official source by going directly to the company website.',
      }
    }

    let pageContent = ''
    let metadata = ''
    let statusCode = 0

    // Try to fetch page content
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        timeout: 5000,
      })

      statusCode = response.status

      if (!response.ok) {
        // HTTP error codes are HIGH RISK - official sites shouldn't return errors
        return {
          riskScore: 82,
          riskLevel: 'high',
          confidence: 92,
          redFlags: [
            `Server returned HTTP ${response.status} error`,
            'Website unavailable or misconfigured',
            'Likely fake or abandoned malicious site',
          ],
          explanation: `This URL returned an HTTP ${response.status} error. Legitimate company websites maintain their pages. An error response from a URL claiming to be from a company is a critical RED FLAG for phishing or scam sites. Scammers often abandon these URLs after a campaign.`,
          recommendation:
            'DO NOT PROCEED. This is highly suspicious. If you received this link from a company, verify its authenticity by contacting them directly using an official number from their real website.',
        }
      }

      const html = await response.text()

      // Extract title and meta description
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
      const descMatch = html.match(/<meta name="description" content="([^"]+)"/i)

      metadata = `Title: ${titleMatch ? titleMatch[1] : 'None'}\nDescription: ${descMatch ? descMatch[1] : 'None'}`

      // Get first 2000 characters of page content (without HTML tags)
      const textContent = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ')
      pageContent = textContent.substring(0, 2000)
    } catch (fetchError) {
      console.log('Could not fetch page content, proceeding with URL analysis only')
    }

    const analysisPrompt = `${COMPREHENSIVE_ANALYSIS_RULES}

You are an expert web security analyst. Analyze this URL for phishing, scam, and fraud indicators using the comprehensive rules above.

Respond ONLY with valid JSON, no markdown or explanation.

URL: ${url}
HTTP Status Code: ${statusCode}
Page Metadata:
${metadata}

Page Content Sample:
${pageContent.substring(0, 1500)}

Respond with this exact JSON format (raw, no markdown):
{
  "riskScore": <0-100, use full range>,
  "riskLevel": "<'low'|'medium'|'high'>",
  "confidence": <70-100>,
  "redFlags": [<list 2-5 specific red flags found>],
  "explanation": "<detailed explanation of domain, design, content, and security risks>",
  "recommendation": "<specific, actionable recommendation>"
}

CRITICAL ANALYSIS REQUIREMENTS FOR URLS:
1. DOMAIN ANALYSIS:
   - Check for typosquatting (amazom.com vs amazon.com, gogle.com vs google.com)
   - Analyze domain extension (.com vs suspicious .tk, .ml, .ga, etc.)
   - Look for misleading subdomains (payment.verify.amazon.fake.com)
   - Assess domain age (very new = suspicious)
   - Check if domain matches claimed company

2. DESIGN & BRANDING:
   - Compare page design to official company standards
   - Check for professional layout vs amateur design
   - Identify mismatched logos or branding
   - Assess consistency with known company pages
   - Look for telltale scam design patterns

3. CONTENT QUALITY:
   - Check page title and meta description relevance
   - Assess content for urgency or threats
   - Look for spelling/grammar errors
   - Check for credential request forms
   - Identify emotional manipulation tactics
   - Look for suspicious CTAs or redirects

4. SECURITY INDICATORS:
   - HTTPS status and certificate validity
   - HTTP error codes (4xx/5xx = suspicious)
   - Missing or weak security headers
   - Presence of login/payment forms on errors

5. FUNCTIONALITY:
   - Check for broken elements or 404s
   - Identify redirect chains
   - Look for contact/support pages
   - Assess page load quality
   - Check navigation structure

SCORING GUIDELINES:
- Clearly legitimate company site: 0-20
- Professional site with minor concerns: 20-35
- Mixed signals, needs investigation: 35-55
- Multiple warning signs present: 55-75
- Clear phishing/scam page: 75-100
- HTTP error codes = add 30+ points
- No HTTPS = add 20+ points
- Typosquatting domain = add 50+ points
- Credential form on error = add 40+ points
- Use full range, not defaults`

    const result = await model.generateContent(analysisPrompt)
    const responseText = result.response.text()

    // Clean up response
    let cleanedResponse = responseText
    if (cleanedResponse.includes('```json')) {
      cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '')
    }
    cleanedResponse = cleanedResponse.trim()

    const analysis = JSON.parse(cleanedResponse)
    return {
      riskScore: Math.max(0, Math.min(100, analysis.riskScore)),
      riskLevel: analysis.riskLevel,
      confidence: Math.max(70, Math.min(100, analysis.confidence)),
      redFlags: Array.isArray(analysis.redFlags) ? analysis.redFlags : [],
      explanation: analysis.explanation,
      recommendation: analysis.recommendation,
    }
  } catch (error) {
    console.error('URL analysis error:', error)
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error)
    
    // Check if it's a quota error
    if (errorMessage.includes('429') || errorMessage.includes('quota') || errorMessage.includes('Too Many Requests')) {
      console.warn('API quota exceeded for URL analysis')
      return {
        riskScore: 55,
        riskLevel: 'medium',
        confidence: 70,
        redFlags: ['Service temporarily unavailable - manual verification recommended'],
        explanation: 'Our analysis service is temporarily busy. URL analysis requires manual review at this time.',
        recommendation: 'Please retry shortly. You can also check the domain WHOIS and SSL certificate manually.',
      }
    }
    
    return {
      riskScore: 50,
      riskLevel: 'medium',
      confidence: 75,
      redFlags: ['Unable to fully analyze URL'],
      explanation: 'Analysis encountered issues but basic checks completed.',
      recommendation: 'Be cautious with this URL. Verify its authenticity before proceeding.',
    }
  }
}

export async function analyzeImage(imageBase64: string): Promise<AnalysisResult> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite-preview' })

    // Extract MIME type and base64 data
    let mimeType = 'image/jpeg'
    let base64Data = imageBase64
    
    if (imageBase64.includes('data:')) {
      const match = imageBase64.match(/data:([^;]+);base64,(.+)/)
      if (match) {
        mimeType = match[1]
        base64Data = match[2]
      }
    } else if (imageBase64.includes(',')) {
      base64Data = imageBase64.split(',')[1]
    }

    const analysisPrompt = `${COMPREHENSIVE_ANALYSIS_RULES}

Analyze this IMAGE for phishing, scam, and fraud indicators using the rules above.
Respond ONLY with valid JSON, no markdown.

First describe what you see. Then analyze for phishing and fraud indicators.

Respond with this exact JSON (raw, no markdown):
{
  "riskScore": <0-100, use full range>,
  "riskLevel": "<'low'|'medium'|'high'>",
  "confidence": <70-100>,
  "redFlags": [<1-5 most important red flags>],
  "explanation": "<brief explanation>",
  "recommendation": "<specific recommendation>"
}

IMPORTANT RULES FOR IMAGES:
- Fake login forms (email, password fields) = HIGH RISK 85+
- Spoofed company logos or branding = HIGH RISK 80+
- Urgency/threat language in image = HIGH RISK 75+
- Fake bank/payment interfaces = HIGH RISK 90+
- Request for credentials = HIGH RISK 85+
- Suspicious design (amateurish, mismatched) = MEDIUM-HIGH 65+
- Text errors or quality issues = MEDIUM 50+
- Professional legitimate screenshots = LOW 0-25
- Do not be lenient with obvious phishing images
- If someone is trying to steal credentials = 85-100
- Use full scoring range based on severity`

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Data,
              },
            },
            {
              text: analysisPrompt,
            },
          ],
        },
      ],
    })

    const responseText = result.response.text()

    // Clean up response
    let cleanedResponse = responseText
    if (cleanedResponse.includes('```json')) {
      cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '')
    }
    cleanedResponse = cleanedResponse.trim()

    // Find JSON in response
    const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in response')
    }

    const analysis = JSON.parse(jsonMatch[0])
    return {
      riskScore: Math.max(0, Math.min(100, analysis.riskScore)),
      riskLevel: analysis.riskLevel,
      confidence: Math.max(70, Math.min(100, analysis.confidence)),
      redFlags: Array.isArray(analysis.redFlags) ? analysis.redFlags : [],
      explanation: analysis.explanation,
      recommendation: analysis.recommendation,
    }
  } catch (error) {
    console.error('Image analysis error:', error)
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error)
    
    // Check if it's a quota error
    if (errorMessage.includes('429') || errorMessage.includes('quota') || errorMessage.includes('Too Many Requests')) {
      console.warn('API quota exceeded for image analysis')
      return {
        riskScore: 55,
        riskLevel: 'medium',
        confidence: 68,
        redFlags: ['Service temporarily overloaded - please retry soon'],
        explanation: 'Our AI service is currently experiencing high demand. Image analysis is temporarily limited.',
        recommendation: 'Please try again in a few minutes. In the meantime, manually inspect the image for obvious red flags like suspicious login forms, urgency text, or logo mismatches.',
      }
    }
    
    return {
      riskScore: 50,
      riskLevel: 'medium',
      confidence: 75,
      redFlags: ['Unable to fully analyze image'],
      explanation: 'Analysis encountered issues analyzing the screenshot.',
      recommendation: 'Review the image manually for suspicious content.',
    }
  }
}
