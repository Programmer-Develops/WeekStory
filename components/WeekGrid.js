import React from 'react';
import { View, TouchableOpacity, FlatList, StyleSheet, ScrollView } from 'react-native';

export default function WeekGrid({ 
  totalWeeks, 
  markedWeeks = [], 
  onSelectWeek = () => {} 
}) {
  const weeks = Array.from({ length: totalWeeks }, (_, i) => i + 1);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.grid}>
        <FlatList
          data={weeks}
          numColumns={52}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => onSelectWeek(item)}
              style={[
                styles.week,
                markedWeeks.includes(item) ? styles.markedWeek : styles.emptyWeek
              ]}
            />
          )}
          keyExtractor={(item) => item.toString()}
          contentContainerStyle={styles.gridContent}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  grid: {
    backgroundColor: '#fff',
    border: "solid",
    borderRadius: 8,
    padding: 8,
  },
  gridContent: {
    justifyContent: 'center',
  },
  week: {
    width: 16,
    height: 16,
    margin: 1,
    borderRadius: 2,
  },
  emptyWeek: {
    backgroundColor: '#ecf0f1', 
  },
  markedWeek: {
    backgroundColor: '#e74c3c', // Vibrant red
  },
});