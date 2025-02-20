import { View, Text, ScrollView, SafeAreaView, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import SearchInput from "../../components/SearchInp.jsx";
import { useTranslation } from "react-i18next";
import StationCard from "../../components/StationCard.jsx";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuthMe } from "../../redux/slices/auth.js";
import StationCardSkeleton from "../../components/skeleton/StationCardSkeleton.jsx";

const Favourites = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const data = useSelector((state) => state.auth.data);
  const [value, setValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    setFilteredData([]);
    setIsDataLoading(true);
    dispatch(fetchAuthMe());
  }, []);

  useEffect(() => {
    if (data?.data?.saved) {
      let filtered = data.data.saved.filter((elem) => {
        const address1 = elem.location.address1.toLowerCase();
        const description = elem.description.toLowerCase();
        const name = elem.location.name.toLowerCase();
        const searchValue = value.toLowerCase();

        return (
          address1.includes(searchValue) ||
          description.includes(searchValue) ||
          name.includes(searchValue)
        );
      });


      let array = [];
      for (let index = 0; index < filtered.length; index++) {
        const element = filtered[index];
        if (
          element.connectors[1] !== undefined &&
          element.connectors[2] !== undefined
        ) {
          array.push(element);
        }
      }
      setFilteredData(array);
      setIsDataLoading(false)
    }
  }, [value, data]);

  const valueHandler = (e) => {
    setValue(e);
  };

  return (
    <SafeAreaView className="bg-white w-[100vw] h-[100%] pt-[4vh] absolute top-0">
      <View className={`w-full flex-1 px-[5vw] bg-white`}>
        <Text className={`text-2xl font-robotoMedium mt-[2vh]`}>
          {t("favourites")}
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
          ) : filteredData.length > 0 ? (
            <View
              className={`flex-col ${
                Platform.OS === "android" ? "pb-[10vh]" : "pb-[8vh]"
              }`}
            >
              {filteredData.map((elem, id) => (
                <StationCard
                  key={id}
                  station={elem}
                  busy={elem.is_enabled === "true"}
                />
              ))}
            </View>
          ) : (
            <Text className="mx-[1vh] my-[2vh] text-center font-robotoLight text-base">
              {t('stations_2')}{" "}
            </Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Favourites;
