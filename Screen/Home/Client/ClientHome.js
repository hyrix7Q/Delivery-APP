import {
  View,
  Text,
  Button,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import MapScreen from "./MapScreen";
import Types from "../../../components/ClientHome/Types";

const ClientHome = ({ navigation }) => {
  const motoImagePath = require("../../../assets/moto.jpg");
  const carImagePath = require("../../../assets/car.jpg");
  const truckImagePath = require("../../../assets/truck.jpg");
  return (
    <View style={{ flex: 1, backgroundColor: "#EA0039" }}>
      <View
        style={{
          backgroundColor: "#EA0039",
          height: 200,
          zIndex: -1,
          paddingTop: 50,
        }}
      >
        <TouchableOpacity
          style={{ marginTop: -30, paddingLeft: 10 }}
          onPress={() => {
            navigation.toggleDrawer();
          }}
        >
          <Image
            source={require("../../../assets/drawer.png")}
            style={{ height: 45, width: 45 }}
          />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            marginRight: "6%",
            justifyContent: "center",
          }}
        >
          <View style={{ marginLeft: "4%" }}>
            <Text
              style={{
                color: "white",
                fontSize: 60,
                letterSpacing: 20,
                fontWeight: "600",
                fontFamily: "pop",
              }}
            >
              Tawsil
            </Text>
            <Text
              style={{
                color: "white",
                fontSize: 20,
                fontWeight: "600",
                alignSelf: "center",
                position: "relative",
                bottom: 10,
                fontFamily: "pop",
              }}
            >
              For Fast Delivery
            </Text>
          </View>
          {/* <Image
            source={require("../../../assets/clientHomeIcon.png")}
            style={{ height: 160, width: 160 }}
            /> */}
        </View>
      </View>
      <View
        style={{
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          backgroundColor: "#F6F6F6",
          zIndex: 1,
          flex: 1,
        }}
      >
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: "5%", paddingBottom: 50 }}
        >
          <Types
            imagePath={motoImagePath}
            name="Motorcycle"
            time="Fast"
            weight="Low"
            navigation={navigation}
          />
          <Types
            imagePath={carImagePath}
            name="Car"
            time="Medium Time"
            weight="Medium"
            navigation={navigation}
          />
          <Types
            imagePath={truckImagePath}
            name="Truck"
            time="Slow"
            weight="High"
            navigation={navigation}
          />
        </ScrollView>
      </View>
    </View>
  );
};

export default ClientHome;
