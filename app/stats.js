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
    <View style={{ flex: 1, padding: 16, justifyContent: "center", alignItems: "center", backgroundColor: "#a6c8ff"}}>
      <Text>Books read this week: {booksReadThisWeek.length}</Text>
      <Text>TO DO... Structure of this page: let readers choose goals as #pages, #books, or #mins read per week. 
        Show an updated progress bar for the current week, and show progress from the past 4 weeks if 
        requested. Maybe a calendar view showing past stats? Also add a running count of how many weeks 
        in a row user has met their goal</Text>
    </View>
  );
}
