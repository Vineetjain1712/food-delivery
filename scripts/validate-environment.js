// Environment validation script
import { validateConfig } from "../lib/config.js"

console.log("🔍 Validating Environment Configuration...\n")

try {
  // Validate configuration
  validateConfig()
  console.log("✅ All required environment variables are present\n")

  // Check specific configurations
  const requiredVars = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "SUPABASE_JWT_SECRET",
    "DATABASE_URL",
    "NEXTAUTH_SECRET",
  ]

  console.log("📋 Environment Variables Status:")
  requiredVars.forEach((varName) => {
    const value = process.env[varName]
    if (value) {
      // Show partial value for security
      const displayValue = varName.startsWith("NEXT_PUBLIC_") ? value : `${value.substring(0, 10)}...`
      console.log(`   ✅ ${varName}: ${displayValue}`)
    } else {
      console.log(`   ❌ ${varName}: Not set`)
    }
  })

  // Validate URL format
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (supabaseUrl) {
    try {
      const url = new URL(supabaseUrl)
      if (url.hostname.includes("supabase.co")) {
        console.log("\n✅ Supabase URL format is valid")
      } else {
        console.log("\n⚠️  Warning: URL doesn't appear to be a Supabase URL")
      }
    } catch (error) {
      console.log("\n❌ Invalid Supabase URL format")
    }
  }

  // Check JWT token format
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (anonKey) {
    try {
      const parts = anonKey.split(".")
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]))
        if (payload.role === "anon") {
          console.log("✅ Anon key format is valid")
          console.log(`   Token expires: ${new Date(payload.exp * 1000).toLocaleDateString()}`)
        } else {
          console.log('⚠️  Warning: Token role is not "anon"')
        }
      } else {
        console.log("❌ Invalid JWT format for anon key")
      }
    } catch (error) {
      console.log("❌ Could not validate anon key format")
    }
  }

  console.log("\n🎉 Environment configuration is valid!")
  console.log("\n📝 Next Steps:")
  console.log("1. Ensure your .env.local file is not committed to version control")
  console.log("2. Set up the same environment variables in your production environment")
  console.log("3. Run the database setup script if you haven't already")
} catch (error) {
  console.error("❌ Configuration Error:", error.message)
  console.log("\n🔧 How to fix:")
  console.log("1. Create a .env.local file in your project root")
  console.log("2. Add all required environment variables")
  console.log("3. Get the missing values from your Supabase dashboard")
  process.exit(1)
}
