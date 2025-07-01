"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, ArrowLeft, ArrowRight, User, Building, Target, FileCheck } from "lucide-react"

interface FormData {
  // Personal Information
  firstName: string
  lastName: string
  email: string
  jobTitle: string

  // Company Information
  companyName: string
  companySize: string
  industry: string
  website: string

  // Product Preferences
  useCase: string
  goals: string[]
  budget: string
  timeline: string

  // Additional
  newsletter: boolean
  terms: boolean
}

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  jobTitle: "",
  companyName: "",
  companySize: "",
  industry: "",
  website: "",
  useCase: "",
  goals: [],
  budget: "",
  timeline: "",
  newsletter: false,
  terms: false,
}

const steps = [
  {
    id: 1,
    title: "Personal Information",
    description: "Tell us about yourself",
    icon: User,
  },
  {
    id: 2,
    title: "Company Details",
    description: "Information about your organization",
    icon: Building,
  },
  {
    id: 3,
    title: "Product Preferences",
    description: "How do you plan to use our product?",
    icon: Target,
  },
  {
    id: 4,
    title: "Review & Submit",
    description: "Review your information",
    icon: FileCheck,
  },
]

const companySizes = ["1-10 employees", "11-50 employees", "51-200 employees", "201-1000 employees", "1000+ employees"]

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "E-commerce",
  "Manufacturing",
  "Marketing",
  "Consulting",
  "Other",
]

const goalOptions = [
  "Increase productivity",
  "Reduce costs",
  "Improve collaboration",
  "Scale operations",
  "Better analytics",
  "Automate processes",
]

const budgetRanges = ["Under $1,000/month", "$1,000 - $5,000/month", "$5,000 - $10,000/month", "$10,000+ /month"]

const timelines = [
  "Immediate (within 1 month)",
  "Short-term (1-3 months)",
  "Medium-term (3-6 months)",
  "Long-term (6+ months)",
]

