import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { PaperProvider } from "react-native-paper";
import { BooksProvider } from "../context/BooksContext";

export default function Layout() {
  return (
    <BooksProvider>
      <PaperProvider>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: "#4b7bec",
            tabBarStyle: { backgroundColor: "#fefefe" },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Library",
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="book-open-page-variant"
                  color={color}
                  size={size}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="stats"
            options={{
              title: "Stats",
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="chart-line"
                  color={color}
                  size={size}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="settings"
            options={{
              title: "Settings",
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="cog-outline"
                  color={color}
                  size={size}
                />
              ),
            }}
          />
        </Tabs>
      </PaperProvider>
    </BooksProvider>
  );
}
