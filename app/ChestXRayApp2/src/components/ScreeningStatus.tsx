import React, { useEffect, useRef } from "react"
import { View, Text, StyleSheet, Animated } from "react-native"
import { C, R, S } from "../theme"

interface Props {
  abnormal: boolean
  probability: number
}

export default function ScreeningStatus({ abnormal, probability }: Props) {
  const barAnim = useRef(new Animated.Value(0)).current
  const pct = probability * 100

  useEffect(() => {
    Animated.timing(barAnim, {
      toValue: probability,
      duration: 900,
      delay: 200,
      useNativeDriver: false,
    }).start()
  }, [probability])

  const color = abnormal ? C.warn : C.ok
  const dimColor = abnormal ? C.warnDim : C.okDim
  const borderColor = abnormal ? C.warnBorder : C.okBorder

  const barWidth = barAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  })

  return (
    <View style={[styles.card, { backgroundColor: dimColor, borderColor }]}>
      {/* Top row */}
      <View style={styles.topRow}>
        <View style={[styles.pulse, { backgroundColor: color }]} />
        <Text style={styles.label}>SCREENING RESULT</Text>
        <View style={[styles.pctPill, { borderColor }]}>
          <Text style={[styles.pctText, { color }]}>{pct.toFixed(1)}%</Text>
        </View>
      </View>

      {/* Status text */}
      <Text style={[styles.status, { color }]}>
        {abnormal ? "⚠  Abnormal Findings Detected" : "✓  No Abnormality Detected"}
      </Text>

      {/* Animated bar */}
      <View style={styles.barTrack}>
        <Animated.View
          style={[styles.barFill, { width: barWidth as any, backgroundColor: color }]}
        />
      </View>

      {/* Sub-label */}
      <Text style={styles.sub}>
        {abnormal
          ? "Further clinical review is recommended"
          : "Radiograph appears within normal limits"}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: R.xl,
    padding: S.lg,
    borderWidth: 1,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  pulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  label: {
    color: C.t2,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.8,
    flex: 1,
  },
  pctPill: {
    borderWidth: 1,
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  pctText: {
    fontSize: 12,
    fontWeight: "800",
  },
  status: {
    fontSize: 19,
    fontWeight: "800",
    marginBottom: 14,
    letterSpacing: -0.3,
  },
  barTrack: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 10,
  },
  barFill: {
    height: 4,
    borderRadius: 2,
  },
  sub: {
    color: C.t3,
    fontSize: 12,
    letterSpacing: 0.2,
  },
})
