// components/EventModal.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet } from 'react-native';
import { saveHistoryEvent } from '../data/history';

export default function EventModal({ week, visible, onClose, birthdate }) {
  const [eventText, setEventText] = useState('');
  const [weekDate, setWeekDate] = useState('');

  // Calculate approximate date when week or birthdate changes
  useEffect(() => {
    if (birthdate && week) {
      const date = new Date(birthdate);
      date.setDate(date.getDate() + (week * 7)); // Add weeks
      setWeekDate(date.toLocaleDateString());
    }
  }, [week, birthdate]);

  const handleSave = async () => {
    if (eventText.trim()) {
      await saveHistoryEvent(week, eventText);
    }
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.header}>
            Week {week} ({weekDate})
          </Text>

          <TextInput
            style={styles.input}
            placeholder="What happened this week?"
            value={eventText}
            onChangeText={setEventText}
            multiline
            numberOfLines={4}
          />

          <View style={styles.buttonContainer}>
            <Button 
              title="Cancel" 
              onPress={onClose} 
              color="#999"
            />
            <Button 
              title="Save Event" 
              onPress={handleSave} 
              disabled={!eventText.trim()}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subheader: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});