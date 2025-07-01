"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface OnboardingData {
  firstName: string
  lastName: string
  email: string
  jobTitle: string
  companyName: string
  companySize: string
  industry: string
  website: string
  useCase: string
  goals: string[]
  budget: string
  timeline: string
  newsletter: boolean
  terms: boolean
}

export async function saveOnboardingData(data: OnboardingData) {
  const supabase = await createClient()

  try {
    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, error: "User not authenticated" }
    }

    // Start a transaction-like operation
    // First, create or update the profile
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: user.id,
      first_name: data.firstName,
      last_name: data.lastName,
      job_title: data.jobTitle,
    })

    if (profileError) {
      console.error("Profile error:", profileError)
      return { success: false, error: "Failed to save profile information" }
    }

    // Create the company
    const { data: companyData, error: companyError } = await supabase
      .from("companies")
      .insert({
        name: data.companyName,
        size: data.companySize,
        industry: data.industry,
        website: data.website || null,
      })
      .select()
      .single()

    if (companyError) {
      console.error("Company error:", companyError)
      return { success: false, error: "Failed to save company information" }
    }

    // Save the onboarding data
    const { error: onboardingError } = await supabase.from("onboarding_data").upsert({
      user_id: user.id,
      company_id: companyData.id,
      use_case: data.useCase,
      goals: data.goals,
      budget: data.budget,
      timeline: data.timeline,
      newsletter_subscription: data.newsletter,
      terms_accepted: data.terms,
      completed_at: new Date().toISOString(),
    })

    if (onboardingError) {
      console.error("Onboarding error:", onboardingError)
      return { success: false, error: "Failed to save onboarding data" }
    }

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Unexpected error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function getOnboardingData() {
  const supabase = await createClient()

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, error: "User not authenticated" }
    }

    // Get profile data
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    // Get onboarding data with company info
    const { data: onboardingData, error: onboardingError } = await supabase
      .from("onboarding_data")
      .select(`
        *,
        companies (*)
      `)
      .eq("user_id", user.id)
      .single()

    if (profileError && profileError.code !== "PGRST116") {
      console.error("Profile fetch error:", profileError)
    }

    if (onboardingError && onboardingError.code !== "PGRST116") {
      console.error("Onboarding fetch error:", onboardingError)
    }

    return {
      success: true,
      data: {
        profile: profile || null,
        onboarding: onboardingData || null,
      },
    }
  } catch (error) {
    console.error("Unexpected error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
