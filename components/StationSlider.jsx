import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Animated,
  PanResponder,
  Platform,
} from "react-native";
import Pagination from "./Pagination";
import { icons } from "../constants";
import { useTranslation } from "react-i18next";
import StationInputBox from "./StationInputBox";

const StationSlider = ({ plans, planInfo }) => {
  const [path, setPath] = useState(0);
  const [amount, setAmount] = useState("");
  const { t, i18 } = useTranslation();
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    setAmount(myArray[path].cost);
    let obj = {};
    if (myArray[path].cost !== null) {
      obj = {
        amount: parseInt(myArray[path].cost),
        plan_type: myArray[path].type,
      };
    } else {
      obj = {
        plan_type: myArray[path].type,
      };
    }
    planInfo(obj);
  }, [path]);
  const myArray = [
    {
      title: t("stationSlider_3"),
      img: icons.battery,
      cost: null,
      type: "limitless",
    },
    {
      title: t("stationSlider_4"),
      img: icons.zip,
      cost: "50",
      const_1: t("kw"),
      type: "kwh",
    },
    {
      title: t("stationSlider_5"),
      img: icons.som,
      cost: "50 000",
      const_1: t("sum"),
      type: "money",
    },
    {
      title: t("stationSlider_6"),
      img: icons.stateClock,
      cost: "90",
      const_1: t("min"),
      type: "time",
    },
    {
      title: t("stationSlider_6"),
      img: icons.persent,
      cost: "80",
      const_1: "%",
      type: "percentage",
    },
  ];

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) =>
        Math.abs(gestureState.dx) > 20,
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 50) {
          console.log("left");
          handleSwipe("left");
        } else if (gestureState.dx < -50) {
          console.log("right");
          handleSwipe("right");
        }
      },
    })
  ).current;

  const handleSwipe = (direction) => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setPath((prevPath) => {
        if (direction === "left" && prevPath > 0) {
          return prevPath - 1;
        } else if (direction === "right" && prevPath < myArray.length - 1) {
          return prevPath + 1;
        } else if (direction === "right" && prevPath === myArray.length - 1) {
          return 0;
        } else {
          return myArray.length - 1;
        }
        // return prevPath;
      });
    });
  };
  const amountHandler = (e) => {
    setAmount(e);
  };
  useEffect(() => {
    // console.log(path);
  }, [path]);

  return (
    <Animated.View
      className="flex-row justify-between border-2 border-grayColor-600 mt-[2vh] rounded-2xl px-[4vw] py-[3vh]"
      {...panResponder.panHandlers}
      style={{ opacity: opacityAnim, transform: [{ scale: scaleAnim }] }}
    >
      <View>
        <View className="flex-row justify-between">
          <View>
            <Text>{t("stationSlider_1")}</Text>
            <View className="flex-row items-center h-[6vh]">
              <Image
                source={myArray[path].img}
                // className={myArray[path].size}
              />
              <Text className="font-robotoMedium text-lg ml-[1vw]">
                {myArray[path].title}
              </Text>
            </View>
          </View>
          {path === 0 ? (
            ""
          ) : (
            <StationInputBox
              text={myArray[path].cost}
              text_1={myArray[path].const_1}
              amountHandler={amountHandler}
            />
          )}
        </View>
        <View className="flex-row items-end justify-between w-full">
          <Text className="w-[60vw] font-robotoRegular text-xs color-grayColor-500">
            {/* {t("stationSlider_2")} */}
            {plans[path]}
          </Text>
          <Pagination
            sum={myArray.length}
            active={path + 1}
            slider={true}
            otherStyles="gap-1"
          />
        </View>
      </View>
    </Animated.View>
  );
};

export default StationSlider;
