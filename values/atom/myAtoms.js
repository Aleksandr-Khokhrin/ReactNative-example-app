// import { atom } from "jotai";
import { useEffect } from 'react';
import { Dimensions } from 'react-native';
import { atom } from 'jotai';
import { images } from '../../constants';

// Создаем атомы для ширины и высоты экрана
export const screenWidthAtom = Dimensions.get('window').width
export const screenHeightAtom = Dimensions.get('window').height

const UseScreenSize = ({ screenWidth, screenHeight }) => {


    // const [screenWidth, setScreenWidth] = useAtom(screenWidthAtom);
    // const [screenHeight, setScreenHeight] = useAtom(screenHeightAtom);

    useEffect(() => {
        // const handleResize = () => {
        //     setScreenWidth(Dimensions.get('window').width);
        //     setScreenHeight(Dimensions.get('window').height);
        // };
        props.screenWidth(Dimensions.get('window').width)
        props.screenHeight(Dimensions.get('window').width)
        const subscription = Dimensions.addEventListener('change', handleResize);

        return () => {
            subscription.remove();
        };
    }, [Dimensions.get('window').width, Dimensions.get('window').width]); // Пустой массив зависимостей, чтобы эффект выполнялся один раз

    return { screenWidth, screenHeight };
};

export default UseScreenSize;


export const regAtom = atom({
    regCode: '',
    trueCode: false,
    response_code: '',
    tel: "",
    name: "",
    surname: "",
    badCode: false,
});


export const authAtom = atom({
    authCode: '',
    trueCode: false,
    response_code: '',
    tel: "",
    name: "",
    surname: "",
    badCode: false,
});


export const activeStation = atom({
    city: "test",
    vehicle: "test",
    address: "Tashkent",
    port_id: '',
    id: '',
    websocket_url: '',
    manufacturer: '',
    model: '',
});

export const focus = atom({
    search: false,
    map: false,
    station: false,
    camera: false,
    route: false,
});
export const userData = atom({
    name: '',
    surname: '',
    phone: '',
    picture: images.user
});


export const towardPage = atom({
    profile: false,
});
export const charge = atom({
    state: false,
    sum: 20
});
export const mistake = atom({
    badToken: false,
});

export const error = atom({
    state: false,
});
export const activeLocation = atom({
    latitude: '',
    longitude: '',
});
export const chargeData = atom({
    persent: 0,
});



