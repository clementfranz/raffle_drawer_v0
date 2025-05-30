// utils/logUserAction.ts

import axios from "axios";
import CF_api from "~/api/asClient/CF_axios";

/**
 * Get the user's public IP address using ipify API
 */
async function getPublicIP(): Promise<string | null> {
  try {
    const response = await axios.get("https://api.ipify.org?format=json");
    return response.data.ip;
  } catch (err) {
    console.warn("⚠️ Failed to get IP address. Using null.");
    return null;
  }
}

/**
 * Log a system user action to the backend
 * @param email User's email address
 * @param action Type of action (e.g., login, logout, failed-login)
 * @param meta Optional metadata object
 */
export async function logUserAction(
  email: string,
  action: string,
  meta?: Record<string, any>
): Promise<void> {
  const ipAddress = await getPublicIP();
  const userAgent = navigator.userAgent;

  try {
    const response = await CF_api.post("system-logs", {
      email,
      action,
      ipAddress,
      userAgent,
      meta
    });

    console.log("✅ System user log created:", response.data);
  } catch (error) {
    console.error("❌ Failed to log user action:", error);
  }
}
