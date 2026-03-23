import { Resend } from "resend";
import { env, hasResend } from "@/lib/env";
import type { DealMatch, GeneratedItinerary, TravelerProfile } from "@/lib/types";
import { currency } from "@/lib/utils";

function createResendClient() {
  return hasResend() ? new Resend(env.resendApiKey) : undefined;
}

function renderDealMatchEmail(match: DealMatch, profile: TravelerProfile) {
  return `
    <div style="font-family: Georgia, serif; line-height: 1.5; color: #102116">
      <h1 style="font-family: 'Trebuchet MS', sans-serif; margin-bottom: 8px;">Cheap trip found: ${match.destinationCity}</h1>
      <p>${profile.fullName}, a qualifying round-trip fare just cleared your threshold.</p>
      <ul>
        <li>Destination: ${match.destinationCity}</li>
        <li>Dates: ${match.departureDate} to ${match.returnDate}</li>
        <li>Fare: ${currency(match.totalFareUsd)}</li>
        <li>Transfer type: ${match.transferType}</li>
      </ul>
      <p><a href="${match.deepLink}">Open booking handoff</a></p>
      <p><a href="${env.appUrl}/deal-matches/${match.id}">Mark as booked</a></p>
    </div>
  `;
}

function renderItineraryEmail(itinerary: GeneratedItinerary, profile: TravelerProfile) {
  return `
    <div style="font-family: Georgia, serif; line-height: 1.5; color: #102116">
      <h1 style="font-family: 'Trebuchet MS', sans-serif; margin-bottom: 8px;">Your ${itinerary.destinationCity} itinerary is ready</h1>
      <p>${profile.fullName}, your trip plan is waiting in the app.</p>
      <p><a href="${env.appUrl}/itineraries/${itinerary.id}">View itinerary</a></p>
      <pre style="white-space: pre-wrap; background: #f5efe4; padding: 16px; border-radius: 12px;">${itinerary.markdown}</pre>
    </div>
  `;
}

export async function sendDealMatchEmail(match: DealMatch, profile: TravelerProfile) {
  const client = createResendClient();
  const subject = `Cheap trip found: ${match.destinationCity} for ${currency(match.totalFareUsd)}`;

  if (!client) {
    console.info("[demo-email]", { to: profile.email, subject, deepLink: match.deepLink });
    return;
  }

  await client.emails.send({
    from: env.resendFromEmail,
    to: profile.email,
    subject,
    html: renderDealMatchEmail(match, profile),
  });
}

export async function sendItineraryEmail(
  itinerary: GeneratedItinerary,
  profile: TravelerProfile,
) {
  const client = createResendClient();
  const subject = `${itinerary.destinationCity} itinerary ready`;

  if (!client) {
    console.info("[demo-email]", { to: profile.email, subject, itineraryId: itinerary.id });
    return;
  }

  await client.emails.send({
    from: env.resendFromEmail,
    to: profile.email,
    subject,
    html: renderItineraryEmail(itinerary, profile),
  });
}
