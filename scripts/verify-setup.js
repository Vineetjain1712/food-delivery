// Verify Supabase connection and environment setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log("🔍 Verifying Supabase Setup...\n")

// Check environment variables
if (!supabaseUrl) {
  console.error("❌ NEXT_PUBLIC_SUPABASE_URL is not set")
  process.exit(1)
} else {
  console.log("✅ NEXT_PUBLIC_SUPABASE_URL is configured")
  console.log(`   URL: ${supabaseUrl}`)
}

if (!supabaseKey) {
  console.error("❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is not set")
  process.exit(1)
} else {
  console.log("✅ NEXT_PUBLIC_SUPABASE_ANON_KEY is configured")
  console.log(`   Key: ${supabaseKey.substring(0, 20)}...`)
}

// Validate URL format
try {
  const url = new URL(supabaseUrl)
  if (!url.hostname.includes("supabase.co")) {
    console.warn("⚠️  URL doesn't appear to be a Supabase URL")
  } else {
    console.log("✅ Supabase URL format is valid")
  }
} catch (error) {
  console.error("❌ Invalid Supabase URL format")
  process.exit(1)
}

// Test JWT token format (basic validation)
try {
  const parts = supabaseKey.split(".")
  if (parts.length !== 3) {
    throw new Error("Invalid JWT format")
  }

  // Decode the payload (second part)
  const payload = JSON.parse(atob(parts[1]))

  if (payload.role !== "anon") {
    console.warn('⚠️  Token role is not "anon", expected anon key')
  } else {
    console.log("✅ Anon key format is valid")
  }

  if (payload.iss !== "supabase") {
    console.warn('⚠️  Token issuer is not "supabase"')
  }

  console.log(`   Token expires: ${new Date(payload.exp * 1000).toLocaleDateString()}`)
} catch (error) {
  console.error("❌ Invalid anon key format:", error.message)
  process.exit(1)
}

console.log("\n🎉 Supabase configuration looks good!")
console.log("\nNext steps:")
console.log("1. Run the database setup script: scripts/create-onboarding-tables.sql")
console.log("2. Configure authentication settings in your Supabase dashboard")
console.log("3. Add the callback URL to your Supabase auth settings:")
console.log("   - http://localhost:3000/auth/callback (for development)")
console.log("   - https://yourdomain.com/auth/callback (for production)")
