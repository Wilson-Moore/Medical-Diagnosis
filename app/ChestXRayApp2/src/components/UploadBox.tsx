import React, { useState } from "react"
import {
  View, Text, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, Image,
} from "react-native"
import * as ImagePicker from "expo-image-picker"
import { predictXRay } from "../api/api"
import { useAppState } from "../context/AppContext"
import { C, R, S, SCREEN_W } from "../theme"

export default function UploadBox() {
  const { setResult, imageUri, setImageUri, clearAll } = useAppState()
  const [loading, setLoading] = useState(false)

  async function pick(fromCamera: boolean) {
    const perm = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (!perm.granted) {
      Alert.alert("Permission required", fromCamera ? "Camera access needed." : "Photo library access needed.")
      return
    }

    const res = fromCamera
      ? await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.92 })
      : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.92 })

    if (res.canceled || !res.assets[0]) return
    const asset = res.assets[0]
    clearAll()
    setImageUri(asset.uri)
    await analyze(asset.uri, asset.mimeType ?? "image/jpeg", asset.fileName ?? "xray.jpg")
  }

  async function analyze(uri: string, mime: string, name: string) {
    setLoading(true)
    try {
      const data = await predictXRay(uri, mime, name)
      setResult(data)
    } catch (err: any) {
      Alert.alert("Analysis Failed", err?.message ?? "Could not reach the server.")
    } finally {
      setLoading(false)
    }
  }

  function handleDelete() {
    Alert.alert("Delete Image", "Remove this X-Ray and clear all results?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: clearAll },
    ])
  }

  // ── With Image ────────────────────────────────────────────────────────────
  if (imageUri) {
    return (
      <View style={styles.previewCard}>
        {/* Header */}
        <View style={styles.previewHeader}>
          <View style={styles.headerLeft}>
            <View style={styles.statusDot} />
            <Text style={styles.previewLabel}>X-RAY LOADED</Text>
          </View>
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
            <Text style={styles.deleteBtnText}>✕  Delete</Text>
          </TouchableOpacity>
        </View>

        {/* Image */}
        <View style={styles.imageFrame}>
          <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
          {loading && (
            <View style={styles.analyzeOverlay}>
              <View style={styles.analyzeBox}>
                <ActivityIndicator size="large" color={C.accent} />
                <Text style={styles.analyzingTitle}>Analyzing Radiograph</Text>
                <Text style={styles.analyzingSubtitle}>Running AI inference…</Text>
              </View>
              {/* Scan line animation handled via border overlay */}
            </View>
          )}
        </View>

        {/* Re-upload row */}
        {!loading && (
          <View style={styles.reuploadRow}>
            <TouchableOpacity style={styles.reBtn} onPress={() => pick(false)} activeOpacity={0.75}>
              <Text style={styles.reBtnText}>📂  New Image</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.reBtn} onPress={() => pick(true)} activeOpacity={0.75}>
              <Text style={styles.reBtnText}>📷  Camera</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    )
  }

  // ── Empty State ───────────────────────────────────────────────────────────
  return (
    <View style={styles.dropZone}>
      {/* Decorative corner marks */}
      <View style={[styles.corner, styles.cornerTL]} />
      <View style={[styles.corner, styles.cornerTR]} />
      <View style={[styles.corner, styles.cornerBL]} />
      <View style={[styles.corner, styles.cornerBR]} />

      <View style={styles.iconRing}>
        <Text style={styles.icon}>🫁</Text>
      </View>

      <Text style={styles.dropTitle}>Upload Chest X-Ray</Text>
      <Text style={styles.dropSub}>
        Select a radiograph from your library or capture one with your camera.
        The AI will detect pathologies, generate a heatmap, and write a structured report.
      </Text>

      <View style={styles.btnRow}>
        <TouchableOpacity style={styles.btnPrimary} onPress={() => pick(false)} activeOpacity={0.85}>
          <Text style={styles.btnPrimaryText}>📂  Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnOutline} onPress={() => pick(true)} activeOpacity={0.85}>
          <Text style={styles.btnOutlineText}>📷  Camera</Text>
        </TouchableOpacity>
      </View>

      {/* Format hint */}
      <Text style={styles.formatHint}>JPG · PNG · DICOM-exported PNG accepted</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  // ── Empty Drop Zone
  dropZone: {
    borderWidth: 1,
    borderColor: C.accentBorder,
    borderStyle: "dashed",
    borderRadius: R.xxl,
    padding: S.xxl,
    alignItems: "center",
    backgroundColor: C.accentDim,
  },
  corner: {
    position: "absolute",
    width: 18,
    height: 18,
    borderColor: C.accent,
  },
  cornerTL: { top: 14, left: 14, borderTopWidth: 2, borderLeftWidth: 2, borderTopLeftRadius: 4 },
  cornerTR: { top: 14, right: 14, borderTopWidth: 2, borderRightWidth: 2, borderTopRightRadius: 4 },
  cornerBL: { bottom: 14, left: 14, borderBottomWidth: 2, borderLeftWidth: 2, borderBottomLeftRadius: 4 },
  cornerBR: { bottom: 14, right: 14, borderBottomWidth: 2, borderRightWidth: 2, borderBottomRightRadius: 4 },
  iconRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: C.bg2,
    borderWidth: 1,
    borderColor: C.accentBorder,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: S.lg,
  },
  icon: { fontSize: 40 },
  dropTitle: {
    color: C.t1,
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 10,
    letterSpacing: -0.4,
  },
  dropSub: {
    color: C.t3,
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    marginBottom: S.xl,
  },
  btnRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: S.md,
  },
  btnPrimary: {
    backgroundColor: C.accent,
    borderRadius: R.lg,
    paddingHorizontal: S.xl,
    paddingVertical: 13,
  },
  btnPrimaryText: {
    color: C.bg0,
    fontWeight: "800",
    fontSize: 15,
  },
  btnOutline: {
    borderWidth: 1,
    borderColor: C.borderLight,
    borderRadius: R.lg,
    paddingHorizontal: S.xl,
    paddingVertical: 13,
    backgroundColor: C.white5,
  },
  btnOutlineText: {
    color: C.t1,
    fontWeight: "700",
    fontSize: 15,
  },
  formatHint: {
    color: C.t3,
    fontSize: 11,
    letterSpacing: 0.3,
  },

  // ── Preview Card
  previewCard: {
    backgroundColor: C.bg2,
    borderRadius: R.xl,
    borderWidth: 1,
    borderColor: C.border,
    overflow: "hidden",
  },
  previewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: S.md,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: C.ok,
  },
  previewLabel: {
    color: C.t2,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: C.warnDim,
    borderWidth: 1,
    borderColor: C.warnBorder,
    borderRadius: R.sm,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  deleteBtnText: {
    color: C.warn,
    fontSize: 12,
    fontWeight: "700",
  },
  imageFrame: {
    backgroundColor: "#000",
    minHeight: SCREEN_W * 0.72,
  },
  image: {
    width: "100%",
    height: SCREEN_W * 0.72,
  },
  analyzeOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(3,7,15,0.82)",
    justifyContent: "center",
    alignItems: "center",
  },
  analyzeBox: {
    alignItems: "center",
    gap: 10,
  },
  analyzingTitle: {
    color: C.t1,
    fontSize: 18,
    fontWeight: "800",
    marginTop: 8,
  },
  analyzingSubtitle: {
    color: C.accent,
    fontSize: 13,
  },
  reuploadRow: {
    flexDirection: "row",
    gap: 10,
    padding: S.md,
  },
  reBtn: {
    flex: 1,
    backgroundColor: C.white5,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: R.md,
    paddingVertical: 11,
    alignItems: "center",
  },
  reBtnText: {
    color: C.t2,
    fontSize: 13,
    fontWeight: "600",
  },
})
