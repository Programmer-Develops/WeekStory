import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import WeekGrid from '../components/WeekGrid';
import EventModal from '../components/EventModal';
import { fetchHistoricalEvents } from '../data/history';
import { getEvents } from '../utils/storage';

export default function TimelineScreen({ route }) {
  const { totalWeeks } = route.params;
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [events, setEvents] = useState({});
  const [historicalData, setHistoricalData] = useState({});
  const [loading, setLoading] = useState(true);

  // Load saved events and historical data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [userEvents, historical] = await Promise.all([
          getEvents(),
          fetchHistoricalEvents(totalWeeks)
        ]);
        setEvents(userEvents);
        setHistoricalData(historical);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [totalWeeks]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        Your {totalWeeks.toLocaleString()} Weeks
      </Text>

      <WeekGrid 
        totalWeeks={totalWeeks}
        events={events}
        historicalEvents={historicalData}
        onSelectWeek={setSelectedWeek}
      />

      <EventModal
        week={selectedWeek}
        visible={!!selectedWeek}
        onClose={() => setSelectedWeek(null)}
        existingEvent={events[selectedWeek]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 10,
    fontWeight: 'bold',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});