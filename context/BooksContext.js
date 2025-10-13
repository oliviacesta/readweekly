import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

const BooksContext = createContext();

export const BooksProvider = ({ children }) => {
  const [books, setBooks] = useState([]);

  const addBook = (title) => {
    setBooks((prev) => [...prev, { title, status: 'to read' }]);
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
      prev.map((book, i) =>
        i === index ? { ...book, status } : book
      )
    );
  };

  return (
    <BooksContext.Provider value={{ books, addBook, updateBookStatus}}>
      {children}
    </BooksContext.Provider>
  );
};

export const useBooks = () => useContext(BooksContext);
