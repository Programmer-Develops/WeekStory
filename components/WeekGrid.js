import React from 'react';
import { View, TouchableOpacity, FlatList, StyleSheet, ScrollView } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

export default function WeekGrid({ 
  totalWeeks, 
  markedWeeks = [], 
  onSelectWeek = () => {} 
}) {
  const weeks = Array.from({ length: totalWeeks }, (_, i) => i + 1);


  // Zoom state using Reanimated (new API)
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = Math.max(0.5, Math.min(savedScale.value * event.scale, 3));
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <GestureDetector gesture={pinchGesture}>
        <Animated.View style={[styles.grid, animatedStyle]}>
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
        </Animated.View>
      </GestureDetector>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  grid: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'solid',
    borderRadius: 8,
    padding: 8,
  },
  gridContent: {
    justifyContent: 'center',
  },
  week: {
    width: 8,
    height: 8,
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