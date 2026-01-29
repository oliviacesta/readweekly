import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
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
  const [editModeIndex, setEditModeIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("recent");

  
  let processedBooks = filter === "all" ? books : books.filter((book) => book.status === filter);

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
      return new Date(b.dateRead) - new Date(a.dateRead);
    }
    return 0;
  });

  const handleAddBook = () => {
    if (newTitle.trim() !== "") {
      addBook(newTitle.trim());
      setNewTitle("");
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
      case "read": return "#10B981";
      case "to read": return "#3B82F6";
      case "DNF": return "#EF4444";
      default: return "#9CA3AF";
    }
  };

  const renderHeader = () => (
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
  );

  const renderControls = () => (
    <View style={styles.controlsContainer}>
      {/* Search Bar */}
      <View style={styles.searchWrapper}>
        <MaterialCommunityIcons name="magnify" size={20} color="#9CA3AF" style={{marginRight: 8}}/>
        <TextInput
          style={styles.searchInput}
          placeholder="Search your library..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <SortModal value={sort} onChange={setSort} />
    </View>
  );

  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      {["all", "to read", "read", "DNF"].map((status) => {
        const isActive = filter === status;
        return (
          <TouchableOpacity
            key={status}
            style={[styles.tab, isActive && styles.activeTab]}
            onPress={() => setFilter(status)}
          >
            <Text style={[styles.tabText, isActive && styles.activeTabText]}>
              {status === "DNF" ? "DNF" : status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderBookCard = ({ item, index }) => {
    const originalIndex = books.indexOf(item); 

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
          <TouchableOpacity onPress={() => cycleStatus(originalIndex, item.status)}>
            <View style={[styles.badge, { backgroundColor: getStatusColor(item.status) }]}>
              <Text style={styles.badgeText}>
                {item.status === "DNF" ? "DNF" : item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setEditModeIndex(editModeIndex === originalIndex ? null : originalIndex)}>
            <MaterialCommunityIcons name="dots-horizontal" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>
        {editModeIndex === originalIndex && (
          <View style={styles.editMenu}>
            <TouchableOpacity style={styles.menuItem} onPress={() => deleteBook(originalIndex)}>
               <MaterialCommunityIcons name="trash-can-outline" size={18} color="#EF4444" />
               <Text style={[styles.menuText, {color: "#EF4444"}]}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        <View>
          <TextInput
            style={styles.input}
            placeholder="Add a review"
          />
          {/* TO DO: add review logic */}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F5F7" />
      
      <View style={styles.contentContainer}>
        {renderHeader()}
        {renderControls()}
        {renderTabs()}

        <FlatList
          data={processedBooks}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderBookCard}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No books found matching this filter.</Text>
            </View>
          }
        />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isAddModalVisible}
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add a New Book</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter book title..."
              value={newTitle}
              onChangeText={setNewTitle}
              autoFocus
            />
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
    backgroundColor: "#a6c8ff"
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
    marginTop: Platform.OS === 'android' ? 30 : 0,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  headerButton: {
    backgroundColor: "#2563EB",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  headerButtonText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 6,
  },
  controlsContainer: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 10,
    overflow: "visible",
  },
  searchWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 6,
    padding: 10,
    backgroundColor: "white",
    height: 44, 
    fontSize: 15,
    flex: 1,
  },
  sortWrapper: {
    justifyContent: "center",
    position: "relative",
    zIndex:100,
    // width: 140,
    // overflow: "hidden",
  },
  picker: {
    height: 44, 
    width: "100%",
  },
  tabsContainer: {
    flexDirection: "row",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tab: {
    marginRight: 24,
    paddingBottom: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#2563EB",
  },
  tabText: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#2563EB",
    fontWeight: "600",
  },
  listContent: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: "48%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 140,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#1F2937",
    flex: 1,
    marginRight: 8,
    alignSelf: 'flex-start'
  },
  badge: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  editMenu: {
    position: "absolute",
    right: 10,
    top: 40,
    backgroundColor: "white",
    padding: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  menuText: {
    marginLeft: 8,
    fontWeight: '600'
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
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  modalInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
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
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#2563EB",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    color: "#9CA3AF",
    fontSize: 16,
  }
});