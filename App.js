import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Signup from "./Screen/authentication/Signup";
import Login from "./Screen/authentication/Login";
import NavigationApp from "./navigation/NavigationApp";
import NavContainer from "./navigation/NavigationContainer";
import { Provider } from "react-redux";
import { applyMiddleware, combineReducers, createStore } from "redux";
import ordersReducer from "./store/reducers/orders";
import authReducer from "./store/reducers/auth";
import ReduxThunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { LogBox } from "react-native";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import { useState } from "react";

LogBox.ignoreLogs(["Setting a timer"]);

export default function App() {
  const [fontLoaded, setfontLoaded] = useState(false);

  const rootReducer = combineReducers({
    orders: ordersReducer,
    auth: authReducer,
  });

  const fetchFonts = () => {
    return Font.loadAsync({
      pop: require("./fonts/Poppins-Regular.ttf"),
      popBold: require("./fonts/Poppins-Bold.ttf"),
      popThin: require("./fonts/Poppins-Thin.ttf"),
    });
  };

  const store = createStore(
    rootReducer,
    applyMiddleware(ReduxThunk),
    composeWithDevTools()
  );

  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setfontLoaded(true)}
        onError={console.warn}
      />
    );
  } else {
    return (
      <Provider store={store}>
        <NavContainer />
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
