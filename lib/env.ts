function readEnv(key: string): string | undefined {
  const value = process.env[key];
  return value && value.trim().length > 0 ? value : undefined;
}

export const env = {
  appUrl: readEnv("NEXT_PUBLIC_APP_URL") ?? "http://localhost:3000",
  databaseUrl: readEnv("DATABASE_URL"),
  clerkPublishableKey: readEnv("CLERK_PUBLISHABLE_KEY"),
  clerkSecretKey: readEnv("CLERK_SECRET_KEY"),
  resendApiKey: readEnv("RESEND_API_KEY"),
  resendFromEmail: readEnv("RESEND_FROM_EMAIL") ?? "deals@example.com",
  openAiApiKey: readEnv("OPENAI_API_KEY"),
  skyscannerApiKey: readEnv("SKYSCANNER_API_KEY"),
  skyscannerIndicativeUrl: readEnv("SKYSCANNER_INDICATIVE_URL"),
  skyscannerLiveCreateUrl: readEnv("SKYSCANNER_LIVE_CREATE_URL"),
  skyscannerLivePollUrl: readEnv("SKYSCANNER_LIVE_POLL_URL"),
  skyscannerItineraryRefreshCreateUrl: readEnv(
    "SKYSCANNER_ITINERARY_REFRESH_CREATE_URL",
  ),
  skyscannerItineraryRefreshPollUrl: readEnv(
    "SKYSCANNER_ITINERARY_REFRESH_POLL_URL",
  ),
};

export function hasClerk() {
  return Boolean(env.clerkPublishableKey && env.clerkSecretKey);
}

export function hasDatabase() {
  return Boolean(env.databaseUrl);
}

export function hasResend() {
  return Boolean(env.resendApiKey);
}

export function hasOpenAI() {
  return Boolean(env.openAiApiKey);
}

export function hasSkyscanner() {
  return Boolean(
    env.skyscannerApiKey &&
      env.skyscannerIndicativeUrl &&
      env.skyscannerLiveCreateUrl &&
      env.skyscannerLivePollUrl,
  );
}
