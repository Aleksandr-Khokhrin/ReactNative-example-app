import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, SafeAreaView, Animated } from "react-native";
import Spinner from 'react-native-loading-spinner-overlay';

const LoaderComponent = () => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const startRotation = () => {
      rotateAnim.setValue(0);
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ).start();
    };

    startRotation();
    // return () => clearTimeout(timer); // Очистка таймера при размонтировании
  }, [rotateAnim]);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={{ transform: [{ rotate: rotateInterpolate }] }}
      >
        {/* Здесь вы можете добавить свою анимацию */}
      </Animated.View>
      <Spinner
        visible={loading}
        textContent={'Loading...'}
        textStyle={styles.spinnerTextStyle}
      />
    </SafeAreaView>
  );
};

export default LoaderComponent;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    zIndex: 1000,
    width: "100%",
    height: "111%",
    backgroundColor: "rgba(40, 40, 40, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  spinnerTextStyle: {
    color: '#FFF',
  },
});