export default function Component() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 1:
        if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
        if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
        if (!formData.email.trim()) newErrors.email = "Email is required"
        if (!formData.jobTitle.trim()) newErrors.jobTitle = "Job title is required"
        break
      case 2:
        if (!formData.companyName.trim()) newErrors.companyName = "Company name is required"
        if (!formData.companySize) newErrors.companySize = "Company size is required"
        if (!formData.industry) newErrors.industry = "Industry is required"
        break
      case 3:
        if (!formData.useCase.trim()) newErrors.useCase = "Use case is required"
        if (formData.goals.length === 0) newErrors.goals = "Please select at least one goal"
        if (!formData.budget) newErrors.budget = "Budget range is required"
        if (!formData.timeline) newErrors.timeline = "Timeline is required"
        break
      case 4:
        if (!formData.terms) newErrors.terms = "You must accept the terms and conditions"
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleGoalToggle = (goal: string) => {
    const updatedGoals = formData.goals.includes(goal)
      ? formData.goals.filter((g) => g !== goal)
      : [...formData.goals, goal]
    updateFormData("goals", updatedGoals)
  }

  const handleSubmit = () => {
    if (validateStep(4)) {
      console.log("Form submitted:", formData)
      // Here you would typically send the data to your backend
      alert("Onboarding completed successfully!")
    }
  }

  const progress = (currentStep / steps.length) * 100

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Welcome to Our Platform</h1>
            <span className="text-sm text-gray-500">
              Step {currentStep} of {steps.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />

          {/* Step Indicators */}
          <div className="flex justify-between mt-6">
            {steps.map((step) => {
              const Icon = step.icon
              const isCompleted = currentStep > step.id
              const isCurrent = currentStep === step.id

              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      isCompleted
                        ? "bg-green-500 border-green-500 text-white"
                        : isCurrent
                          ? "bg-blue-500 border-blue-500 text-white"
                          : "bg-white border-gray-300 text-gray-400"
                    }`}
                  >
                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <div className="text-center mt-2">
                    <p className={`text-xs font-medium ${isCurrent ? "text-blue-600" : "text-gray-500"}`}>
                      {step.title}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            <CardDescription>{steps[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => updateFormData("firstName", e.target.value)}
                      className={errors.firstName ? "border-red-500" : ""}
                    />
                    {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => updateFormData("lastName", e.target.value)}
                      className={errors.lastName ? "border-red-500" : ""}
                    />
                    {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title *</Label>
                  <Input
                    id="jobTitle"
                    value={formData.jobTitle}
                    onChange={(e) => updateFormData("jobTitle", e.target.value)}
                    className={errors.jobTitle ? "border-red-500" : ""}
                  />
                  {errors.jobTitle && <p className="text-sm text-red-500">{errors.jobTitle}</p>}
                </div>
              </div>
            )}

            {/* Step 2: Company Information */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => updateFormData("companyName", e.target.value)}
                    className={errors.companyName ? "border-red-500" : ""}
                  />
                  {errors.companyName && <p className="text-sm text-red-500">{errors.companyName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companySize">Company Size *</Label>
                  <Select value={formData.companySize} onValueChange={(value) => updateFormData("companySize", value)}>
                    <SelectTrigger className={errors.companySize ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent>
                      {companySizes.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.companySize && <p className="text-sm text-red-500">{errors.companySize}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry *</Label>
                  <Select value={formData.industry} onValueChange={(value) => updateFormData("industry", value)}>
                    <SelectTrigger className={errors.industry ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.industry && <p className="text-sm text-red-500">{errors.industry}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Company Website</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://example.com"
                    value={formData.website}
                    onChange={(e) => updateFormData("website", e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Product Preferences */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="useCase">Primary Use Case *</Label>
                  <Textarea
                    id="useCase"
                    placeholder="Describe how you plan to use our product..."
                    value={formData.useCase}
                    onChange={(e) => updateFormData("useCase", e.target.value)}
                    className={errors.useCase ? "border-red-500" : ""}
                  />
                  {errors.useCase && <p className="text-sm text-red-500">{errors.useCase}</p>}
                </div>

                <div className="space-y-3">
                  <Label>What are your main goals? *</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {goalOptions.map((goal) => (
                      <div key={goal} className="flex items-center space-x-2">
                        <Checkbox
                          id={goal}
                          checked={formData.goals.includes(goal)}
                          onCheckedChange={() => handleGoalToggle(goal)}
                        />
                        <Label htmlFor={goal} className="text-sm font-normal">
                          {goal}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {errors.goals && <p className="text-sm text-red-500">{errors.goals}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Budget Range *</Label>
                  <Select value={formData.budget} onValueChange={(value) => updateFormData("budget", value)}>
                    <SelectTrigger className={errors.budget ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      {budgetRanges.map((range) => (
                        <SelectItem key={range} value={range}>
                          {range}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.budget && <p className="text-sm text-red-500">{errors.budget}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeline">Implementation Timeline *</Label>
                  <Select value={formData.timeline} onValueChange={(value) => updateFormData("timeline", value)}>
                    <SelectTrigger className={errors.timeline ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      {timelines.map((timeline) => (
                        <SelectItem key={timeline} value={timeline}>
                          {timeline}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.timeline && <p className="text-sm text-red-500">{errors.timeline}</p>}
                </div>
              </div>
            )}

            {/* Step 4: Review & Submit */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">Personal Information</h3>
                    <p className="text-sm text-gray-600">
                      {formData.firstName} {formData.lastName} • {formData.email} • {formData.jobTitle}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Company Details</h3>
                    <p className="text-sm text-gray-600">
                      {formData.companyName} • {formData.companySize} • {formData.industry}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Product Preferences</h3>
                    <p className="text-sm text-gray-600">
                      Budget: {formData.budget} • Timeline: {formData.timeline}
                    </p>
                    <p className="text-sm text-gray-600">Goals: {formData.goals.join(", ")}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="newsletter"
                      checked={formData.newsletter}
                      onCheckedChange={(checked) => updateFormData("newsletter", checked)}
                    />
                    <Label htmlFor="newsletter" className="text-sm">
                      Subscribe to our newsletter for product updates and tips
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.terms}
                      onCheckedChange={(checked) => updateFormData("terms", checked)}
                    />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the Terms of Service and Privacy Policy *
                    </Label>
                  </div>
                  {errors.terms && <p className="text-sm text-red-500">{errors.terms}</p>}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>

              {currentStep < steps.length ? (
                <Button onClick={nextStep} className="flex items-center gap-2">
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                  Complete Onboarding
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
