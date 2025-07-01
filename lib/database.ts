import { getServerConfig } from "./config"

// Database connection utility using environment variables
export function getDatabaseUrl() {
  const config = getServerConfig()
  return config.database.url
}

// Helper to create database connection string from parts
export function createDatabaseUrl(options: {
  host: string
  port: number
  database: string
  username: string
  password: string
  ssl?: boolean
}) {
  const { host, port, database, username, password, ssl = true } = options

  const sslParam = ssl ? "?sslmode=require" : ""
  return `postgresql://${username}:${password}@${host}:${port}/${database}${sslParam}`
}

// Validate database connection
export async function validateDatabaseConnection() {
  try {
    const { createClient } = await import("@/lib/supabase/server")
    const supabase = await createClient()

    // Test connection with a simple query
    const { error } = await supabase.from("profiles").select("count").limit(1)

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "table not found" which is expected if tables aren't created yet
      throw error
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
