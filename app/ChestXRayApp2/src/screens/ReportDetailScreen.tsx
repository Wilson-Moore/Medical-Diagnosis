import React, { useRef } from "react"
import {
  ScrollView, View, Text, StyleSheet,
  SafeAreaView, StatusBar, TouchableOpacity,
  Share, Animated,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useAppState } from "../context/AppContext"
import { C, R, S } from "../theme"

// Simple parser: split report into FINDINGS / IMPRESSION sections
function parseReport(report: string) {
  const sections: { title: string; body: string }[] = []
  const lines = report.split("\n")
  let current: { title: string; body: string } | null = null

  for (const line of lines) {
    const heading = line.match(/^([A-Z ]{3,}):?\s*$/)
    if (heading) {
      if (current) sections.push(current)
      current = { title: line.replace(/:$/, "").trim(), body: "" }
    } else {
      if (current) current.body += (current.body ? "\n" : "") + line
      else sections.push({ title: "REPORT", body: line })
    }
  }
  if (current) sections.push(current)
  return sections.length ? sections : [{ title: "REPORT", body: report }]
}

export default function ReportDetailScreen() {
  const nav = useNavigation()
  const { result } = useAppState()
  const scrollAnim = useRef(new Animated.Value(0)).current

  async function share() {
    if (!result) return
    await Share.share({ message: result.report, title: "AI Radiology Report" })
  }

  if (!result) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyText}>No report available yet.</Text>
          <TouchableOpacity onPress={() => nav.goBack()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>← Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  const sections = parseReport(result.report)

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg0} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => nav.goBack()} style={styles.backPill}>
          <Text style={styles.backPillText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Radiology Report</Text>
          <Text style={styles.headerSub}>AI-generated structured report</Text>
        </View>
        <TouchableOpacity style={styles.shareBtn} onPress={share}>
          <Text style={styles.shareBtnText}>↑</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollAnim } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Meta strip */}
        <View style={styles.metaStrip}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>TYPE</Text>
            <Text style={styles.metaValue}>Chest PA</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>MODEL</Text>
            <Text style={styles.metaValue}>Transformer LM</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>SECTIONS</Text>
            <Text style={styles.metaValue}>{sections.length}</Text>
          </View>
        </View>

        {/* Report Sections */}
        {sections.map((sec, idx) => (
          <View key={idx} style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionAccent} />
              <Text style={styles.sectionTitle}>{sec.title}</Text>
            </View>
            <Text style={styles.sectionBody}>{sec.body.trim()}</Text>
          </View>
        ))}

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerIcon}>⚠</Text>
          <Text style={styles.disclaimerText}>
            This report is AI-generated and intended as a decision-support tool only.
            It does not replace the assessment of a licensed radiologist or clinician.
          </Text>
        </View>

        {/* Share Button */}
        <TouchableOpacity style={styles.shareFullBtn} onPress={share} activeOpacity={0.8}>
          <Text style={styles.shareFullBtnText}>↑  Share Report</Text>
        </TouchableOpacity>

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
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: C.white5, borderWidth: 1, borderColor: C.border,
    justifyContent: "center", alignItems: "center",
  },
  backPillText: { color: C.t1, fontSize: 20 },
  headerCenter: { flex: 1, alignItems: "center" },
  headerTitle: { color: C.t1, fontSize: 17, fontWeight: "800" },
  headerSub: { color: C.t3, fontSize: 11, marginTop: 1 },
  shareBtn: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: C.accentDim, borderWidth: 1, borderColor: C.accentBorder,
    justifyContent: "center", alignItems: "center",
  },
  shareBtnText: { color: C.accent, fontSize: 20, fontWeight: "700" },

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

  // Meta strip
  metaStrip: {
    flexDirection: "row",
    backgroundColor: C.bg2,
    borderRadius: R.lg,
    borderWidth: 1,
    borderColor: C.border,
    paddingVertical: S.md,
  },
  metaItem: { flex: 1, alignItems: "center" },
  metaLabel: { color: C.t3, fontSize: 9, fontWeight: "700", letterSpacing: 1.2, marginBottom: 4 },
  metaValue: { color: C.t1, fontSize: 13, fontWeight: "700" },
  metaDivider: { width: 1, backgroundColor: C.border, marginVertical: 4 },

  // Sections
  section: {
    backgroundColor: C.bg2,
    borderRadius: R.xl,
    borderWidth: 1,
    borderColor: C.border,
    padding: S.md,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  sectionAccent: {
    width: 3,
    height: 20,
    backgroundColor: C.accent,
    borderRadius: 2,
  },
  sectionTitle: {
    color: C.accent,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  sectionBody: {
    color: C.t2,
    fontSize: 14,
    lineHeight: 23,
    fontFamily: "monospace",
  },

  // Disclaimer
  disclaimer: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: C.amberDim,
    borderWidth: 1,
    borderColor: "rgba(255,171,64,0.25)",
    borderRadius: R.lg,
    padding: S.md,
    alignItems: "flex-start",
  },
  disclaimerIcon: { fontSize: 16, marginTop: 1 },
  disclaimerText: { color: C.amber, fontSize: 12, lineHeight: 18, flex: 1 },

  // Share btn
  shareFullBtn: {
    backgroundColor: C.accentDim,
    borderWidth: 1,
    borderColor: C.accentBorder,
    borderRadius: R.lg,
    paddingVertical: 14,
    alignItems: "center",
  },
  shareFullBtnText: { color: C.accent, fontWeight: "700", fontSize: 15 },
})
