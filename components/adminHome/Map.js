import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import MapView, { Marker } from "react-native-maps";

const MapAdmin = ({ navigation, route }) => {
  const { depart, destination } = route.params;

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
    <View style={{ marginTop: "5%", flex: 1 }}>
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
        style={{ position: "absolute", top: 5, left: 0, zIndex: 1000 }}
      >
        <Image
          source={require("../../assets/leftArrow.png")}
          style={{ marginLeft: 20 }}
        />
      </TouchableOpacity>
      <MapView
        mapType="mutedStandard"
        style={{ flex: 1 }}
        initialRegion={{
          latitude: depart.latitude,
          longitude: depart.longitude,
          latitudeDelta:
            calcCrow(
              depart.latitude,
              depart.longitude,
              destination.latitude,
              destination.longitude
            ) > 100
              ? 1
              : 0.5,
          longitudeDelta:
            calcCrow(
              depart.latitude,
              depart.longitude,
              destination.latitude,
              destination.longitude
            ) > 100
              ? 1
              : 0.5,
        }}
      >
        <Marker
          coordinate={{
            latitude: depart.latitude,
            longitude: depart.longitude,
          }}
          draggable={false}
        >
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: "black" }}>
              Depart
            </Text>
            <Image source={require("../../assets/depart.png")} />
          </View>
        </Marker>
        <Marker
          pinColor={"#474744"}
          coordinate={{
            latitude: destination.latitude,
            longitude: destination.longitude,
          }}
        >
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: "black" }}>
              Destination
            </Text>
            <Image source={require("../../assets/destination2.png")} />
          </View>
        </Marker>
      </MapView>
    </View>
  );
};

export default MapAdmin;
