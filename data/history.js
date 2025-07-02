import AsyncStorage from '@react-native-async-storage/async-storage';


const getHistoryKey = (birthdate) => `@WeekStory_userHistory_${birthdate}`;

export const getUserHistory = async (birthdate) => {
  try {
    const json = await AsyncStorage.getItem(getHistoryKey(birthdate));
    return json ? JSON.parse(json) : {};
  } catch {
    return {};
  }
};

export const saveHistoryEvent = async (birthdate, week, description) => {
  try {
    const history = await getUserHistory(birthdate);
    history[week] = description;
    await AsyncStorage.setItem(getHistoryKey(birthdate), JSON.stringify(history));
  } catch (error) {
    console.error("Failed to save history:", error);
    throw error;
  }
};

export const deleteHistoryEvent = async (birthdate, week) => {
  try {
    const history = await getUserHistory(birthdate);
    delete history[week];
    await AsyncStorage.setItem(getHistoryKey(birthdate), JSON.stringify(history));
  } catch (error) {
    console.error("Failed to delete history:", error);
    throw error;
  }
};

export const clearAllHistory = async (birthdate) => {
  await AsyncStorage.removeItem(getHistoryKey(birthdate));
};