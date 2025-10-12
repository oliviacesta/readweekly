import React, { useContext, useState } from 'react';
import { FlatList, View } from 'react-native';
import { Button, Card, FAB, TextInput } from 'react-native-paper';
import { BooksContext } from '../context/BooksContext';

export default function LibraryScreen() {
  const { books, addBook, deleteBook } = useContext(BooksContext);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  const handleAddBook = () => {
    if (title.trim()) {
      addBook(title, author);
      setTitle('');
      setAuthor('');
      setShowForm(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {showForm ? (
        <View>
          <TextInput label="Title" value={title} onChangeText={setTitle} style={{ marginBottom: 8 }} />
          <TextInput label="Author" value={author} onChangeText={setAuthor} style={{ marginBottom: 8 }} />
          <Button mode="contained" onPress={handleAddBook}>Add Book</Button>
          <Button onPress={() => setShowForm(false)} style={{ marginTop: 8 }}>Cancel</Button>
        </View>
      ) : (
        <>
          <FlatList
            data={books}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Card style={{ marginVertical: 6 }}>
                <Card.Title title={item.title} subtitle={item.author || 'Unknown Author'} />
                <Card.Actions>
                  <Button onPress={() => deleteBook(item.id)}>Delete</Button>
                </Card.Actions>
              </Card>
            )}
          />
          <FAB
            icon="plus"
            style={{
              position: 'absolute',
              bottom: 20,
              right: 20,
              backgroundColor: '#4b7bec',
            }}
            onPress={() => setShowForm(true)}
          />
        </>
      )}
    </View>
  );
}
