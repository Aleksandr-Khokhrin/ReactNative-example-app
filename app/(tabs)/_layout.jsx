import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  Animated,
  Keyboard,
  StyleSheet,
  Platform,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Tabs } from "expo-router";
import { icons } from "../../constants";
import { useTranslation } from "react-i18next";
import { useAtom } from "jotai";
import { focus, error, mistake } from "../../values/atom/myAtoms";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ErrorBox from "../../components/ErrorBox";
import MistakeMap from "../../components/MistakeMap";

const TabIcon = ({ icon, color, name, focused }) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(-50);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    Animated.spring(slideAnim, {
      toValue: 0,
      friction: 5,
      useNativeDriver: true,
    }).start();
  }, [focused]);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <Image
        source={icon}
        resizeMode="contain"
        style={{
          width: Platform.OS === "android" ? 35 : 40,
          height: Platform.OS === "android" ? 35 : 40,
        }}
      />
      <Text className={`font-robotoMedium text-xs`} style={{ color: color }}>
        {name}
      </Text>
    </Animated.View>
  );
};

const TabsLayout = () => {
  const { t } = useTranslation();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [visible, setVisible] = useAtom(focus);
  const [isError, setIsError] = useAtom(error);
  const [isMistake, setIsMistake] = useAtom(mistake);
  const [hasToken, setHasToken] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        setHasToken(!!token);
      } catch (error) {
        console.log(error);
      }
    };

    checkToken();
  }, []);

  // useEffect(() => {
  //   const keyboardDidShowListener = Keyboard.addListener(
  //     "keyboardDidShow",
  //     () => {
  //       if (visible.map) {
  //         setVisible((prevUserState) => ({
  //           ...prevUserState,
  //           search: true,
  //         }));
  //       }
  //     }
  //   );
  //   const keyboardDidHideListener = Keyboard.addListener(
  //     "keyboardDidHide",
  //     () => {
  //       setKeyboardVisible(false);
  //       setVisible((prevUserState) => ({
  //         ...prevUserState,
  //         search: false,
  //       }));
  //     }
  //   );

  //   return () => {
  //     keyboardDidHideListener.remove();
  //     keyboardDidShowListener.remove();
  //   };
  // }, [visible.map]);

  const handleTabPress = (e) => {
    if (!hasToken) {
      e.preventDefault();
      setIsMistake((prevUserState) => ({
        ...prevUserState,
        badToken: true,
      }));
    }
  };

  return (
    <SafeAreaView className={`bg-white h-[100vh] absolute w-[100vw] ${Platform.OS === "android" ? 'bottom-0' : 'bottom-[-2vh]'}`}>
      {isMistake.badToken && <MistakeMap />}
      {isError.state && <ErrorBox />}
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#19B775",
          tabBarInactiveTintColor: "#A2A2A2",
          tabBarStyle: [
            {
              position: "absolute",
              bottom: 0,
              // top: Platform.OS === "android" ? 690 : 750,
              backgroundColor: "#ffffff",
              borderTopColor: "#A2A2A2",
              paddingBottom: Platform.OS === "android" ? 0 : 0,
              height: Platform.OS === "android" ? 70 : 70,
              display: `${
                visible.search || visible.map || visible.camera || visible.route
                  ? "none"
                  : ""
              }`,
            },
            isKeyboardVisible && styles.hidden,
          ],
        }}
      >
        <Tabs.Screen
          name="map"
          options={{
            title: t("map"),
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={!focused ? icons.map : icons.mapActive}
                color={color}
                name={t("map")}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="stations"
          options={{
            title: t("stations"),
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={!focused ? icons.stations : icons.stationsActive}
                color={color}
                name={t("stations")}
                focused={focused}
              />
            ),
          }}
          // listeners={{
          //   tabPress: handleTabPress,
          // }}
        />
        <Tabs.Screen
          name="favourites"
          options={{
            title: t("favourites"),
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={!focused ? icons.favourites : icons.favouritesActive}
                color={color}
                name={t("favourites")}
                focused={focused}
              />
            ),
          }}
          listeners={{
            tabPress: handleTabPress,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: t("profile"),
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={!focused ? icons.profile : icons.profileActive}
                color={color}
                name={t("profile")}
                focused={focused}
              />
            ),
          }}
          listeners={{
            tabPress: handleTabPress,
          }}
        />
      </Tabs>
      <StatusBar backgroundColor="#FFFFFF" style="dark" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  hidden: {
    display: "none",
  },
});

export default TabsLayout;
