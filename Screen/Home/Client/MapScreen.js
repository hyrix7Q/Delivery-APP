import { View, Text } from "react-native";
import React from "react";
import MapView from "react-native-maps";
import Map from "../../../components/ClientHome/Map";

const MapScreen = ({ route, navigation }) => {
  const { lat, long, type, description } = route.params;

  console.log("Mapscreen", lat, long);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: "100%" }}>
        <Map
          lat={lat}
          long={long}
          type={type}
          navigation={navigation}
          description={description}
        />
      </View>
    </View>
  );
};

export default MapScreen;
