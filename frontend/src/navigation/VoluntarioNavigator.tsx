//frontend\src\navigation\VoluntarioNavigator.tsx

import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const VoluntarioNavigator = () => {
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

export default VoluntarioNavigator;