import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import LoginScreen from "../screens/LoginScreen";
import LoaderEntryScreen from "../screens/LoaderEntryScreen";
import MapScreen from "../screens/MapScreen";
import ComerciosListScreen from "../screens/ComerciosListScreen";
import ComerciosInactivosScreen from "../screens/ComerciosInactivosScreen";
import { COLORS } from "../constants/colors";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.muted,
        tabBarShowLabel: true,
        tabBarStyle: {
          height: 62 + insets.bottom,
          paddingBottom: Math.max(insets.bottom, 8),
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "700",
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName = "circle";

          if (route.name === "MapaTab") {
            iconName = focused ? "map" : "map-outline";
          } else if (route.name === "ComerciosTab") {
            iconName = focused ? "store" : "store-outline";
          } else if (route.name === "InactivosTab") {
            iconName = focused ? "archive-off" : "archive-off-outline";
          }

          return <MaterialCommunityIcons name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="MapaTab"
        component={MapScreen}
        options={{ title: "Mapa" }}
      />
      <Tab.Screen
        name="ComerciosTab"
        component={ComerciosListScreen}
        options={{ title: "Comercios" }}
      />
      <Tab.Screen
        name="InactivosTab"
        component={ComerciosInactivosScreen}
        options={{ title: "Desactivados" }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="LoaderEntry" component={LoaderEntryScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
    </Stack.Navigator>
  );
}