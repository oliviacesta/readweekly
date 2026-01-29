import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SortModal } from "../components/sortModal";
import { useBooks } from "../context/BooksContext";

export default function LibraryScreen() {
  const { books, addBook, updateBookStatus, deleteBook } = useBooks();
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("recent");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  const fetchBookSuggestions = async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      setIsLoadingSuggestions(true);
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(query)}&maxResults=5`);
      const data = await response.json();

      if (data.items) {
        setSuggestions(
          data.items.map((item) => ({
            id: item.id,
            title: item.volumeInfo.title,
            authors: item.volumeInfo.authors?.join(", "),
          }))
        );
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Book search error:", error);
      setSuggestions([]);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const showTooShortMessage =
    newTitle.length > 0 && newTitle.length < 3;

  const showNoResults =
    newTitle.length >= 3 && !isLoadingSuggestions && suggestions.length === 0;

  let processedBooks =
    filter === "all" ? books : books.filter((book) => book.status === filter);

  if (searchQuery.length > 0) {
    processedBooks = processedBooks.filter((book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  processedBooks = [...processedBooks].sort((a, b) => {
    if (sort === "recent") return b.addedAt - a.addedAt;
    if (sort === "oldest") return a.addedAt - b.addedAt;
    if (sort === "recentRead") {
      if (!a.dateRead) return 1;
      if (!b.dateRead) return -1;
      return new Date(b.dateRead).getTime() - new Date(a.dateRead).getTime();
    }
    return 0;
  });

  const handleAddBook = () => {
    if (newTitle.trim()) {
      addBook(newTitle.trim());
      setNewTitle("");
      setSuggestions([]);
      setAddModalVisible(false);
    }
  };

  const cycleStatus = (index, currentStatus) => {
    const statuses = ["to read", "read", "DNF"];
    const nextIndex = (statuses.indexOf(currentStatus) + 1) % statuses.length;
    updateBookStatus(index, statuses[nextIndex]);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "read":
        return "#10B981";
      case "to read":
        return "#3B82F6";
      case "DNF":
        return "#EF4444";
      default:
        return "#9CA3AF";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Your Library</Text>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setAddModalVisible(true)}
          >
            <MaterialCommunityIcons name="plus" size={20} color="white" />
            <Text style={styles.headerButtonText}>Add Book</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.controlsContainer}>
          <View style={styles.searchWrapper}>
            <MaterialCommunityIcons
              name="magnify"
              size={20}
              color="#9CA3AF"
              style={{ marginRight: 8 }}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search your library..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <SortModal value={sort} onChange={setSort} />
        </View>

        <View style={styles.tabsContainer}>
          {["all", "to read", "read", "DNF"].map((status) => {
            const isActive = filter === status;
            return (
              <TouchableOpacity
                key={status}
                style={[styles.tab, isActive && styles.activeTab]}
                onPress={() => setFilter(status)}
              >
                <Text style={[ styles.tabText, isActive && styles.activeTabText]}>
                  {status === "DNF" ? "DNF" : status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <FlatList
          data={processedBooks}
          keyExtractor={(_, index) => index.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          renderItem={({ item, index }) => {
            const originalIndex = books.indexOf(item);
            return (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <TouchableOpacity
                    onPress={() => cycleStatus(originalIndex, item.status)}>
                    <View style={[styles.badge, {backgroundColor: getStatusColor(item.status)}]}>
                      <Text style={styles.badgeText}>
                        {item.status}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <TextInput
                  style={styles.reviewInput}
                  placeholder="Enter a review"
                  placeholderTextColor="#9CA3AF"
                />
                <TouchableOpacity
                  style={styles.trashButton}
                  onPress={() => deleteBook(originalIndex)}
                >
                  <MaterialCommunityIcons
                    name="trash-can-outline"
                    size={20}
                    color="#EF4444"
                  />
                </TouchableOpacity>
              </View>
            );
          }}
        />
      </View>
      {/* TO DO: make modal a separate component */}
      <Modal transparent visible={isAddModalVisible} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add a New Book</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Start typing a book title..."
              value={newTitle}
              onChangeText={(text) => {
                setNewTitle(text);
                fetchBookSuggestions(text);
              }}
              autoFocus
            />

            {showTooShortMessage && (
              <Text style={styles.helperText}>
                Enter more than 2 characters to start searching
              </Text>
            )}

            {isLoadingSuggestions && (
              <Text style={styles.helperText}>Searching…</Text>
            )}

            {newTitle.length >= 3 && (
              <View style={styles.suggestionsContainer}>
                {showNoResults && (
                  <Text style={styles.helperText}>
                    No books matching your search
                  </Text>
                )}

                <FlatList
                  data={suggestions}
                  keyExtractor={(item) => item.id}
                  keyboardShouldPersistTaps="handled"
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.suggestionItem}
                      onPress={() => {
                        addBook(item.title);
                        setNewTitle("");
                        setSuggestions([]);
                        setAddModalVisible(false);
                      }}
                    >
                      <Text style={styles.suggestionTitle}>
                        {item.title}
                      </Text>
                      {item.authors && (
                        <Text style={styles.suggestionAuthor}>
                          {item.authors}
                        </Text>
                      )}
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setAddModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddBook}
              >
                <Text style={styles.saveButtonText}>Add Book</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#a6c8ff",
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    fontFamily: 'Playfair'
  },
  headerButton: {
    backgroundColor: "#2563EB",
    flexDirection: "row",
    padding: 10,
    borderRadius: 8,
  },
  headerButtonText: {
    color: "white",
    marginLeft: 6,
  },
  controlsContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16 },
  searchWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center" },
  searchInput: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 6,
    padding: 10,
  },
  tabsContainer: {
    flexDirection: "row",
    marginBottom: 20
  },
  tab: {
    marginRight: 20,
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    color: "#6B7280",
  },
  activeTabText: {
    color: "#2563EB",
    fontWeight: "600",
  },
  row: {
    justifyContent: "space-between",
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    width: "48%",
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 2,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "bold",
    flex: 1,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    width: "85%",
    padding: 24,
    borderRadius: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  helperText: {
    textAlign: "center",
    color: "#6B7280",
    marginBottom: 8,
  },
  suggestionsContainer: {
    maxHeight: 220,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    marginBottom: 12,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  suggestionTitle: { 
    fontWeight: "600",
  },
  suggestionAuthor: {
    color: "#6B7280", 
    fontSize: 13,
  },
  modalButtons: { 
    flexDirection: "row", 
    gap: 12, 
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: { 
    backgroundColor: "#F3F4F6",
  },
  cancelButtonText: { 
    color: "#374151",
  },
  saveButton: {
    backgroundColor: "#2563EB",
  },
  saveButtonText: {
    color: "white",
  },
  trashButton: {
    position: "absolute",
    bottom: 6,
    right: 6,
  },
  reviewInput: {
    marginVertical: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 6,
    padding: 8,
    fontSize: 13,
  },
});
