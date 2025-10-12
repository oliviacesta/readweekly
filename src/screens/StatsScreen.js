import React, { useContext } from 'react';
import { Text, View } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { BooksContext } from '../context/BooksContext';

export default function StatsScreen() {
  const { weeklyGoal } = useContext(BooksContext);
  const pagesRead = 150; // placeholder until you log pages

  const progress = Math.min(pagesRead / weeklyGoal, 1);

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        Weekly Goal: {pagesRead} / {weeklyGoal} pages
      </Text>
      <ProgressBar progress={progress} color="#4b7bec" />
      <Text style={{ marginTop: 10 }}>
        {progress >= 1 ? 'Goal achieved 🎉' : 'Keep reading!'}
      </Text>
    </View>
  );
}
