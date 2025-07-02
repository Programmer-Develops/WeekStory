import AsyncStorage from '@react-native-async-storage/async-storage';

// Helper to get a unique key per birthdate and week
const getEventKey = (birthdate, week) => `@WeekStory_week_${birthdate}_${week}`;
const getEventKeyPrefix = (birthdate) => `@WeekStory_week_${birthdate}_`;

export const getEvents = async (birthdate) => {
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    const eventKeys = allKeys.filter(key => key.startsWith(getEventKeyPrefix(birthdate)));
    const events = await AsyncStorage.multiGet(eventKeys);
    return events.reduce((acc, [key, value]) => {
      const weekNumber = key.replace(getEventKeyPrefix(birthdate), '');
      acc[weekNumber] = JSON.parse(value);
      return acc;
    }, {});
  } catch (error) {
    console.error('Failed to load events:', error);
    return {};
  }
};

export const saveEvent = async (birthdate, week, eventData) => {
  try {
    await AsyncStorage.setItem(
      getEventKey(birthdate, week),
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

export const deleteEvent = async (birthdate, week) => {
  try {
    await AsyncStorage.removeItem(getEventKey(birthdate, week));
  } catch (error) {
    console.error('Failed to delete event:', error);
    throw error;
  }
};