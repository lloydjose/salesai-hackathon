import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth'; // Assuming auth setup
import { prisma } from '@/lib/prisma'; // Assuming prisma setup
import { ApifyClient } from 'apify-client';
import { z } from 'zod';

// Input validation schema
const researchSchema = z.object({
  linkedinUrl: z.string().url({ message: "Invalid LinkedIn URL format" }),
});

// Initialize Apify Client (ensure API token is in .env)
const apifyClient = new ApifyClient({
    token: process.env.APIFY_API_TOKEN,
});

// Apify Actor ID for LinkedIn Profile Scraper
const LINKEDIN_PROFILE_ACTOR_ID = "2SyF0bVxmgGr8IVCZ"; // Replace if using a different actor

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    const body = await request.json();

    // Validate input
    const validation = researchSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ message: 'Invalid input', errors: validation.error.errors }, { status: 400 });
    }
    const { linkedinUrl } = validation.data;

    console.log(`[API Prospects Research] Received request for URL: ${linkedinUrl} by user: ${userId}`);

    // Prepare Apify Actor input
    const apifyInput = {
        "profileUrls": [linkedinUrl]
    };

    // Run the Apify Actor
    console.log(`[API Prospects Research] Calling Apify Actor: ${LINKEDIN_PROFILE_ACTOR_ID}...`);
    const run = await apifyClient.actor(LINKEDIN_PROFILE_ACTOR_ID).call(apifyInput);
    console.log(`[API Prospects Research] Apify run started: ${run.id}`);

    // Fetch results from the run's dataset
    console.log(`[API Prospects Research] Fetching results from dataset: ${run.defaultDatasetId}...`);
    const { items } = await apifyClient.dataset(run.defaultDatasetId).listItems({ limit: 1 }); // Limit to 1 as we only expect one profile

    if (!items || items.length === 0) {
        console.error(`[API Prospects Research] No items returned from Apify for URL: ${linkedinUrl}`);
        return NextResponse.json({ message: 'Could not retrieve profile data from LinkedIn.' }, { status: 404 });
    }

    const apifyResult = items[0]; // Get the first (and should be only) result
    console.log(`[API Prospects Research] Apify result received:`, !!apifyResult); // Log presence, not the full object initially

    // --- Save to Database ---
    // Explicitly cast to string to satisfy the linter
    const prospectName = (apifyResult?.fullName ?? 'Unknown Prospect') as string;

    // Upsert: Create or update based on linkedinProfileUrl and userId to avoid duplicates
    const prospect = await prisma.prospect.upsert({
        where: {
            // Need a unique constraint in Prisma schema: @@unique([userId, linkedinProfileUrl])
            // Assuming that constraint exists:
             userId_linkedinProfileUrl: { // Use the compound unique index name if defined
                 userId: userId,
                 linkedinProfileUrl: linkedinUrl,
             }
            // If no unique constraint:
            // id: undefined, // This won't work for upsert lookup
            // Need a way to find existing record reliably. Using URL+User is best.
        },
        update: {
            name: prospectName,
            linkedinData: apifyResult as any, // Store the full Apify JSON response
            source: 'LINKEDIN',
            // Add other fields parsed from apifyResult if desired (e.g., jobTitle, companyName)
            // jobTitle: apifyResult?.headline,
            // companyName: apifyResult?.companyName,
        },
        create: {
            userId: userId,
            name: prospectName,
            linkedinProfileUrl: linkedinUrl,
            linkedinData: apifyResult as any, // Store the full Apify JSON response
            source: 'LINKEDIN',
            // Add other fields parsed from apifyResult if desired
            // jobTitle: apifyResult?.headline,
            // companyName: apifyResult?.companyName,
        },
    });

    console.log(`[API Prospects Research] Prospect saved/updated successfully. ID: ${prospect.id}`);

    // Return the created/updated prospect data (or just success message)
    return NextResponse.json(prospect, { status: 201 }); // 201 Created (or 200 OK if updated)

  } catch (error: any) {
    console.error("[API Prospects Research] Error:", error);
    // Check for specific Apify errors if needed
    return NextResponse.json({ message: 'Failed to research prospect', error: error.message || 'Unknown server error' }, { status: 500 });
  }
} 