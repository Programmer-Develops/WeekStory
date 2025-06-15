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
                    {/* <Text style={styles.weekDateText}>{item.date}</Text> */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  gridContainer: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    margin: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  historyContainer: {
    padding: 20,
    margin: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 16,
  },
  gridFooter: {
    textAlign: 'center',
    color: '#7f8c8d',
    marginTop: 12,
    fontSize: 14,
  },
  historyItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  weekBadge: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  weekBadgeText: {
    fontWeight: 'bold',
    color: '#3498db',
  },
  weekDateText: {
    color: '#95a5a6',
    fontSize: 12,
  },
  eventText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#34495e',
  },
  emptyText: {
    textAlign: 'center',
    color: '#bdc3c7',
    marginTop: 20,
    fontStyle: 'italic',
  },
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