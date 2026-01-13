import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";


export default function HomeScreen() {
  const [fontsLoaded] = useFonts({
    Playfair: require("../assets/fonts/PlayfairDisplay-SemiBold.ttf"),
  });

  if (!fontsLoaded) return null;

  return (
    <LinearGradient
      colors={["#a6c8ff", "#1e3c72"]}
      style={styles.container}>
        <View style={styles.border}>
          <Text style={styles.heading}>The app for book lovers</Text>
          <Image 
          source={require("../assets/images/book.png")}
          style={styles.image}
          ></Image>
        </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  border: {
    borderWidth: 2,
    borderColor: "black",
    flex: 1,
    borderRadius: 8,
    flexDirection: 'column',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'blue',
  },
  heading: {
    fontSize: 72,
    fontFamily: "Playfair",
    color: "#ffffff",
    marginBottom: 16,
    marginTop: 100,
    fontWeight: "bold",
    justifyContent: 'center',
    textAlign: 'center',
    textShadowColor: "rgba(0, 0, 0, 0.4)",
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 4,
  },
  image: {
    height: 400,
    width: 390,
  }
});
