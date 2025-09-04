import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [date, setDate] = useState(new Date(2000, 0, 1));
  const [showPicker, setShowPicker] = useState(false);

  const calculateWeeks = () => {
    const today = new Date();
    const diffInMs = today - date;
    const weeksLived = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 7));
    navigation.navigate('Timeline', {
      totalWeeks: weeksLived,
      birthdate: date.toISOString().slice(0, 10)
    });
  };

  return (
    <View style={styles.bg}>
      <View style={styles.card}>
        <Text style={styles.icon}>📅</Text>
        <Text style={styles.title}>WeekStory</Text>
        <Text style={styles.subtitle}>Enter your birthdate to begin</Text>

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowPicker(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.dateButtonText}>{date.toLocaleDateString()}</Text>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selectedDate) => {
              setShowPicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}

        <TouchableOpacity
          style={styles.actionButton}
          onPress={calculateWeeks}
          activeOpacity={0.8}
        >
          <Text style={styles.actionButtonText}>Generate My Timeline</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: '#f4f7fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 8,
    alignItems: 'center',
  },
  icon: {
    fontSize: 48,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#3498db',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  dateButton: {
    backgroundColor: '#eaf6fb',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: '#b5d6e6',
  },
  dateButtonText: {
    fontSize: 18,
    color: '#3498db',
    fontWeight: '500',
  },
  actionButton: {
    backgroundColor: '#3498db',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 8,
    width: '100%',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});