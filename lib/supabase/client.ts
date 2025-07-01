import { createBrowserClient } from "@supabase/ssr"
import { getClientConfig } from "@/lib/config"

export function createClient() {
  const config = getClientConfig()

  return createBrowserClient(config.supabase.url, config.supabase.anonKey)
}
