import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const BooksContext = createContext();

export const BooksProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [weeklyGoal, setWeeklyGoal] = useState(200);

  useEffect(() => {
    loadBooks();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('books', JSON.stringify(books));
  }, [books]);

  const loadBooks = async () => {
    try {
      const storedBooks = await AsyncStorage.getItem('books');
      if (storedBooks) setBooks(JSON.parse(storedBooks));
    } catch (e) {
      console.error('Error loading books:', e);
    }
  };

  const addBook = (title, author, status = 'to-read', totalPages = 0) => {
    const newBook = { id: uuidv4(), title, author, status, totalPages, pagesRead: 0 };
    setBooks([...books, newBook]);
  };

  const updateBook = (id, updates) => {
    setBooks(books.map(book => (book.id === id ? { ...book, ...updates } : book)));
  };

  const deleteBook = (id) => {
    setBooks(books.filter(book => book.id !== id));
  };

  const value = { books, addBook, updateBook, deleteBook, weeklyGoal, setWeeklyGoal };
  return <BooksContext.Provider value={value}>{children}</BooksContext.Provider>;
};
