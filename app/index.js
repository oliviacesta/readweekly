import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";



export default function HomeScreen() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    Playfair: require("../assets/fonts/PlayfairDisplay-SemiBold.ttf"),
  });

  if (!fontsLoaded) return null;

  const backgroundBooks = [
    {
      source: require("../assets/images/bookbackground1.png"),
      left: -80,
      top: -50,
    },
    {
      source: require("../assets/images/bookbackground2.png"),
      left: 435,
      top: -6,
    },
    {
      source: require("../assets/images/bookbackground3.png"),
      left: 950,
      top: 40,
    },
    {
      source: require("../assets/images/bookbackground4.png"),
      left: 1470,
      top: 84,
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
          <View style={styles.innerContainer}>
            <Text style={styles.heading}>The app for book lovers</Text>
            <Image 
            source={require("../assets/images/book.png")}
            style={styles.image}
            ></Image>
            <TouchableOpacity style={styles.button} onPress={() => router.push("/stats")}>
              <Text style={styles.buttonText}>
                Start tracking your reading
              </Text>
            </TouchableOpacity>
          </View>
        </View>
    </LinearGradient>
  );
}

 const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  button: {
    backgroundColor: '#5FA8FF',
    borderWidth: 2,
    borderColor: 'blue',
    borderRadius: 8,
    padding: 4,
    width: 220,
    height: 40,
    alignSelf: 'center',
    alignItems: 'center',
    marginBottom: '20',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'blue'
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
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
    marginTop: 60,
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
    width: 400,
    resizeMode: "contain",
  },
});
