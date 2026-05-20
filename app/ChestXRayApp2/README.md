# ChestAI — React Native v2

Premium mobile radiology AI platform with full navigation, delete, and detail pages.

## Project Structure

```
ChestXRayApp/
├── App.tsx                          # Root: AppProvider + Navigator
├── app.json                         # Expo config + permissions
├── package.json
├── tsconfig.json
└── src/
    ├── api/api.ts                   # ← Set BASE_URL here
    ├── context/AppContext.tsx       # Global state (result, imageUri, clearAll)
    ├── theme.ts                     # Design tokens: colors, radii, spacing
    ├── types/index.ts               # Shared TypeScript types + nav params
    ├── navigation/AppNavigator.tsx  # Stack navigator (4 screens)
    ├── components/
    │   ├── UploadBox.tsx            # Pick/camera + preview + delete button
    │   ├── PredictionCard.tsx       # Animated confidence bar, risk color coding
    │   └── ScreeningStatus.tsx      # Animated normal/abnormal banner
    └── screens/
        ├── HomeScreen.tsx           # Main upload + summary preview
        ├── ResultsScreen.tsx        # All predictions + stat row
        ├── ReportDetailScreen.tsx   # Full structured report + share
        └── HeatmapDetailScreen.tsx  # GradCAM viewer, toggle, fullscreen modal
```

## Setup

```bash
cd ChestXRayApp
npm install

# Update src/api/api.ts → BASE_URL:
#   Android emulator  → http://10.0.2.2:8000
#   iOS simulator     → http://localhost:8000
#   Physical device   → http://<LAN-IP>:8000

npx expo start
# Press 'a' (Android) | 'i' (iOS) | scan QR with Expo Go
```

## Screens

| Screen | Route | Description |
|--------|-------|-------------|
| Home | `Home` | Upload, feature overview, results preview |
| Results | `Results` | All predictions, stats, nav to detail pages |
| Report | `ReportDetail` | Parsed section report + share sheet |
| Heatmap | `HeatmapDetail` | GradCAM viewer + original toggle + fullscreen |

## New in v2

- **Delete button** on uploaded image (clears all state with confirmation)
- **4-screen navigation** with custom headers and back navigation
- **Results page** with stat summary row and full prediction list
- **Report page** with auto-parsed FINDINGS / IMPRESSION sections + share
- **Heatmap page** with original ↔ GradCAM toggle and fullscreen modal
- **Global AppContext** for sharing state across all screens
- **Design token system** (`theme.ts`) for consistent colors and spacing
- **Animated bars** with staggered delays on predictions
