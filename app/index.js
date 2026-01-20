import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";


export default function HomeScreen() {
  const [fontsLoaded] = useFonts({
    Playfair: require("../assets/fonts/PlayfairDisplay-SemiBold.ttf"),
  });

  if (!fontsLoaded) return null;

  const backgroundBooks = [
    {
      source: require("../assets/images/bookbackground1.png"),
      left: -70,
      top: -70,
    },
    {
      source: require("../assets/images/bookbackground2.png"),
      left: 445,
      top: -26,
    },
    {
      source: require("../assets/images/bookbackground3.png"),
      left: 960,
      top: 20,
    },
    {
      source: require("../assets/images/bookbackground4.png"),
      left: 1480,
      top: 60,
    },
  ];

  return (
    <LinearGradient
      colors={["#a6c8ff", "#1e3c72"]}
      style={styles.container}>
        <View style={styles.border}>
          {backgroundBooks.map((book, index) => (
            <Image
              key={index}
              source={book.source}
              style={[
                styles.backgroundImage,
                { left: book.left, top: book.top },
              ]}
            />
          ))}
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
  container: {
    flex: 1,
    padding: 16,
  },
  border: {
    flex: 1,
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 8,
    alignItems: "center",
  },
  heading: {
    fontSize: 72,
    fontFamily: "Playfair",
    color: "#ffffff",
    marginTop: 100,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.4)",
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 4,
  },
  backgroundImage: {
    position: "absolute",
    width: 600,
    height: 800,
    opacity: 0.2,
    transform: [{ rotate: "5deg" }],
  },
  image: {
    height: 400,
    width: 390,
  },
});
