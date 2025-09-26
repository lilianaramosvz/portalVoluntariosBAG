//frontend\src\navigation\SuperAdminNavigator.tsx

import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const SuperAdminNavigator = () => {
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

export default SuperAdminNavigator;