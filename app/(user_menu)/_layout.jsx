import { View, Text } from 'react-native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
const UserMenuLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen 
          name="FAQ"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen 
          name="Help"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen 
          name="History"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen 
          name="Settings"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen 
          name="UpdateUser"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen 
          name="Wallet"
          options={{
            headerShown: false
          }}
        />
      </Stack>
      <StatusBar backgroundColor="#FFFFFF" style="dark" />
    </>
  )
}

export default UserMenuLayout