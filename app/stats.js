import { Text, View } from "react-native";
import { useBooks } from "../context/BooksContext";

export default function StatsScreen() {
  const { books } = useBooks();
  const today = new Date();
  const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));

  const booksReadThisWeek = books.filter(
    (book) => book.status === "read" && new Date(book.dateRead) >= weekStart,
  );

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Books read this week: {booksReadThisWeek.length}</Text>
    </View>
  );
}
