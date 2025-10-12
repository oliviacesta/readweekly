import React, { useContext, useState } from 'react';
import { View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { BooksContext } from '../context/BooksContext';

export default function SettingsScreen() {
  const { weeklyGoal, setWeeklyGoal } = useContext(BooksContext);
  const [inputGoal, setInputGoal] = useState(String(weeklyGoal));

  const saveGoal = () => {
    const newGoal = parseInt(inputGoal, 10);
    if (!isNaN(newGoal)) setWeeklyGoal(newGoal);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text variant="titleLarge" style={{ marginBottom: 12 }}>Weekly Reading Goal</Text>
      <TextInput
        label="Pages per week"
        keyboardType="numeric"
        value={inputGoal}
        onChangeText={setInputGoal}
        style={{ marginBottom: 16 }}
      />
      <Button mode="contained" onPress={saveGoal}>Save Goal</Button>
    </View>
  );
}
