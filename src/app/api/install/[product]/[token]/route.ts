import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

const VALID_PRODUCTS = ["low-ticket-launchpad", "category-newsletter-creator", "ship30for30"];

const PRODUCT_NAMES: Record<string, string> = {
  "low-ticket-launchpad": "Low Ticket Launchpad",
  "category-newsletter-creator": "Category Newsletter Creator",
  "ship30for30": "Ship 30 for 30",
};

function isBrowser(request: NextRequest): boolean {
  const accept = request.headers.get("accept") || "";
  return accept.includes("text/html");
}

function errorRedirect(request: NextRequest, message: string): NextResponse {
  if (isBrowser(request)) {
    const url = new URL("/plugins/error", request.url);
    url.searchParams.set("message", message);
    return NextResponse.redirect(url);
  }
  return NextResponse.json({ error: message }, { status: 403 });
}

export async function GET(
  request: NextRequest,
  { params }: { params: { product: string; token: string } }
) {
  const { product, token } = params;
  const supabase = getSupabase();

  if (!VALID_PRODUCTS.includes(product)) {
    return errorRedirect(request, "Unknown product");
  }

  const { data: access, error: lookupError } = await supabase
    .from("plugin_access")
    .select("*")
    .eq("token", token)
    .eq("product", product)
    .single();

  if (lookupError || !access) {
    return errorRedirect(
      request,
      "This install link isn't valid. Check your email for the correct link, or contact support@heymitch.ai"
    );
  }

  if (access.expires_at && new Date(access.expires_at) < new Date()) {
    return errorRedirect(
      request,
      "This install link has expired. Contact support@heymitch.ai for a new one."
    );
  }

  const { data: fileData, error: downloadError } = await supabase.storage
    .from("plugin-zips")
    .download(`${product}.zip`);

  if (downloadError || !fileData) {
    console.error("Storage download error:", downloadError);
    return errorRedirect(request, "Plugin temporarily unavailable. Try again in a few minutes.");
  }

  // Track the install
  await supabase
    .from("plugin_access")
    .update({
      install_count: (access.install_count || 0) + 1,
      last_installed_at: new Date().toISOString(),
    })
    .eq("id", access.id);

  // If opened in a browser, show a success page instead of downloading
  if (isBrowser(request)) {
    const url = new URL("/plugins/success", request.url);
    url.searchParams.set("product", PRODUCT_NAMES[product] || product);
    return NextResponse.redirect(url);
  }

  // Serve the ZIP (for Cowork / programmatic access)
  const buffer = Buffer.from(await fileData.arrayBuffer());

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${product}.zip"`,
      "Content-Length": buffer.length.toString(),
    },
  });
}
