import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Platform,
  Text,
} from "react-native";
import MapView, { PROVIDER_OSM, Marker } from "react-native-maps";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import React, { useState, useEffect, useRef, useMemo } from "react";
import * as Location from "expo-location";
import { useAtom } from "jotai";
import { focus } from "../values/atom/myAtoms";
import { charge } from "../values/atom/myAtoms";
import { icons } from "../constants";
import { fetchStations } from "../redux/slices/stations";
import { useIsFocused } from "@react-navigation/native";
import { error } from "../values/atom/myAtoms";
import { activeStation } from "../values/atom/myAtoms";
import AnimatedButton from "./AnimatedButton";
import { router } from "expo-router";
import Marker_map from "./Marker_map";
import { activeLocation } from "../values/atom/myAtoms";

const initialRegion = {
  latitude: 41.2995,
  longitude: 69.2401,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const MapComponent = ({}) => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.stations.stations.items);
  const { t } = useTranslation();
  const [locationPermissionGranted, setLocationPermissionGranted] =
    useState(false);
  const [isFocused, setIsFocused] = useAtom(focus);
  const [followUser, setFollowUser] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [stations, setStations] = useState([]);
  const mapRef = useRef(null);
  const [charging, setCharging] = useAtom(charge);
  const [isError, setIsError] = useAtom(error);
  const [active, setActive] = useAtom(activeStation);
  const [activeLoc] = useAtom(activeLocation);

  const memoizedMarkers = useMemo(() => markers, [markers]);

  useEffect(() => {
    if (activeLoc.latitude !== "" && activeLoc && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: activeLoc.latitude,
          longitude: activeLoc.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      ); // Анимация перехода на новое местоположение
    }
  }, [activeLocation, isFocused.station]);

  useEffect(() => {
    dispatch(fetchStations());
  }, []);

  useEffect(() => {
    try {
      // console.log('data.results', data.results)
      if (data.results) {
        let array = [];
        for (let index = 0; index < data.results.length; index++) {
          const station = data.results[index];
          // console.log("station", station.connectors[1]);
          if (
            station.connectors[1] !== undefined &&
            station.connectors[2] !== undefined
          ) {
            array.push({
              charge_point_id: station.charge_point_id,
              station_id: station.id,
              key: station.charge_point_id,
              title: station.location.name,
              websocket_url: station.websocket_url,
              manufacturer: station.manufacturer,
              model: station.model,
              connectors: station.connectors,
              coordinate: {
                latitude: parseFloat(station.latitude), // Преобразуем в float, если это строки
                longitude: parseFloat(station.longitude),
              },
              state: [true, "not_working"],
            });
          }
        }
        setStations(array);
      }
    } catch (error) {
      console.log(error);
      setIsError((prev) => ({
        ...prev,
        state: true,
      }));
    }
  }, [data.results]);

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      setLocationPermissionGranted(true);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      return location.coords;
    } catch (error) {
      console.warn("Ошибка получения местоположения:", error);
      setIsError((prev) => ({
        ...prev,
        state: true,
      }));
      return null;
    }
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    if (stations.length > 0) {
      // console.log('stations', stations)
      const formattedMarkers = stations.map((station) => ({
        charge_point_id: station.charge_point_id,
        station_id: station.station_id,
        websocket_url: station.websocket_url,
        manufacturer: station.manufacturer,
        model: station.model,
        key: station.key,
        title: station.title,
        connectors: station.connectors,
        coordinate: {
          latitude: station.coordinate.latitude,
          longitude: station.coordinate.longitude,
        },
        state: station.state,
      }));
      setMarkers(formattedMarkers);
    }
  }, [stations]);

  const getMarkerImageSource = (state) => {
    console.log(state);
    
    // Инициализируем объект с состоянием по умолчанию
    let obj = {
      one: "not_working",
      two: "not_working",
    };
  
    if (state[0]) {
      obj.one = state[0].status === "Available"
        ? true
        : state[0].status === "Unavailable"
        ? false
        : "not_working";
    }
  
    if (state[1]) {
      obj.two = state[1].status === "Available"
        ? true
        : state[1].status === "Unavailable"
        ? false
        : "not_working";
    }
    return obj;
  };
  

  const CustomMarker = ({ marker }) => {
    const isFocused = useIsFocused();
    const obj = getMarkerImageSource(marker.connectors);

    return (
      <>
        {isFocused && (
          <Marker
            key={marker.key}
            coordinate={marker.coordinate}
            title={marker.title}
            tracksViewChanges={false}
            onPress={() => {
              // console.log(active);
              setActive((prev) => ({
                ...prev,
                id: marker.charge_point_id,
                station_id: marker.station_id,
                websocket_url: marker.websocket_url,
                manufacturer: marker.manufacturer,
                model: marker.model,
              }));
              setIsFocused((prevUserState) => ({
                ...prevUserState,
                map: false,
                station: true,
              }));
            }}
          >
            {/* <Image source={markerImage} className="w-[30vw] h-[30vw]" /> */}
            <Marker_map state={obj} power={20} />
          </Marker>
        )}
        {/* )} */}
      </>
    );
  };

  const handlePress = async () => {
    setFollowUser(true);
    const coords = await getCurrentLocation();
    if (coords && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },
        1000
      );
    }
  };

  const handleMapPress = (event) => {
    Platform.OS !== "android"
      ? !event.nativeEvent.action &&
        setIsFocused((prevUserState) => ({
          ...prevUserState,
          station: false,
        }))
      : setIsFocused((prevUserState) => ({
          ...prevUserState,
          station: false,
        }));
  };

  return (
    <View className="absolute b-0 w-[100vw] h-[100%] z-1">
      <TouchableOpacity
        className={`absolute right-[1vw] z-10 ${
          Platform.OS === "android" ? "bottom-[10vh]" : "bottom-[6vh]"
        }`}
        onPress={handlePress}
      >
        <Image source={icons.locationBtn} style={{ width: 80, height: 80 }} />
      </TouchableOpacity>
      {charging.state ? (
        <AnimatedButton />
      ) : // <TouchableOpacity
      //   className={`absolute z-[10] ${
      //     Platform.OS === "android" ? "bottom-[13vh]" : "bottom-[10vh]"
      //   } left-[5vw] bg-secondary justify-center items-center rounded-lg w-[14vw] h-[9vw]`}
      // >
      //   <Text className="text-white font-robotoRegular text-xl pl-[1vw] pb-[0.2vw]">
      //     {charging.sum}%
      //   </Text>
      // </TouchableOpacity>
      null}
      <TouchableOpacity
        className={`absolute z-[10] right-[17vw] ${
          Platform.OS === "android" ? "bottom-[10vh]" : "bottom-[6vh]"
        }`}
        onPress={() => router.push("/CameraPage")}
      >
        <Image source={icons.screenBtn} style={{ width: 80, height: 80 }} />
      </TouchableOpacity>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        showsCompass={true}
        provider={PROVIDER_OSM} // Использование OSM вместо Google Maps
        showsUserLocation={locationPermissionGranted}
        showsMyLocationButton={false}
        onPress={handleMapPress}
        onUserLocationChange={(userLocation) => {
          if (followUser) {
            mapRef.current.animateToRegion(
              {
                latitude: userLocation.nativeEvent.coordinate.latitude,
                longitude: userLocation.nativeEvent.coordinate.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              },
              1000
            );
          }
          setFollowUser(false);
        }}
        onMapReady={() => {
          // console.log("Карта готова");
          if (locationPermissionGranted) {
            getCurrentLocation().then((coords) => {
              if (coords && mapRef.current) {
                mapRef.current.animateToRegion({
                  latitude: coords.latitude,
                  longitude: coords.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                });
              }
            });
          }
        }}
        // mapPadding={{ top: 20, right: 0, bottom: 40, left: 20 }}
      >
        {memoizedMarkers.map((marker) => (
          <CustomMarker
            key={marker.key} // и здесь
            marker={marker}
          />
        ))}
      </MapView>
    </View>
  );
};

export default MapComponent;

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  followButton: {
    position: "absolute",
    bottom: Platform.OS === "android" ? 0 : 20,
    right: 0,
    zIndex: 1,
    width: 80,
    height: 80,
  },
  screenButton: {
    position: "absolute",
    bottom: Platform.OS === "android" ? 0 : 20,
    right: 60,
    zIndex: 1,
    width: 80,
    height: 80,
  },
  chargeButton: {
    position: "absolute",
    bottom: Platform.OS === "android" ? 0 : 20,
    left: 15,
    zIndex: 1,
    width: 60,
    height: Platform.OS === "android" ? 35 : 40,
  },
});
