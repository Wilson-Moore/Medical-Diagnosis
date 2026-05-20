import React from "react"
import {
  ScrollView, View, Text, StyleSheet,
  SafeAreaView, StatusBar, TouchableOpacity,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { type NativeStackNavigationProp } from "@react-navigation/native-stack"
import { type RootStackParamList } from "../types"
import { useAppState } from "../context/AppContext"
import PredictionCard from "../components/PredictionCard"
import ScreeningStatus from "../components/ScreeningStatus"
import { C, R, S } from "../theme"

type Nav = NativeStackNavigationProp<RootStackParamList, "Results">

export default function ResultsScreen() {
  const nav = useNavigation<Nav>()
  const { result, imageUri } = useAppState()

  if (!result) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyText}>No results yet. Upload an X-Ray first.</Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => nav.goBack()}>
            <Text style={styles.backBtnText}>← Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  const topPred = result.predictions[0]

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg0} />

      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => nav.goBack()} style={styles.backPill}>
          <Text style={styles.backPillText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Analysis Results</Text>
          <Text style={styles.headerSub}>{result.predictions.length} conditions evaluated</Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Screening Banner */}
        {result.screening && (
          <ScreeningStatus
            abnormal={result.screening.is_abnormal}
            probability={result.screening.abnormal_probability}
          />
        )}

        {/* Summary stat row */}
        <View style={styles.statRow}>
          {[
            { label: "Conditions Checked", value: result.predictions.length.toString() },
            {
              label: "Highest Risk",
              value: topPred ? `${(topPred.probability * 100).toFixed(0)}%` : "—",
            },
            {
              label: "Top Finding",
              value: topPred?.disease.split(" ")[0] ?? "—",
            },
          ].map((s) => (
            <View key={s.label} style={styles.statCard}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* All predictions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prediction Confidence</Text>
          {result.predictions.map((p, i) => (
            <PredictionCard key={p.disease} prediction={p} index={i} />
          ))}
        </View>

        {/* Navigate to detail pages */}
        <View style={styles.navCards}>
          <TouchableOpacity
            style={styles.navCard}
            onPress={() => nav.navigate("ReportDetail")}
            activeOpacity={0.8}
          >
            <Text style={styles.navCardIcon}>📋</Text>
            <View>
              <Text style={styles.navCardTitle}>AI Radiology Report</Text>
              <Text style={styles.navCardSub}>View full structured findings & impression</Text>
            </View>
            <Text style={styles.navCardArrow}>→</Text>
          </TouchableOpacity>

          {result.heatmap && (
            <TouchableOpacity
              style={styles.navCard}
              onPress={() => nav.navigate("HeatmapDetail")}
              activeOpacity={0.8}
            >
              <Text style={styles.navCardIcon}>🗺️</Text>
              <View>
                <Text style={styles.navCardTitle}>GradCAM Heatmap</Text>
                <Text style={styles.navCardSub}>Explore the model's visual attention map</Text>
              </View>
              <Text style={styles.navCardArrow}>→</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg0 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 20, gap: S.md },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  backPill: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: C.white5,
    borderWidth: 1,
    borderColor: C.border,
    justifyContent: "center",
    alignItems: "center",
  },
  backPillText: { color: C.t1, fontSize: 20 },
  headerCenter: { flex: 1, alignItems: "center" },
  headerTitle: { color: C.t1, fontSize: 17, fontWeight: "800" },
  headerSub: { color: C.t3, fontSize: 11, marginTop: 1 },

  // Empty
  empty: { flex: 1, justifyContent: "center", alignItems: "center", gap: 16 },
  emptyIcon: { fontSize: 48 },
  emptyText: { color: C.t3, fontSize: 16, textAlign: "center" },
  backBtn: {
    backgroundColor: C.accentDim,
    borderRadius: R.md,
    paddingHorizontal: S.lg,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: C.accentBorder,
  },
  backBtnText: { color: C.accent, fontWeight: "700" },

  // Stats
  statRow: { flexDirection: "row", gap: 10 },
  statCard: {
    flex: 1,
    backgroundColor: C.bg2,
    borderRadius: R.lg,
    borderWidth: 1,
    borderColor: C.border,
    padding: S.md,
    alignItems: "center",
  },
  statValue: { color: C.accent, fontSize: 20, fontWeight: "900", letterSpacing: -0.5 },
  statLabel: { color: C.t3, fontSize: 10, fontWeight: "600", letterSpacing: 0.3, textAlign: "center", marginTop: 3 },

  // Section
  section: {},
  sectionTitle: { color: C.t1, fontSize: 18, fontWeight: "800", marginBottom: S.md },

  // Nav cards
  navCards: { gap: 10 },
  navCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: C.bg2,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: R.xl,
    padding: S.md,
  },
  navCardIcon: { fontSize: 28 },
  navCardTitle: { color: C.t1, fontSize: 15, fontWeight: "700" },
  navCardSub: { color: C.t3, fontSize: 12, marginTop: 2 },
  navCardArrow: { color: C.accent, fontSize: 20, marginLeft: "auto" },
})
