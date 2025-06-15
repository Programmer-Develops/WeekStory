import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/Login';
import TimelineScreen from './screens/Timeline';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ title: 'WeekStory - Your Birthdate' }}
        />
        <Stack.Screen 
          name="Timeline" 
          component={TimelineScreen} 
          options={{ title: 'Your Life in Weeks' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}