// Fetch Credly badge images and check Oracle badge URL
const badges = [
  {
    name: "nvidia-agentic-ai",
    // Credly badge public page - we'll check the OG image meta tag
    url: "https://www.credly.com/badges/a9e40292-05b5-4191-9fc3-aa626a9ed74f",
  },
  {
    name: "nvidia-gen-ai-llms",
    url: "https://www.credly.com/badges/4e81163f-fdf3-409a-b5d5-83a9029e75c3",
  },
];

// Try to fetch the HTML and find the og:image meta tag
async function findBadgeImageUrl(badge) {
  try {
    const response = await fetch(badge.url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "text/html",
      },
      redirect: "follow",
    });
    const html = await response.text();

    // Look for og:image meta tag
    const ogImageMatch = html.match(
      /property="og:image"\s+content="([^"]+)"/
    );
    if (ogImageMatch) {
      console.log(`[${badge.name}] OG Image: ${ogImageMatch[1]}`);
      return ogImageMatch[1];
    }

    // Also try content before property
    const ogImageMatch2 = html.match(
      /content="([^"]+)"\s+property="og:image"/
    );
    if (ogImageMatch2) {
      console.log(`[${badge.name}] OG Image (alt): ${ogImageMatch2[1]}`);
      return ogImageMatch2[1];
    }

    // Look for any credly image URL in the HTML
    const credlyImageMatch = html.match(
      /https:\/\/images\.credly\.com\/[^"'\s]+/
    );
    if (credlyImageMatch) {
      console.log(`[${badge.name}] Credly Image: ${credlyImageMatch[0]}`);
      return credlyImageMatch[0];
    }

    console.log(`[${badge.name}] No image found in HTML`);
    // Log first 2000 chars for debugging
    console.log(`[${badge.name}] HTML preview: ${html.substring(0, 2000)}`);
  } catch (err) {
    console.log(`[${badge.name}] Error: ${err.message}`);
  }
}

// Also check Oracle badge image
async function checkOracleBadge() {
  const urls = [
    "https://brm-workforce.oracle.com/pdf/certview/images/OCI2025GAIOCP.png",
    "https://brm-workforce.oracle.com/pdf/certview/images/OCI2024GAIOCP.png",
  ];

  for (const url of urls) {
    try {
      const response = await fetch(url, { method: "HEAD" });
      console.log(`[Oracle] ${url} - Status: ${response.status}`);
    } catch (err) {
      console.log(`[Oracle] ${url} - Error: ${err.message}`);
    }
  }
}

async function main() {
  for (const badge of badges) {
    await findBadgeImageUrl(badge);
  }
  await checkOracleBadge();
}

main();
