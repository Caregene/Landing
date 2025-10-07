import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    })

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { email, permission = "view", expiresIn = 7 } = await request.json()
    const documentId = params.id

    // Verify user owns the document
    const { data: document } = await supabase
      .from("documents")
      .select("id, user_id")
      .eq("id", documentId)
      .eq("user_id", user.id)
      .single()

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    // Generate access token
    const accessToken = crypto.randomUUID()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + expiresIn)

    // Create share record
    const { data: share, error } = await supabase
      .from("document_shares")
      .insert({
        document_id: documentId,
        shared_by: user.id,
        shared_with_email: email,
        permission_level: permission,
        expires_at: expiresAt.toISOString(),
        access_token: accessToken,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: "Failed to create share" }, { status: 500 })
    }

    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/shared/${accessToken}`

    return NextResponse.json({
      shareUrl,
      expiresAt: expiresAt.toISOString(),
      permission,
    })
  } catch (error) {
    console.error("Error creating document share:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    })

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const documentId = params.id

    // Get all shares for this document
    const { data: shares, error } = await supabase
      .from("document_shares")
      .select("*")
      .eq("document_id", documentId)
      .eq("shared_by", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: "Failed to fetch shares" }, { status: 500 })
    }

    return NextResponse.json({ shares })
  } catch (error) {
    console.error("Error fetching document shares:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
