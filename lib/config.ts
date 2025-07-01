// Client-side configuration (safe to expose)
export const clientConfig = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  },
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  },
} as const

// Server-side configuration (sensitive data)
export const serverConfig = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    jwtSecret: process.env.SUPABASE_JWT_SECRET!,
  },
  database: {
    url: process.env.DATABASE_URL!,
  },
  auth: {
    secret: process.env.NEXTAUTH_SECRET!,
    url: process.env.NEXTAUTH_URL || "http://localhost:3000",
  },
  email: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT ? Number.parseInt(process.env.SMTP_PORT) : 587,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
} as const

// Validation function to ensure all required env vars are present
export function validateConfig() {
  const requiredClientVars = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"]

  const requiredServerVars = ["SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_JWT_SECRET", "DATABASE_URL", "NEXTAUTH_SECRET"]

  const missingVars: string[] = []

  // Check client vars
  requiredClientVars.forEach((varName) => {
    if (!process.env[varName]) {
      missingVars.push(varName)
    }
  })

  // Check server vars (only on server side)
  if (typeof window === "undefined") {
    requiredServerVars.forEach((varName) => {
      if (!process.env[varName]) {
        missingVars.push(varName)
      }
    })
  }

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}\n` +
        "Please check your .env.local file and ensure all required variables are set.",
    )
  }

  return true
}

// Helper to get config safely
export function getClientConfig() {
  try {
    validateConfig()
    return clientConfig
  } catch (error) {
    console.error("Configuration error:", error)
    throw error
  }
}

export function getServerConfig() {
  try {
    validateConfig()
    return serverConfig
  } catch (error) {
    console.error("Configuration error:", error)
    throw error
  }
}
