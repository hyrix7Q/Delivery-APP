import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";

import React, { useEffect, useLayoutEffect } from "react";

import * as Location from "expo-location";

const CommandeInfos = ({ navigation, route }) => {
  const [location, setLocation] = React.useState({});
  const [errorMsg, setErrorMsg] = React.useState(null);
  const [description, setDescription] = React.useState("");
  const [descError, setDescError] = React.useState(false);
  const { type } = route.params;

  useLayoutEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const sendInfos = () => {
    if (location) {
      navigation.navigate("MapScreen", {
        lat: location.coords.latitude,
        long: location.coords.longitude,
        type: type,
        description: description,
      });
    } else {
      Alert.alert("Error", "Try again", [{ text: "Okay" }]);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ marginTop: "5%", flexGrow: 1 }}>
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Image
          source={require("../../../assets/leftArrow.png")}
          style={{ marginLeft: 20 }}
        />
      </TouchableOpacity>
      <View style={styles.TitleContainer}>
        <Text style={styles.TitleText}>Delivery By {type}</Text>
      </View>

      <View style={styles.InputContainer}>
        <View
          style={{
            borderLeftWidth: 1,
            borderLeftColor: "grey",
            maxHeight: 150,
          }}
        >
          <TextInput
            style={{
              fontSize: 21,
              color: "grey",
              paddingHorizontal: 9,
              letterSpacing: 1,
            }}
            multiline={true}
            placeholder="Enter the description of the Command ( Size , Volume ....) "
            onChangeText={(text) => {
              setDescription(text);
            }}
          />
        </View>
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 200,
            width: "85%",
          }}
          onPress={
            description === ""
              ? () => {
                  setDescError(true);
                }
              : () => {
                  setDescError(false);
                  sendInfos();
                }
          }
        >
          <View
            style={{
              borderWidth: 0.3,
              borderColor: "grey",

              borderRadius: 25,
              padding: 10,
              flexDirection: "row",
              paddingHorizontal: 10,
              justifyContent: "center",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowOpacity: 0.5,
              shadowRadius: 1.41,
              elevation: 2,
            }}
          >
            <View style={{ flexGrow: 1, alignSelf: "center" }}>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                Depart & Destination{" "}
              </Text>
            </View>
            <Image
              source={require("../../../assets/map.png")}
              style={{ height: 25, width: 25 }}
            />
          </View>
        </TouchableOpacity>
      </View>
      {descError && (
        <View style={{ alignSelf: "center" }}>
          <Text style={{ color: "red" }}>Description required</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  TitleText: {
    color: "#EA0039",
    fontSize: 38,
    fontWeight: "bold",
  },
  TitleContainer: {
    marginTop: "10%",
    marginLeft: "10%",
    marginRight: "20%",
  },
  InputContainer: {
    marginTop: "10%",
    marginHorizontal: "10%",
  },
  inputField: {
    marginBottom: "5%",
    borderRadius: 25,
    backgroundColor: "white",
  },
  input: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 15,
  },
});

export default CommandeInfos;
