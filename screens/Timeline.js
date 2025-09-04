import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView } from 'react-native';
import EventModal from '../components/EventModal';
import WeekGrid from '../components/WeekGrid';
import { getUserHistory } from '../data/history';

export default function TimelineScreen({ route }) {
  const { totalWeeks, birthdate } = route.params;
  const [history, setHistory] = useState({});
  const [selectedWeek, setSelectedWeek] = useState(null);

  useEffect(() => {
    const loadHistory = async () => {
      const userHistory = await getUserHistory(birthdate);
      setHistory(userHistory);
    };
    loadHistory();
  }, [birthdate]);

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
    <View style={styles.bg}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Your Life in Weeks</Text>
          <WeekGrid
            totalWeeks={totalWeeks}
            markedWeeks={Object.keys(history).map(Number)}
            onSelectWeek={setSelectedWeek}
          />
          <Text style={styles.gridFooter}>
            {totalWeeks} weeks | {Math.round(totalWeeks / 52)} years
          </Text>
        </View>

        <View style={styles.card}>
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

      <EventModal
        week={selectedWeek}
        visible={!!selectedWeek}
        onClose={async () => {
          const updatedHistory = await getUserHistory(birthdate);
          setHistory(updatedHistory);
          setSelectedWeek(null);
        }}
        birthdate={birthdate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: '#f4f7fa',
  },
  scrollContent: {
    padding: 16,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 8,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3498db',
    marginBottom: 18,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  gridFooter: {
    textAlign: 'center',
    color: '#7f8c8d',
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  historyItem: {
    backgroundColor: '#eaf6fb',
    borderRadius: 10,
    padding: 16,
    marginBottom: 14,
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
    fontSize: 16,
  },
  weekDateText: {
    color: '#95a5a6',
    fontSize: 13,
    fontWeight: '500',
  },
  eventText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#34495e',
  },
  emptyText: {
    textAlign: 'center',
    color: '#bdc3c7',
    marginTop: 20,
    fontStyle: 'italic',
    fontSize: 16,
  },
});