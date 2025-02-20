import { View, Text, ScrollView, SafeAreaView, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import SearchInput from "../../components/SearchInp.jsx";
import { useTranslation } from "react-i18next";
import StationCard from "../../components/StationCard.jsx";
import { useAtom } from "jotai";
import { focus } from "../../values/atom/myAtoms.js";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStations,
  fetchStationSearch,
} from "../../redux/slices/stations.js";
import StationCardSkeleton from "../../components/skeleton/StationCardSkeleton.jsx";

import { error } from "../../values/atom/myAtoms.js";

const Stations = () => {
  const { t, i18 } = useTranslation();
  const [visible, setVisible] = useAtom(focus);
  const dispatch = useDispatch();
  const stations = useSelector((state) => state.stations.items); // Assuming stations.items is where the stations list is stored
  const [list, setList] = useState([]);
  const [isError, setIsError] = useAtom(error);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [value, setValue] = useState("");
  const valueHandler = (e) => {
    setValue(e);
  };

  useEffect(() => {
    setList([]);
    setIsDataLoading(true);
    getAllStations();
  }, [value]);

  async function getAllStations() {
    try {
      const response = await dispatch(fetchStationSearch(value));
      // console.log(response);
      // console.log(response.payload.results);
      let array = [];
      for (let index = 0; index < response.payload.results.length; index++) {
        const element = response.payload.results[index];
        console.log(element.connectors);
        if (
          element.connectors[1] !== undefined &&
          element.connectors[2] !== undefined
        ) {
          array.push(element);
        }
      }
      setList(array); // Assuming response.payload contains the stations list
      setIsDataLoading(false);
    } catch (error) {
      console.log(error);
      setIsError((prev) => ({
        ...prev,
        state: true,
      }));
    }
  }

  return (
    <SafeAreaView className="bg-white w-[100vw] h-[100%] pt-[4vh] absolute top-0">
      <View className={`w-full flex-1 px-[5vw] bg-white`}>
        <Text className={`text-2xl font-robotoMedium mt-[2vh]`}>
          {t("stations")}
        </Text>
        <View className="py-[2vh]">
          <SearchInput
            valueHandler={valueHandler}
            placeholder={t("searchText")}
          />
        </View>
        <ScrollView vertical showsVerticalScrollIndicator={false}>
          {isDataLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <StationCardSkeleton key={index} />
            ))
          ) : list.length > 0 ? (
            <View
              className={`flex-col ${
                Platform.OS === "android" ? "pb-[10vh]" : "pb-[8vh]"
              }`}
            >
              {list.map((elem, id) => (
                <StationCard
                  key={id}
                  station={elem}
                  busy={elem.is_enabled === "true"}
                />
              ))}
            </View>
          ) : (
            <Text className="mx-[1vh] my-[2vh] text-center font-robotoLight text-base">
              {t("stations_2")}
              {t("stations_3")}{" "}
              <Text className="color-secondary font-robotoBold">
                @s7support
              </Text>
            </Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Stations;
