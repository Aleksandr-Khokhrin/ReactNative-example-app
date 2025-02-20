import { View, Text } from 'react-native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
const UserMenuLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen 
          name="Station_info"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen 
          name="Charge_page"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen 
          name="Charge_end"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen 
          name="DownloadIMG"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen 
          name="CameraPage"
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