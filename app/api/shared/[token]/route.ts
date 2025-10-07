import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function GET(request: NextRequest, { params }: { params: { token: string } }) {
  try {
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        get() {
          return undefined
        },
      },
    })

    const token = params.token

    // Find the share record
    const { data: share, error: shareError } = await supabase
      .from("document_shares")
      .select(`
        *,
        documents (
          id,
          title,
          description,
          file_name,
          file_size,
          mime_type,
          document_date,
          provider_name,
          tags,
          extracted_text,
          created_at
        )
      `)
      .eq("access_token", token)
      .single()

    if (shareError || !share) {
      return NextResponse.json({ error: "Invalid or expired link" }, { status: 404 })
    }

    // Check if the share has expired
    if (share.expires_at && new Date(share.expires_at) < new Date()) {
      return NextResponse.json({ error: "Link has expired" }, { status: 410 })
    }

    // Update access timestamp
    await supabase.from("document_shares").update({ accessed_at: new Date().toISOString() }).eq("id", share.id)

    // Return document with permission info
    const document = {
      ...share.documents,
      permission_level: share.permission_level,
      expires_at: share.expires_at,
      shared_by_email: share.shared_with_email,
    }

    return NextResponse.json({ document })
  } catch (error) {
    console.error("Error fetching shared document:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
