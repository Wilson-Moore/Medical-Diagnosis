import React, { useEffect, useRef } from "react"
import {
  ScrollView, View, Text, StyleSheet,
  SafeAreaView, StatusBar, Animated, TouchableOpacity,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { type NativeStackNavigationProp } from "@react-navigation/native-stack"
import { type RootStackParamList } from "../types"
import { useAppState } from "../context/AppContext"
import UploadBox from "../components/UploadBox"
import ScreeningStatus from "../components/ScreeningStatus"
import PredictionCard from "../components/PredictionCard"
import { C, R, S } from "../theme"

type Nav = NativeStackNavigationProp<RootStackParamList, "Home">

const FEATURES = [
  { icon: "🧠", title: "Multi-Label AI", desc: "EfficientNet detects 14+ thoracic conditions simultaneously" },
  { icon: "🗺️", title: "GradCAM Maps", desc: "Visual heatmaps pinpoint exactly where pathologies were detected" },
  { icon: "📋", title: "Structured Report", desc: "Transformer-generated Findings & Impression sections" },
]

export default function HomeScreen() {
  const nav = useNavigation<Nav>()
  const { result } = useAppState()
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current

  useEffect(() => {
    if (result) {
      fadeAnim.setValue(0)
      slideAnim.setValue(30)
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]).start()
    }
  }, [result])

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg0} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Top Bar ── */}
        <View style={styles.topBar}>
          <View style={styles.logoMark}>
            <Text style={styles.logoText}>Rx</Text>
          </View>
          <View>
            <Text style={styles.appName}>ChestAI</Text>
            <Text style={styles.appTagline}>Radiology Intelligence</Text>
          </View>
        </View>

        {/* ── Hero ── */}
        <View style={styles.hero}>
          <View style={styles.heroBadge}>
            <View style={styles.heroBadgeDot} />
            <Text style={styles.heroBadgeText}>AI-Assisted Diagnosis</Text>
          </View>
          <Text style={styles.heroTitle}>Chest X-Ray{"\n"}<Text style={styles.heroAccent}>Analysis</Text></Text>
          <Text style={styles.heroSub}>
            Upload a radiograph for instant AI predictions, visual explanations, and structured radiology reports.
          </Text>
        </View>

        {/* ── Feature Cards ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.featScroll}
          contentContainerStyle={styles.featContent}
        >
          {FEATURES.map((f) => (
            <View key={f.title} style={styles.featCard}>
              <Text style={styles.featIcon}>{f.icon}</Text>
              <Text style={styles.featTitle}>{f.title}</Text>
              <Text style={styles.featDesc}>{f.desc}</Text>
            </View>
          ))}
        </ScrollView>

        {/* ── Upload ── */}
        <View style={styles.section}>
          <UploadBox />
        </View>

        {/* ── Results Preview ── */}
        {result && (
          <Animated.View
            style={[styles.results, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
          >
            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerLabel}>ANALYSIS RESULTS</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Screening */}
            {result.screening && (
              <ScreeningStatus
                abnormal={result.screening.is_abnormal}
                probability={result.screening.abnormal_probability}
              />
            )}

            {/* Predictions (top 3 preview) */}
            {result.predictions.length > 0 && (
              <View style={styles.card}>
                <View style={styles.cardHead}>
                  <Text style={styles.cardTitle}>Predictions</Text>
                  <View style={styles.countChip}>
                    <Text style={styles.countText}>{result.predictions.length} conditions</Text>
                  </View>
                </View>
                {result.predictions.slice(0, 3).map((p, i) => (
                  <PredictionCard key={p.disease} prediction={p} index={i} />
                ))}
                {result.predictions.length > 3 && (
                  <Text style={styles.moreText}>+{result.predictions.length - 3} more conditions</Text>
                )}
              </View>
            )}

            {/* CTA Buttons to detail pages */}
            <View style={styles.ctaRow}>
              <TouchableOpacity
                style={[styles.ctaBtn, styles.ctaBtnPrimary]}
                onPress={() => nav.navigate("ReportDetail")}
                activeOpacity={0.8}
              >
                <Text style={styles.ctaBtnIcon}>📋</Text>
                <Text style={styles.ctaBtnTextPrimary}>Full Report</Text>
              </TouchableOpacity>

              {result.heatmap && (
                <TouchableOpacity
                  style={[styles.ctaBtn, styles.ctaBtnSecondary]}
                  onPress={() => nav.navigate("HeatmapDetail")}
                  activeOpacity={0.8}
                >
                  <Text style={styles.ctaBtnIcon}>🗺️</Text>
                  <Text style={styles.ctaBtnTextSecondary}>GradCAM Map</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Results page shortcut */}
            <TouchableOpacity
              style={styles.allResultsBtn}
              onPress={() => nav.navigate("Results")}
              activeOpacity={0.8}
            >
              <Text style={styles.allResultsText}>View All Results  →</Text>
            </TouchableOpacity>

          </Animated.View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg0 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 },

  // Top bar
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: S.xl,
  },
  logoMark: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: C.accent,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: { color: C.bg0, fontWeight: "900", fontSize: 16, letterSpacing: -0.5 },
  appName: { color: C.t1, fontSize: 18, fontWeight: "800", letterSpacing: -0.3 },
  appTagline: { color: C.t3, fontSize: 11, letterSpacing: 0.3 },

  // Hero
  hero: { marginBottom: S.xl },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    alignSelf: "flex-start",
    backgroundColor: C.accentDim,
    borderWidth: 1,
    borderColor: C.accentBorder,
    borderRadius: 100,
    paddingHorizontal: 13,
    paddingVertical: 6,
    marginBottom: 14,
  },
  heroBadgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.accent },
  heroBadgeText: { color: C.accent, fontSize: 11, fontWeight: "600", letterSpacing: 0.5 },
  heroTitle: {
    fontSize: 44,
    fontWeight: "900",
    color: C.t1,
    lineHeight: 50,
    letterSpacing: -1.5,
    marginBottom: 12,
  },
  heroAccent: { color: C.accent },
  heroSub: { color: C.t3, fontSize: 14, lineHeight: 22 },

  // Features
  featScroll: { marginBottom: S.xl, marginHorizontal: -20 },
  featContent: { paddingHorizontal: 20, gap: 12 },
  featCard: {
    backgroundColor: C.bg2,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: R.lg,
    padding: S.md,
    width: 180,
  },
  featIcon: { fontSize: 24, marginBottom: 8 },
  featTitle: { color: C.t1, fontSize: 13, fontWeight: "700", marginBottom: 4 },
  featDesc: { color: C.t3, fontSize: 11, lineHeight: 16 },

  // Section
  section: { marginBottom: S.lg },

  // Results
  results: { gap: S.md },
  dividerRow: { flexDirection: "row", alignItems: "center", gap: 10, marginVertical: 4 },
  dividerLine: { flex: 1, height: 1, backgroundColor: C.border },
  dividerLabel: { color: C.t3, fontSize: 10, fontWeight: "700", letterSpacing: 1.5 },

  // Card
  card: {
    backgroundColor: C.bg2,
    borderRadius: R.xl,
    padding: S.md,
    borderWidth: 1,
    borderColor: C.border,
  },
  cardHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  cardTitle: { color: C.t1, fontSize: 16, fontWeight: "800" },
  countChip: {
    backgroundColor: C.accentDim,
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: C.accentBorder,
  },
  countText: { color: C.accent, fontSize: 11, fontWeight: "700" },
  moreText: { color: C.t3, fontSize: 12, textAlign: "center", marginTop: 6 },

  // CTAs
  ctaRow: { flexDirection: "row", gap: 12 },
  ctaBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: R.lg,
    paddingVertical: 14,
  },
  ctaBtnPrimary: { backgroundColor: C.accent },
  ctaBtnSecondary: {
    backgroundColor: C.white5,
    borderWidth: 1,
    borderColor: C.borderLight,
  },
  ctaBtnIcon: { fontSize: 16 },
  ctaBtnTextPrimary: { color: C.bg0, fontWeight: "800", fontSize: 15 },
  ctaBtnTextSecondary: { color: C.t1, fontWeight: "700", fontSize: 15 },

  allResultsBtn: {
    alignItems: "center",
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: R.lg,
    backgroundColor: C.white5,
  },
  allResultsText: { color: C.accent, fontWeight: "700", fontSize: 14 },
})
