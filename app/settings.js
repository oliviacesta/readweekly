import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import StyledSwitch from "../components/switch";

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [newsUpdates, setNewsUpdates] = useState(false);
  const [promotions, setPromotions] = useState(false);
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [name, setName] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.heading}>⚙️ Settings ⚙️</Text>
        <View style={styles.sectionSettings}>
          <Text style={styles.sectionHeader}>Appearance</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Dark Mode</Text>
            <StyledSwitch
              value={darkMode}
              onValueChange={setDarkMode}
            />
          </View>
          <Text style={styles.sectionHeader}>Notifications</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Email Notifications</Text>
            <StyledSwitch
              value={emailNotifications}
              onValueChange={setEmailNotifications}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>App News</Text>
            <StyledSwitch
              value={newsUpdates}
              onValueChange={setNewsUpdates}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Promotions</Text>
            <StyledSwitch
              value={promotions}
              onValueChange={setPromotions}
            />
          </View>
        </View>
        <View style={styles.sectionSettings}>
          <Text style={styles.sectionHeader}>Account Information</Text>
          <View style={styles.accountInformation}>
            <Text style={[styles.label, {width: 48}]}>
              Name: 
            </Text>
            <TextInput
              style={styles.input}
              placeholder="your name"
              value={name}
              onChangeText={setName}
            />
          </View>
          <View style={styles.accountInformation}>
            <Text style={[styles.label, {width: 48}]}>
              Email: 
            </Text>
            <TextInput
              style={styles.input}
              placeholder="example@gmail.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.accountInformation}>
            <Text style={[styles.label, {width: 48}]}>
                City: 
              </Text>
            <TextInput
              style={styles.input}
              placeholder="your city"
              value={city}
              onChangeText={setCity}
            />
          </View>
          <TouchableOpacity style={styles.saveButton}>
            <Text style={{color:"#ccc"}}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  accountInformation: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 6, 
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#a6c8ff",
  },
  innerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: "black",
    borderRadius: 8,
    borderWidth: 2,
    padding: 24,
    flex: 1,
  },
  heading: {
    fontSize: 42,
    fontWeight: "bold",
    marginBottom: 24,
    alignSelf: "center",
    fontFamily: 'playfair'
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  label: {
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 6,
    padding: 10,
    backgroundColor: "#fff",
    flex: 1,
  },
  saveButton: {
    backgroundColor: "#002ec5",
    width: 80,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
    borderRadius: 12,
  },
  sectionSettings: {
    flexDirection: 'column',
    width: 260,
  },
});
