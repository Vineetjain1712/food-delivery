"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2, AlertTriangle } from "lucide-react"

export function ConnectionTest() {
  const [connectionStatus, setConnectionStatus] = useState<"testing" | "connected" | "error" | "config-error">(
    "testing",
  )
  const [error, setError] = useState<string>("")

  const testConnection = async () => {
    setConnectionStatus("testing")
    setError("")

    try {
      // First check if environment variables are available
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        setConnectionStatus("config-error")
        setError("Missing Supabase environment variables. Please check your .env.local file.")
        return
      }

      const supabase = createClient()

      // Test the connection by trying to get the current session
      const { data, error: authError } = await supabase.auth.getSession()

      if (authError) {
        throw authError
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

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case "testing":
        return <Loader2 className="w-5 h-5 animate-spin" />
      case "connected":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "config-error":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-600" />
    }
  }

  const getStatusTitle = () => {
    switch (connectionStatus) {
      case "testing":
        return "Testing Supabase Connection"
      case "connected":
        return "Supabase Connected"
      case "config-error":
        return "Configuration Error"
      case "error":
        return "Connection Failed"
    }
  }

  const getStatusDescription = () => {
    switch (connectionStatus) {
      case "testing":
        return "Verifying environment variables and database connection..."
      case "connected":
        return "Successfully connected to Supabase! All systems ready."
      case "config-error":
        return "Environment variables are missing or invalid."
      case "error":
        return "Failed to connect to Supabase database."
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          {getStatusTitle()}
        </CardTitle>
        <CardDescription>{getStatusDescription()}</CardDescription>
      </CardHeader>
      {(connectionStatus === "error" || connectionStatus === "config-error" || error) && (
        <CardContent>
          <div
            className={`text-sm p-3 rounded-md ${
              connectionStatus === "config-error"
                ? "text-yellow-800 bg-yellow-50 border border-yellow-200"
                : "text-red-600 bg-red-50 border border-red-200"
            }`}
          >
            <p className="font-medium">
              {connectionStatus === "config-error" ? "Configuration Issue:" : "Connection Error:"}
            </p>
            <p>{error}</p>
            {connectionStatus === "config-error" && (
              <div className="mt-2 text-xs">
                <p>Required environment variables:</p>
                <ul className="list-disc list-inside ml-2">
                  <li>NEXT_PUBLIC_SUPABASE_URL</li>
                  <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
                </ul>
              </div>
            )}
          </div>
          <Button onClick={testConnection} className="mt-3" size="sm">
            Retry Connection
          </Button>
        </CardContent>
      )}
    </Card>
  )
}
