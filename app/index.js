import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View
} from "react-native";
import { useBooks } from "../context/BooksContext";

export default function LibraryScreen() {
  const { books, addBook, updateBookStatus } = useBooks();
  const [newTitle, setNewTitle] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredBooks =
    filter === "all" ? books : books.filter((book) => book.status === filter);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>📚 The app for booklovers</Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  heading: {
    fontSize: 24,
    marginBottom: 16,
    marginTop: 100,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
  addButton: {
    backgroundColor: "#4b7bec",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 12,
  },
  addButtonText: { color: "#fff", fontSize: 16 },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
    flexWrap: "wrap",
  },
  filterButton: {
    backgroundColor: "#eee",
    padding: 8,
    borderRadius: 5,
    minWidth: 70,
    alignItems: "center",
    margin: 4,
  },
  activeFilterButton: {
    backgroundColor: "#4b7bec",
  },
  filterButtonText: {
    color: "#000",
  },
  bookRow: { marginBottom: 12 },
  bookItem: { fontSize: 18, marginBottom: 4 },
  statusButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 220,
  },
  statusButton: { backgroundColor: "#ddd", padding: 6, borderRadius: 4 },
});
