import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [date, setDate] = useState(new Date(2000, 0, 1)); // Default: Jan 1, 2000
  const [showPicker, setShowPicker] = useState(false);

  const calculateWeeks = () => {
    const today = new Date();
    const diffInMs = today - date;
    const weeksLived = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 7));
    navigation.navigate('Timeline', { totalWeeks: weeksLived });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>WeekStory</Text>
      <Text style={styles.subtitle}>Enter your birthdate to begin</Text>

      <Button 
        title={date.toLocaleDateString()} 
        onPress={() => setShowPicker(true)} 
      />

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <Button 
        title="Generate My Timeline" 
        onPress={calculateWeeks}
        color="#3498db"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
});