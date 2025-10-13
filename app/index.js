import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
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
      <Text style={styles.heading}>📚 Your Library!</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter book title"
        value={newTitle}
        onChangeText={setNewTitle}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          if (newTitle.trim() !== "") {
            addBook(newTitle.trim());
            setNewTitle("");
          }
        }}
      >
        <Text style={styles.addButtonText}>+ Add Book</Text>
      </TouchableOpacity>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {["all", "to read", "read", "DNF"].map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterButton,
              filter === status && styles.activeFilterButton,
            ]}
            onPress={() => setFilter(status)}
          >
            <Text style={styles.filterButtonText}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Book List */}
      <FlatList
        data={filteredBooks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.bookRow}>
            <Text style={styles.bookItem}>
              {item.title} ({item.status})
            </Text>
            <View style={styles.statusButtons}>
              <TouchableOpacity
                style={styles.statusButton}
                onPress={() => updateBookStatus(index, "to read")}
              >
                <Text>To Read</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.statusButton}
                onPress={() => updateBookStatus(index, "read")}
              >
                <Text>Read</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.statusButton}
                onPress={() => updateBookStatus(index, "DNF")}
              >
                <Text>DNF</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No books found
          </Text>
        }
      />
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
