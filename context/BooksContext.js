import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

const BooksContext = createContext();

export const BooksProvider = ({ children }) => {
  const [books, setBooks] = useState([]);

  const addBook = (title) => {
    setBooks((prev) => [
      ...prev,
      { title, status: 'to read', dateRead: null, addedAt: Date.now() },
    ]);
  };

  useEffect(() => {
    const loadBooks = async () => {
      const savedBooks = await AsyncStorage.getItem('books');
      if (savedBooks) setBooks(JSON.parse(savedBooks));
    };
    loadBooks();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('books', JSON.stringify(books));
  }, [books]);

  const updateBookStatus = (index, status) => {
    setBooks((prev) =>
      prev.map((book, i) => {
        if (i === index) {
          return {
            ...book,
            status,
            dateRead: status === "read" ? new Date().toISOString() : book.dateRead,
          };
        }
        return book;
      })
    );
  };

  const deleteBook = (index) => {
    setBooks((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <BooksContext.Provider value={{ books, addBook, updateBookStatus, deleteBook}}>
      {children}
    </BooksContext.Provider>
  );
};

export const useBooks = () => useContext(BooksContext);
