import {
  View,
  Text,
  Button,
  Image,
  Picker,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useLayoutEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

const Map = ({ type, lat, long, navigation, description }) => {
  const [location, setLocation] = React.useState(null);
  const [errorMsg, setErrorMsg] = React.useState(null);
  const [depart, setDepart] = React.useState({
    latitude: lat,
    longitude: long,
  });
  const [destination, setDistination] = React.useState({});
  const [departButton, setDepartButton] = React.useState(false);
  const [destinationButton, setDestinationButton] = React.useState(false);
  const [typee, setType] = React.useState(type);
  const [showOptions, setShowOptions] = React.useState(false);
  const [price, setPrice] = React.useState(0);
  const [priceClickable, setPriceClickable] = React.useState(false);

  {
    /* 
  MOTO:
   from 0 to 1km = 100DA
   from 1 to 5km = 150DA
   from 5 to 10km = 200DA
   from 10 to 50km = 350DA
   from 50 to 100km = 500DA*
  Car:
   from 0 to 1km = 150DA
   from 1 to 5km = 200DA
   from 5 to 10km = 250DA
   from 10 to 50km = 400DA
   from 50 to 100km = 550DA
   from 100km to 500km = 750DA
   above 500km = 1000DA
  Truck:
  from 0 to 1km = 350DA
   from 1 to 5km = 500DA
   from 5 to 10km = 550DA
   from 10 to 50km = 600DA
   from 50 to 100km = 750DA
   from 100km to 500km = 950DA
   above 500km = 1200DA
*/
  }

  const distanceError = (distance) => {
    if (typee === "Motorcycle" && distance > 100) {
      setShowOptions(true);
      Alert.alert(
        "Chose another vehicle type",
        "Motocycle cannot more than 100km",
        [{ text: "Okay" }]
      );
      return;
    }
  };

  const calculatePrice = (distance) => {
    var price;

    if (typee === "Motorcycle") {
      if (distance <= 1) {
        price = 100;
      } else if (distance > 1 && distance <= 5) {
        price = 150;
      } else if (distance > 5 && distance <= 10) {
        price = 200;
      } else if (distance > 10 && distance <= 50) {
        price = 350;
      } else if (distance > 50 && distance <= 100) {
        price = 500;
      }
    } else if (typee === "Car") {
      if (distance <= 1) {
        price = 150;
      } else if (distance > 1 && distance <= 5) {
        price = 200;
      } else if (distance > 5 && distance <= 10) {
        price = 250;
      } else if (distance > 10 && distance <= 50) {
        price = 400;
      } else if (distance > 50 && distance <= 100) {
        price = 550;
      } else if (distance > 100 && distance <= 500) {
        price = 750;
      } else if (distance > 500) {
        price = 1000;
      }
    } else if (typee === "Truck") {
      if (distance <= 1) {
        price = 350;
      } else if (distance > 1 && distance <= 5) {
        price = 450;
      } else if (distance > 5 && distance <= 10) {
        price = 550;
      } else if (distance > 10 && distance <= 50) {
        price = 600;
      } else if (distance > 50 && distance <= 100) {
        price = 750;
      } else if (distance > 100 && distance <= 500) {
        price = 950;
      } else if (distance > 500) {
        price = 1200;
      }
    }
    return price;
  };

  function calcCrow(lat1, lon1, lat2, lon2) {
    var R = 6371; // km
    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lon2 - lon1);
    var lat1 = toRad(lat1);
    var lat2 = toRad(lat2);

    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
  }

  // Converts numeric degrees to radians
  function toRad(Value) {
    return (Value * Math.PI) / 180;
  }

  return (
    <ScrollView contentContainerStyle={{ flex: 1, marginTop: "5%" }}>
      <View style={{ height: "60%" }}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={{ position: "absolute", top: 5, left: 0, zIndex: 1000 }}
        >
          <Image
            source={require("../../assets/leftArrow2.png")}
            style={{ marginLeft: 10, height: 30, width: 30, marginTop: 10 }}
          />
        </TouchableOpacity>
        <MapView
          mapType="mutedStandard"
          style={{ flex: 1 }}
          initialRegion={{
            latitude: lat,
            longitude: long,
            latitudeDelta: 0.5,
            longitudeDelta: 0.5,
          }}
        >
          <Marker
            coordinate={{
              latitude: lat,
              longitude: long,
            }}
            draggable={true}
            onDragStart={(e) => {
              console.log("Drag Started ", e.nativeEvent.coordinate);
            }}
            onDragEnd={(e) => {
              console.log("Drag ended", e.nativeEvent.coordinate);
              !departButton
                ? setDepart({
                    latitude: e.nativeEvent.coordinate.latitude,
                    longitude: e.nativeEvent.coordinate.longitude,
                  })
                : setDistination({
                    latitude: e.nativeEvent.coordinate.latitude,
                    longitude: e.nativeEvent.coordinate.longitude,
                  });
            }}
          />
        </MapView>
      </View>
      <View>
        {!departButton ? (
          <Button
            title="Set Depart"
            onPress={() => {
              setDepartButton(true);
            }}
          />
        ) : (
          <Button
            title="Set Destination"
            onPress={() => {
              setDestinationButton(true);
              setPriceClickable(true);
            }}
          />
        )}
      </View>
      <View
        style={{
          paddingHorizontal: 10,
          paddingTop: 15,
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingBottom: 5,
          }}
        >
          <Image
            source={
              departButton
                ? require("../../assets/true.png")
                : require("../../assets/false.png")
            }
            style={{ marginRight: 5, height: 25, width: 25 }}
          />
          <Text style={{ fontSize: 16, fontWeight: "400" }}>Depart</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={
              destinationButton
                ? require("../../assets/true.png")
                : require("../../assets/false.png")
            }
            style={{ marginRight: 5, height: 25, width: 25 }}
          />
          <Text style={{ fontSize: 16, fontWeight: "400" }}>Destination</Text>
        </View>
      </View>
      {showOptions ? (
        <View style={{ marginTop: 20 }}>
          <Picker
            style={{ height: 50, width: "100%" }}
            onValueChange={(itemValue, itemIndex) => setType(itemValue)}
          >
            <Picker.Item label="Chose Type" />
            <Picker.Item label="Car" value="Car" />
            <Picker.Item label="Truck" value="Truck" />
          </Picker>
        </View>
      ) : null}
      <View style={{ alignSelf: "center", marginTop: 10 }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            borderBottomColor: "black",
            borderBottomWidth: 1,
          }}
        >
          Price :{price || "xxx"}
          DA
        </Text>
      </View>
      <View
        style={{
          position: "absolute",
          bottom: 20,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          paddingHorizontal: 20,
        }}
      >
        <TouchableOpacity
          disabled={!priceClickable}
          style={styles.PriceButton}
          onPress={() => {
            console.log(typee);
            console.log(
              calcCrow(
                depart.latitude,
                depart.longitude,
                destination.latitude,
                destination.longitude
              )
            );
            distanceError(
              calcCrow(
                depart.latitude,
                depart.longitude,
                destination.latitude,
                destination.longitude
              )
            );
            setPrice(
              calculatePrice(
                calcCrow(
                  depart.latitude,
                  depart.longitude,
                  destination.latitude,
                  destination.longitude
                )
              )
            );
          }}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
            Calculate Price
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={!price}
          style={{
            paddingRight: 10,
            flexDirection: "row",
            alignItems: "center",
          }}
          onPress={() => {
            navigation.navigate("ValidationScreen", {
              type: typee,
              depart: depart,
              destination: destination,
              price: price,
              description: description,
            });
          }}
        >
          <Image
            source={
              price
                ? require("../../assets/validationEnabled.png")
                : require("../../assets/validationDisabled.png")
            }
            style={{ height: 48, width: 48 }}
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  PriceButton: {
    backgroundColor: "#EA0039",
    paddingHorizontal: 20,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 1.41,
    elevation: 2,
  },
});

export default Map;
