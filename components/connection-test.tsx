"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export function ConnectionTest() {
  const [connectionStatus, setConnectionStatus] = useState<"testing" | "connected" | "error">("testing")
  const [error, setError] = useState<string>("")

  const testConnection = async () => {
    setConnectionStatus("testing")
    setError("")

    try {
      const supabase = createClient()

      // Test the connection by trying to get the current session
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        throw error
      }

      // Test database connection by trying to query a system table
      const { error: dbError } = await supabase.from("profiles").select("count").limit(1)

      if (dbError && dbError.code !== "PGRST116") {
        // PGRST116 is "table not found" which is expected if tables aren't created yet
        throw dbError
      }

      setConnectionStatus("connected")
    } catch (err: any) {
      setConnectionStatus("error")
      setError(err.message || "Unknown error occurred")
    }
  }

  useEffect(() => {
    testConnection()
  }, [])

  return (
    <Card className="w-full max-w-md mx-auto mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {connectionStatus === "testing" && <Loader2 className="w-5 h-5 animate-spin" />}
          {connectionStatus === "connected" && <CheckCircle className="w-5 h-5 text-green-600" />}
          {connectionStatus === "error" && <XCircle className="w-5 h-5 text-red-600" />}
          Supabase Connection
        </CardTitle>
        <CardDescription>
          {connectionStatus === "testing" && "Testing connection to Supabase..."}
          {connectionStatus === "connected" && "Successfully connected to Supabase!"}
          {connectionStatus === "error" && "Failed to connect to Supabase"}
        </CardDescription>
      </CardHeader>
      {(connectionStatus === "error" || error) && (
        <CardContent>
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
            <p className="font-medium">Connection Error:</p>
            <p>{error}</p>
          </div>
          <Button onClick={testConnection} className="mt-3" size="sm">
            Retry Connection
          </Button>
        </CardContent>
      )}
    </Card>
  )
}
