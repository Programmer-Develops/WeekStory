// utils/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const EVENTS_KEY_PREFIX = '@WeekStory_week_';

// Get ALL saved events
export const getEvents = async () => {
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    const eventKeys = allKeys.filter(key => key.startsWith(EVENTS_KEY_PREFIX));
    const events = await AsyncStorage.multiGet(eventKeys);
    
    return events.reduce((acc, [key, value]) => {
      const weekNumber = key.replace(EVENTS_KEY_PREFIX, '');
      acc[weekNumber] = JSON.parse(value);
      return acc;
    }, {});
  } catch (error) {
    console.error('Failed to load events:', error);
    return {};
  }
};

// Save single event
export const saveEvent = async (week, eventData) => {
  try {
    await AsyncStorage.setItem(
      `${EVENTS_KEY_PREFIX}${week}`,
      JSON.stringify({
        ...eventData,
        createdAt: new Date().toISOString()
      })
    );
  } catch (error) {
    console.error('Failed to save event:', error);
    throw error;
  }
};

// Delete single event
export const deleteEvent = async (week) => {
  try {
    await AsyncStorage.removeItem(`${EVENTS_KEY_PREFIX}${week}`);
  } catch (error) {
    console.error('Failed to delete event:', error);
    throw error;
  }
};