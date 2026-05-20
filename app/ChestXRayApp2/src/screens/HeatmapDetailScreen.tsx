import React, { useState, useRef } from "react"
import {
  View, Text, StyleSheet, SafeAreaView, StatusBar,
  TouchableOpacity, Image, ScrollView, Dimensions,
  Modal, Animated, PanResponder,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useAppState } from "../context/AppContext"
import { C, R, S, SCREEN_W, SCREEN_H } from "../theme"

const { height: H } = Dimensions.get("window")

const LEGEND = [
  { color: "#0000ff", label: "Low activation" },
  { color: "#00ffff", label: "Mild activation" },
  { color: "#00ff00", label: "Moderate" },
  { color: "#ffff00", label: "High activation" },
  { color: "#ff0000", label: "Peak activation" },
]

const INFO_ITEMS = [
  { label: "Technique", value: "Gradient-weighted Class Activation Mapping (GradCAM)" },
  { label: "Target Layer", value: "Final convolutional block of EfficientNet" },
  { label: "Interpretation", value: "Brighter / redder regions contributed most to the model prediction" },
  { label: "Note", value: "Heatmap is overlaid on the original radiograph for spatial reference" },
]

export default function HeatmapDetailScreen() {
  const nav = useNavigation()
  const { result, imageUri } = useAppState()
  const [fullscreen, setFullscreen] = useState(false)
  const [showOriginal, setShowOriginal] = useState(false)
  const scaleAnim = useRef(new Animated.Value(1)).current

  if (!result?.heatmap) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🗺️</Text>
          <Text style={styles.emptyText}>No heatmap available.</Text>
          <TouchableOpacity onPress={() => nav.goBack()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>← Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  const heatmapUri = `data:image/png;base64,${result.heatmap}`
  const displayUri = showOriginal && imageUri ? imageUri : heatmapUri

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg0} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => nav.goBack()} style={styles.backPill}>
          <Text style={styles.backPillText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>GradCAM Heatmap</Text>
          <Text style={styles.headerSub}>Explainability visualization</Text>
        </View>
        <TouchableOpacity style={styles.expandBtn} onPress={() => setFullscreen(true)}>
          <Text style={styles.expandBtnText}>⤢</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Toggle: Heatmap vs Original */}
        {imageUri && (
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[styles.toggleBtn, !showOriginal && styles.toggleActive]}
              onPress={() => setShowOriginal(false)}
            >
              <Text style={[styles.toggleText, !showOriginal && styles.toggleTextActive]}>
                GradCAM Overlay
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, showOriginal && styles.toggleActive]}
              onPress={() => setShowOriginal(true)}
            >
              <Text style={[styles.toggleText, showOriginal && styles.toggleTextActive]}>
                Original X-Ray
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Main Image */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setFullscreen(true)}
          style={styles.imageContainer}
        >
          <Image source={{ uri: displayUri }} style={styles.image} resizeMode="contain" />
          <View style={styles.imageTapHint}>
            <Text style={styles.imageTapHintText}>Tap to expand</Text>
          </View>
        </TouchableOpacity>

        {/* Color Legend */}
        <View style={styles.legendCard}>
          <Text style={styles.legendTitle}>ACTIVATION LEGEND</Text>
          <View style={styles.legendRow}>
            {LEGEND.map((l) => (
              <View key={l.label} style={styles.legendItem}>
                <View style={[styles.legendSwatch, { backgroundColor: l.color }]} />
                <Text style={styles.legendLabel}>{l.label}</Text>
              </View>
            ))}
          </View>
          {/* Gradient bar */}
          <View style={styles.gradBar} />
          <View style={styles.gradLabels}>
            <Text style={styles.gradLabel}>Low</Text>
            <Text style={styles.gradLabel}>High</Text>
          </View>
        </View>

        {/* Info cards */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>HOW TO INTERPRET</Text>
          {INFO_ITEMS.map((item) => (
            <View key={item.label} style={styles.infoItem}>
              <Text style={styles.infoLabel}>{item.label}</Text>
              <Text style={styles.infoValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Fullscreen Modal */}
      <Modal visible={fullscreen} transparent animationType="fade" onRequestClose={() => setFullscreen(false)} statusBarTranslucent>
        <View style={styles.fsModal}>
          <TouchableOpacity style={styles.fsClose} onPress={() => setFullscreen(false)}>
            <Text style={styles.fsCloseText}>✕</Text>
          </TouchableOpacity>

          <Image source={{ uri: displayUri }} style={styles.fsImage} resizeMode="contain" />

          {/* Toggle in fullscreen */}
          {imageUri && (
            <View style={[styles.toggleRow, styles.fsToggle]}>
              <TouchableOpacity
                style={[styles.toggleBtn, !showOriginal && styles.toggleActive]}
                onPress={() => setShowOriginal(false)}
              >
                <Text style={[styles.toggleText, !showOriginal && styles.toggleTextActive]}>GradCAM</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleBtn, showOriginal && styles.toggleActive]}
                onPress={() => setShowOriginal(true)}
              >
                <Text style={[styles.toggleText, showOriginal && styles.toggleTextActive]}>Original</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg0 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 20, gap: S.md },

  // Header
  header: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: C.border,
  },
  backPill: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: C.white5, borderWidth: 1, borderColor: C.border,
    justifyContent: "center", alignItems: "center",
  },
  backPillText: { color: C.t1, fontSize: 20 },
  headerCenter: { flex: 1, alignItems: "center" },
  headerTitle: { color: C.t1, fontSize: 17, fontWeight: "800" },
  headerSub: { color: C.t3, fontSize: 11, marginTop: 1 },
  expandBtn: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: C.accentDim, borderWidth: 1, borderColor: C.accentBorder,
    justifyContent: "center", alignItems: "center",
  },
  expandBtnText: { color: C.accent, fontSize: 18, fontWeight: "700" },

  // Empty
  empty: { flex: 1, justifyContent: "center", alignItems: "center", gap: 16 },
  emptyIcon: { fontSize: 48 },
  emptyText: { color: C.t3, fontSize: 16 },
  backBtn: {
    backgroundColor: C.accentDim, borderRadius: R.md,
    paddingHorizontal: S.lg, paddingVertical: 12,
    borderWidth: 1, borderColor: C.accentBorder,
  },
  backBtnText: { color: C.accent, fontWeight: "700" },

  // Toggle
  toggleRow: {
    flexDirection: "row",
    backgroundColor: C.bg2,
    borderRadius: R.md,
    borderWidth: 1,
    borderColor: C.border,
    padding: 4,
    gap: 4,
  },
  toggleBtn: {
    flex: 1, borderRadius: R.sm + 2,
    paddingVertical: 9, alignItems: "center",
  },
  toggleActive: { backgroundColor: C.accent },
  toggleText: { color: C.t3, fontSize: 13, fontWeight: "600" },
  toggleTextActive: { color: C.bg0, fontWeight: "800" },

  // Image
  imageContainer: {
    backgroundColor: "#000",
    borderRadius: R.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: C.border,
  },
  image: { width: "100%", height: SCREEN_W * 0.85 },
  imageTapHint: {
    position: "absolute", bottom: 12, right: 12,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4,
  },
  imageTapHintText: { color: C.t2, fontSize: 11 },

  // Legend
  legendCard: {
    backgroundColor: C.bg2,
    borderRadius: R.xl,
    borderWidth: 1,
    borderColor: C.border,
    padding: S.md,
  },
  legendTitle: {
    color: C.t3, fontSize: 10, fontWeight: "700",
    letterSpacing: 1.5, marginBottom: 12,
  },
  legendRow: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 14 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendSwatch: { width: 12, height: 12, borderRadius: 3 },
  legendLabel: { color: C.t2, fontSize: 11 },
  gradBar: {
    height: 8,
    borderRadius: 4,
    background: "linear-gradient(to right, #0000ff, #00ffff, #00ff00, #ffff00, #ff0000)",
    backgroundColor: "#0000ff", // fallback (RN doesn't support gradient natively here)
    // Use a row of colored views instead:
  },
  gradLabels: { flexDirection: "row", justifyContent: "space-between", marginTop: 4 },
  gradLabel: { color: C.t3, fontSize: 10 },

  // Info
  infoCard: {
    backgroundColor: C.bg2,
    borderRadius: R.xl,
    borderWidth: 1,
    borderColor: C.border,
    padding: S.md,
    gap: S.md,
  },
  infoTitle: {
    color: C.t3, fontSize: 10, fontWeight: "700", letterSpacing: 1.5,
  },
  infoItem: { gap: 3 },
  infoLabel: { color: C.accent, fontSize: 11, fontWeight: "700", letterSpacing: 0.5 },
  infoValue: { color: C.t2, fontSize: 13, lineHeight: 19 },

  // Fullscreen
  fsModal: {
    flex: 1, backgroundColor: "rgba(3,7,15,0.98)",
    justifyContent: "center", alignItems: "center",
  },
  fsClose: {
    position: "absolute", top: 52, right: 20, zIndex: 10,
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: C.white10,
    justifyContent: "center", alignItems: "center",
  },
  fsCloseText: { color: C.t1, fontSize: 18, fontWeight: "700" },
  fsImage: { width: "100%", height: "65%" },
  fsToggle: { position: "absolute", bottom: 60, width: "60%" },
})
