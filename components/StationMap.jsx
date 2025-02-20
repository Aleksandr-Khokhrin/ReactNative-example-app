import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  Platform,
  ScrollView,
} from "react-native";
import { useAtom } from "jotai";
import { focus } from "../values/atom/myAtoms";
import { icons } from "../constants";
import { router } from "expo-router";
import StationPort from "./StationPort";
import { useTranslation } from "react-i18next";
import PrimaryButton from "./PrimaryButton";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
} from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { mistake } from "../values/atom/myAtoms";
import { fetchStation } from "../redux/slices/stations";
import { fetchAuthMe } from "../redux/slices/auth";
import {
  fetchSaveStation,
  fetchRemoveStation,
} from "../redux/slices/favourites";
import { useDispatch } from "react-redux";
import { error } from "../values/atom/myAtoms";
import { activeStation } from "../values/atom/myAtoms";
import StationPortSkeleton from "./skeleton/StationPortSkeleton";

const StationMap = ({ latitude, longitude }) => {
  const dispatch = useDispatch();
  const { t, i18 } = useTranslation();
  const [, setIsFocused] = useAtom(focus);
  const [, setIsMistake] = useAtom(mistake);
  const translateY = useRef(new Animated.Value(0)).current;
  const [activeId, setActiveId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [like, setLike] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [stationInfo, setStationInfo] = useState(null);
  const [, setIsError] = useAtom(error);
  const [active, setActive] = useAtom(activeStation);
  const [data, setData] = useState([]);
  useEffect(() => {
    if (active.id !== null) {
      getStation(active.id);
      myFavouritesStations();
    }
    setData([]);
  }, [active.id]);

  async function getStation(id) {
    try {
      const response = await dispatch(fetchStation(id));
      // console.log(response.payload);
      if (response.payload && response.payload.location.address1) {
        setActive((prev) => ({
          ...prev,
          address: response.payload.location.address1,
        }));
        setActive((prev) => ({
          ...prev,
          vehicle: "test",
        }));
      }
      if (response.payload && response.payload.location.city) {
        setActive((prev) => ({
          ...prev,
          city: response.payload.location.city,
        }));
      }
      if (response.payload) {
        setStationInfo(response.payload);
        latitude(response.payload.latitude);
        longitude(response.payload.longitude);
        if (response.payload.connectors_count > 0) {
          let array = [];
          for (
            let index = 0;
            index < response.payload.connectors_count;
            index++
          ) {
            // console.log(response.payload.connectors[`${index}`]["status"])
            if (index <= 2) {
              array.push({
                id: index,
                busy:
                  response.payload.connectors[`${index}`]["status"],
              });
            }
          }
          setData(array);
          setIsDataLoading(false);
          // console.log('stationInfo',response.payload)
        } else {
          setIsDataLoading(false);

          // setIsError((prev) => ({
          //   ...prev,
          //   state: true,
          // }));
          // setIsFocused((prevUserState) => ({
          //   ...prevUserState,
          //   map: false,
          //   station: false,
          // }));
        }
      }
    } catch (error) {
      console.log(error);
      setIsError((prev) => ({
        ...prev,
        state: true,
      }));
    }
  }

  async function myFavouritesStations() {
    try {
      const response = await dispatch(fetchAuthMe());
      const savedStations = response.payload.data.saved || [];
      const isLiked = savedStations.some(
        (station) => station.charge_point_id === active.id
      );
      setLike(isLiked);
    } catch (error) {
      console.log(error);
    }
  }

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

  const handleTabPress = (e) => {
    if (!hasToken) {
      setIsMistake((prevUserState) => ({
        ...prevUserState,
        badToken: true,
      }));
      setIsFocused((prevUserState) => ({
        ...prevUserState,
        map: true,
      }));
      // e.preventDefault();
    } else {
      setIsFocused((prevUserState) => ({
        ...prevUserState,
        map: false,
        station: false,
      }));
      if (activeId !== null) {
        setActive((prev) => ({
          ...prev,
          port_id: activeId,
        }));
        router.push("Station_info");
      }
    }
  };

  const likeBtnHandler = async () => {
    // console.log(like);
    if (like) {
      try {
        const response = await dispatch(
          fetchRemoveStation({ charge_point_id: active.id })
        );
        // console.log("remove", response);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const response = await dispatch(
          fetchSaveStation({ charge_point_id: active.id })
        );
        // console.log("save", response);
      } catch (error) {
        console.log(error);
      }
    }
    myFavouritesStations();
  };

  const handlePress = (id) => {
    setActiveId(id);
    setIsLoading(false); // Устанавливаем isLoading в false при клике
  };

  useEffect(() => {
    if (activeId === null) {
      setIsLoading(true); // Если нет активного элемента, isLoading = true
    } else {
      setIsLoading(false); // Иначе isLoading = false
    }
  }, [activeId]);

  const handleGesture = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: false }
  );

  const handleStateChange = ({ nativeEvent }) => {
    const { translationY } = nativeEvent;
    if (nativeEvent.state === State.END) {
      if (translationY > 20 * (Platform.OS === "ios" ? 4.5 : 3)) {
        Animated.timing(translateY, {
          toValue: 500, // значение, при котором контейнер будет полностью скрыт
          duration: 500, // Длительность анимации
          useNativeDriver: true,
        }).start(() => {
          setIsFocused((prevUserState) => ({
            ...prevUserState,
            map: false,
            station: false,
          }));
        });
      } else {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    } else {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <GestureHandlerRootView
      className={`absolute z-20 ${
        Platform.OS === "android" ? "bottom-[11vh]" : "bottom-[7vh]"
      } w-[100vw]`}
    >
      {stationInfo !== null && (
        <Animated.View
          className="bg-white rounded-3xl rounded-br-none rounded-bl-none pt-[1vh] px-[5vw]"
          style={{ transform: [{ translateY }] }}
        >
          <PanGestureHandler
            onGestureEvent={handleGesture}
            onHandlerStateChange={handleStateChange}
            activeOffsetY={[-9999, 0]}
          >
            <View className="h-[3vh]">
              <Animated.View
                id="child_two"
                className="border-2 m-2 rounded-full w-[10vw] mx-auto"
              />
            </View>
          </PanGestureHandler>
          <View className="flex-row items-center justify-between w-[100%]">
            {isDataLoading ? (
              <Text className="ml-[2vw] text-base font-robotoMedium">...</Text>
            ) : (
              <Text
                className="font-robotoMedium text-xl w-[60vw]"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {stationInfo.location.name}
              </Text>
            )}
            <View className="flex-row items-center justify-between">
              <View>
                <Image source={icons.clock} className="w-[5vw] h-[5vw]" />
              </View>
              <Text className="ml-[2vw] text-xs font-robotoMedium">24/7</Text>
            </View>
            <TouchableOpacity onPress={likeBtnHandler}>
              <Image
                source={like ? icons.flag : icons.flagSec}
                className="w-[7vw] h-[7vw]"
              />
            </TouchableOpacity>
          </View>
          <View>
            <ScrollView vertical showsVerticalScrollIndicator={false}>
              {isDataLoading ? ( // Отображаем Skeleton, пока идет загрузка
                Array.from({ length: 2 }).map((_, index) => (
                  <StationPortSkeleton key={index} />
                ))
              ) : data.length !== 0 ? (
                data.map((item) => (
                  <StationPort
                    key={item.id}
                    busy={item.busy}
                    isActive={item.id}
                    onPress={() => handlePress(item.id)}
                  />
                ))
              ) : (
                <Text className="mx-[1vh] my-[2vh] text-center font-robotoLight text-base">
                  {t('stations_1')}{" "}
                  <Text className="color-secondary font-robotoBold">
                    @s7support
                  </Text>
                </Text>
              )}
              <View className="w-full flex-row justify-between mt-[2vh] pb-[2vh]">
                <PrimaryButton
                  title={t("route")}
                  containerStyles="bg-primary w-[42vw] p-[1.5vh]"
                  textStyles="text-black"
                  handlePress={() => {
                    setIsFocused((prevUserState) => ({
                      ...prevUserState,
                      route: true,
                    }));
                  }}
                />
                <PrimaryButton
                  title={t("start")}
                  containerStyles="bg-secondary w-[42vw] p-[1.5vh]"
                  textStyles="text-white"
                  isLoading={isLoading}
                  handlePress={handleTabPress}
                />
              </View>
            </ScrollView>
          </View>
        </Animated.View>
      )}
    </GestureHandlerRootView>
  );
};

export default StationMap;
