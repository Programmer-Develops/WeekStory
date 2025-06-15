// data/history.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_KEY = '@WeekStory_userHistory';

// 1. Get all user's historical events
export const getUserHistory = async () => {
  try {
    const json = await AsyncStorage.getItem(HISTORY_KEY);
    return json ? JSON.parse(json) : {};
  } catch {
    return {};
  }
};

// 2. Save new historical event
export const saveHistoryEvent = async (week, description) => {
  try {
    const history = await getUserHistory();
    history[week] = description;
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error("Failed to save history:", error);
    throw error;
  }
};

// 3. Delete historical event
export const deleteHistoryEvent = async (week) => {
  try {
    const history = await getUserHistory();
    delete history[week];
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error("Failed to delete history:", error);
    throw error;
  }
};

// 4. Clear all history (optional)
export const clearAllHistory = async () => {
  await AsyncStorage.removeItem(HISTORY_KEY);
};