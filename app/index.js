import React, { useState } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useBooks } from "../context/BooksContext";

export default function Index() {
  const { books, addBook, updateBookStatus } = useBooks();
  const [newTitle, setNewTitle] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>📚 Your Library</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter book title"
        value={newTitle}
        onChangeText={setNewTitle}
      />
      <Button
        title="+ Add Book"
        onPress={() => {
          if (newTitle.trim() !== "") {
            addBook(newTitle.trim());
            setNewTitle("");
          }
        }}
      />

      <FlatList
        data={books}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.bookRow}>
            <Text style={styles.bookItem}>
              {item.title} ({item.status})
            </Text>
            <View style={styles.buttons}>
              <Button
                title="To Read"
                onPress={() => updateBookStatus(index, "to read")}
              />
              <Button
                title="Read"
                onPress={() => updateBookStatus(index, "read")}
              />
              <Button
                title="DNF"
                onPress={() => updateBookStatus(index, "DNF")}
              />
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 24,
    marginTop: 100,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
  bookItem: { fontSize: 18, paddingVertical: 4 },
  bookRow: { marginBottom: 8 },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 220,
  },
});
