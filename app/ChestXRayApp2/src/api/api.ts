// ─── api/api.ts ──────────────────────────────────────────────────────────────
// Update BASE_URL to match your backend:
//   Android emulator  → http://10.0.2.2:<port>
//   iOS simulator     → http://localhost:<port>
//   Physical device   → http://<your-LAN-ip>:<port>

export const BASE_URL = "http://192.168.100.9:8000"

export async function predictXRay(
  imageUri: string,
  mimeType: string,
  fileName: string
) {
  const formData = new FormData()
  formData.append("file", {
    uri: imageUri,
    type: mimeType,
    name: fileName,
  } as any)

  const response = await fetch(`${BASE_URL}/predict`, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Server error ${response.status}: ${text}`)
  }

  return response.json()
}
