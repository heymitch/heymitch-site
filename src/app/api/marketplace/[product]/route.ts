import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

// Map product slugs to their marketplace data files
// Add new products here as you create them
const MARKETPLACE_FILES: Record<string, () => Promise<unknown>> = {
  ccb: () => import("@/data/marketplaces/ccb.json").then((m) => m.default),
  // Future products:
  // operator: () => import("@/data/marketplaces/operator.json").then(m => m.default),
  // consulting: () => import("@/data/marketplaces/consulting.json").then(m => m.default),
};

export async function GET(
  request: NextRequest,
  { params }: { params: { product: string } }
) {
  const { product } = params;
  const token = request.nextUrl.searchParams.get("token");

  // Check if product exists
  const loader = MARKETPLACE_FILES[product];
  if (!loader) {
    return NextResponse.json(
      { error: "Unknown marketplace" },
      { status: 404 }
    );
  }

  // Optional token gating — if a token is provided, validate it.
  // If no token param in URL, serve openly (for ungated marketplaces).
  // To REQUIRE tokens, flip the flag below for the product.
  const REQUIRE_TOKEN: Record<string, boolean> = {
    ccb: false, // Set to true when ready to gate
  };

  if (REQUIRE_TOKEN[product] && !token) {
    return NextResponse.json(
      { error: "Access token required. Check your purchase email for the correct link." },
      { status: 403 }
    );
  }

  if (token) {
    const supabase = getSupabase();

    const { data: access, error: lookupError } = await supabase
      .from("plugin_access")
      .select("*")
      .eq("token", token)
      .eq("product", product)
      .single();

    if (lookupError || !access) {
      return NextResponse.json(
        { error: "Invalid access token. Check your purchase email or contact support@heymitch.ai" },
        { status: 403 }
      );
    }

    if (access.expires_at && new Date(access.expires_at) < new Date()) {
      return NextResponse.json(
        { error: "Access token expired. Contact support@heymitch.ai for renewal." },
        { status: 403 }
      );
    }

    // Track marketplace sync
    await supabase
      .from("plugin_access")
      .update({
        install_count: (access.install_count || 0) + 1,
        last_installed_at: new Date().toISOString(),
      })
      .eq("id", access.id);
  }

  // Serve the marketplace JSON
  const marketplace = await loader();

  return NextResponse.json(marketplace, {
    headers: {
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  });
}
