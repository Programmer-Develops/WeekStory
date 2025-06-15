import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, Modal, TextInput, Button } from 'react-native';
import WeekGrid from '../components/WeekGrid';
import { getUserHistory, saveHistoryEvent } from '../data/history';

export default function TimelineScreen({ route }) {
  const { totalWeeks, birthdate } = route.params;
  const [history, setHistory] = useState({});
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [eventText, setEventText] = useState('');

  // Load user's custom history
  useEffect(() => {
    const loadHistory = async () => {
      const userHistory = await getUserHistory();
      setHistory(userHistory);
    };
    loadHistory();
  }, []);

  const handleSaveEvent = async () => {
    if (selectedWeek && eventText.trim()) {
      await saveHistoryEvent(selectedWeek, eventText);
      const updatedHistory = await getUserHistory();
      setHistory(updatedHistory);
      setSelectedWeek(null);
      setEventText('');
    }
  };

  // Convert history object to sorted array with dates
  const sortedHistory = Object.entries(history)
    .map(([week, text]) => {
      const date = new Date(birthdate);
      date.setDate(date.getDate() + (Number(week) * 7));
      return {
        week: Number(week),
        text,
        date: date.toLocaleDateString()
      };
    })
    .sort((a, b) => a.week - b.week);

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Enhanced Week Grid */}
        <View style={styles.gridContainer}>
          <Text style={styles.sectionTitle}>Your Life in Weeks</Text>
          <WeekGrid 
            totalWeeks={totalWeeks}
            markedWeeks={Object.keys(history).map(Number)}
            onSelectWeek={setSelectedWeek}
          />
          <Text style={styles.gridFooter}>
            {totalWeeks} weeks | {Math.round(totalWeeks/52)} years
          </Text>
        </View>

        {/* History Timeline */}
        <View style={styles.historyContainer}>
          <Text style={styles.sectionTitle}>Life Events</Text>
          
          {sortedHistory.length > 0 ? (
            <FlatList
              data={sortedHistory}
              scrollEnabled={false}
              keyExtractor={(item) => item.week.toString()}
              renderItem={({ item }) => (
                <View style={styles.historyItem}>
                  <View style={styles.weekBadge}>
                    <Text style={styles.weekBadgeText}>Week {item.week}</Text>
                    <Text style={styles.weekDateText}>{item.date}</Text>
                  </View>
                  <Text style={styles.eventText}>{item.text}</Text>
                </View>
              )}
            />
          ) : (
            <Text style={styles.emptyText}>
              Tap on weeks above to add significant life events
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Event Modal */}
      <Modal
        visible={!!selectedWeek}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Week {selectedWeek}
            </Text>
            {selectedWeek && (
                <Text style={styles.modalSubtitle}>
                    {(() => {
                        const date = new Date(birthdate);
                        date.setDate(date.getDate() + (selectedWeek * 7));
                        return date.toLocaleDateString();
                    })()}
                </Text>
            )}
            <TextInput
              style={styles.modalInput}
              placeholder="What happened this week?"
              value={eventText}
              onChangeText={setEventText}
              multiline
              numberOfLines={4}
            />
            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                onPress={() => {
                  setSelectedWeek(null);
                  setEventText('');
                }}
                color="#999"
              />
              <Button
                title="Save"
                onPress={handleSaveEvent}
                disabled={!eventText.trim()}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ... (keep your existing styles and add these new ones)

const styles = StyleSheet.create({
  modalOverlay: {
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
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    minHeight: 100,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});