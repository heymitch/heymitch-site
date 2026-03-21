import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

const VALID_PRODUCTS = ["low-ticket-launchpad", "category-newsletter-creator", "ship30for30"];

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.ADMIN_API_KEY}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { email, product, expires_in_days, metadata } = body;

  if (!email || !product) {
    return NextResponse.json(
      { error: "email and product are required" },
      { status: 400 }
    );
  }

  if (!VALID_PRODUCTS.includes(product)) {
    return NextResponse.json(
      { error: `Invalid product. Valid: ${VALID_PRODUCTS.join(", ")}` },
      { status: 400 }
    );
  }

  const supabase = getSupabase();

  const { data: existing } = await supabase
    .from("plugin_access")
    .select("token")
    .eq("email", email)
    .eq("product", product)
    .single();

  if (existing) {
    const installUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://heymitch.ai"}/api/install/${product}/${existing.token}`;
    return NextResponse.json({
      status: "existing",
      email,
      product,
      install_url: installUrl,
    });
  }

  const expiresAt = expires_in_days
    ? new Date(Date.now() + expires_in_days * 86400000).toISOString()
    : null;

  const { data: access, error } = await supabase
    .from("plugin_access")
    .insert({
      email,
      product,
      expires_at: expiresAt,
      metadata: metadata || {},
    })
    .select("token")
    .single();

  if (error) {
    console.error("Grant access error:", error);
    return NextResponse.json(
      { error: "Failed to grant access" },
      { status: 500 }
    );
  }

  const installUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://heymitch.ai"}/api/install/${product}/${access.token}`;

  return NextResponse.json({
    status: "created",
    email,
    product,
    install_url: installUrl,
    expires_at: expiresAt,
  });
}
