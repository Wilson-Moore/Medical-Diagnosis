import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { type RootStackParamList } from "../types"

import HomeScreen from "../screens/HomeScreen"
import ResultsScreen from "../screens/ResultsScreen"
import ReportDetailScreen from "../screens/ReportDetailScreen"
import HeatmapDetailScreen from "../screens/HeatmapDetailScreen"
import { C } from "../theme"

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: C.bg0 },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Results" component={ResultsScreen} />
        <Stack.Screen name="ReportDetail" component={ReportDetailScreen} />
        <Stack.Screen name="HeatmapDetail" component={HeatmapDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
