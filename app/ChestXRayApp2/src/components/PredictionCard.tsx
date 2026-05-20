import React, { useEffect, useRef } from "react"
import { View, Text, StyleSheet, Animated } from "react-native"
import { type Prediction } from "../types"
import { C, R, S } from "../theme"

interface Props {
  prediction: Prediction
  index: number
}

function riskColor(p: number) {
  if (p >= 0.65) return { bar: C.warn, text: C.warn, bg: C.warnDim, border: C.warnBorder, tag: "HIGH" }
  if (p >= 0.35) return { bar: C.amber, text: C.amber, bg: C.amberDim, border: "rgba(255,171,64,0.28)", tag: "MED" }
  return { bar: C.accent, text: C.t2, bg: C.accentDim, border: C.accentBorder, tag: "LOW" }
}

export default function PredictionCard({ prediction, index }: Props) {
  const pct = prediction.probability * 100
  const risk = riskColor(prediction.probability)
  const barAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(barAnim, {
      toValue: prediction.probability,
      duration: 700,
      delay: index * 80,
      useNativeDriver: false,
    }).start()
  }, [])

  const barWidth = barAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  })

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        {/* Disease name */}
        <View style={styles.left}>
          <Text style={styles.idx}>{String(index + 1).padStart(2, "0")}</Text>
          <Text style={styles.name}>{prediction.disease}</Text>
        </View>
        {/* Risk tag + pct */}
        <View style={styles.right}>
          <View style={[styles.tag, { backgroundColor: risk.bg, borderColor: risk.border }]}>
            <Text style={[styles.tagText, { color: risk.bar }]}>{risk.tag}</Text>
          </View>
          <Text style={[styles.pct, { color: risk.bar }]}>{pct.toFixed(1)}%</Text>
        </View>
      </View>

      {/* Bar */}
      <View style={styles.track}>
        <Animated.View
          style={[styles.fill, { width: barWidth as any, backgroundColor: risk.bar }]}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: C.bg3,
    borderRadius: R.md,
    paddingHorizontal: S.md,
    paddingTop: 13,
    paddingBottom: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: C.border,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  idx: {
    color: C.t3,
    fontSize: 11,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
    letterSpacing: 0.5,
    width: 22,
  },
  name: {
    color: C.t1,
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  tag: {
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  tagText: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
  },
  pct: {
    fontSize: 15,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
    minWidth: 46,
    textAlign: "right",
  },
  track: {
    height: 3,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 2,
    overflow: "hidden",
  },
  fill: {
    height: 3,
    borderRadius: 2,
  },
})
