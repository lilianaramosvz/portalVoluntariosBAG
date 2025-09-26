//frontend\src\navigation\GuardiaNavigator.tsx

import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const GuardiaNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={() => null}
        options={{ title: 'Home' }}
      />
    </Stack.Navigator>
  );
};

export default GuardiaNavigator;