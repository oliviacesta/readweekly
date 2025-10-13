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
  const [sort, setSort] = useState("recent"); // recent | oldest | recentRead

  // Filter
  let filteredBooks =
    filter === "all" ? books : books.filter((book) => book.status === filter);

  // Sort
  filteredBooks = [...filteredBooks].sort((a, b) => {
    if (sort === "recent") return b.addedAt - a.addedAt;
    if (sort === "oldest") return a.addedAt - b.addedAt;
    if (sort === "recentRead") {
      if (!a.dateRead) return 1;
      if (!b.dateRead) return -1;
      return new Date(b.dateRead) - new Date(a.dateRead);
    }
    return 0;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>📚 Your Library</Text>

      {/* Add Book Input */}
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
            <Text
              style={[
                styles.filterButtonText,
                filter === status && styles.activeFilterButtonText,
              ]}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sort Buttons */}
      <View style={styles.sortContainer}>
        {[
          { key: "recent", label: "Recently Added" },
          { key: "oldest", label: "Oldest Added" },
          { key: "recentRead", label: "Recently Read" },
        ].map(({ key, label }) => (
          <TouchableOpacity
            key={key}
            style={[styles.sortButton, sort === key && styles.activeSortButton]}
            onPress={() => setSort(key)}
          >
            <Text
              style={[
                styles.sortButtonText,
                sort === key && styles.activeSortButtonText,
              ]}
            >
              {label}
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
  heading: { fontSize: 24, marginBottom: 16, marginTop: 100, fontWeight: "bold" },
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
    flexWrap: "wrap",
    marginBottom: 8,
  },
  filterButton: {
    backgroundColor: "#eee",
    padding: 8,
    borderRadius: 5,
    minWidth: 70,
    alignItems: "center",
    margin: 4,
  },
  activeFilterButton: { backgroundColor: "#4b7bec" },
  filterButtonText: { color: "#000" },
  activeFilterButtonText: { color: "#fff" },
  sortContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  sortButton: {
    backgroundColor: "#eee",
    padding: 8,
    borderRadius: 5,
    minWidth: 100,
    alignItems: "center",
    margin: 4,
  },
  activeSortButton: { backgroundColor: "#2d98da" },
  sortButtonText: { color: "#000" },
  activeSortButtonText: { color: "#fff" },
  bookRow: { marginBottom: 12 },
  bookItem: { fontSize: 18, marginBottom: 4 },
  statusButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 220,
  },
  statusButton: {
    backgroundColor: "#ddd",
    padding: 6,
  },
});
