import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";

const Types = (props) => {
  return (
    <View style={{}}>
      <TouchableOpacity
        style={{
          backgroundColor: "white",
          marginTop: 40,

          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.5,
          shadowRadius: 1.41,
          elevation: 2,
        }}
        onPress={() => {
          props.navigation.navigate("CommandeInfos", {
            type: props.name,
          });
        }}
      >
        <View style={{ width: "100%", height: 300 }}>
          <Image
            source={props.imagePath}
            style={{
              height: "100%",
              width: "100%",
            }}
          />
        </View>
        <View style={{ paddingLeft: "2%", paddingTop: "2%" }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            Delivery By {props.name}
          </Text>
        </View>
        <View
          style={{
            justifyContent: "space-evenly",
            paddingTop: "3%",
            paddingLeft: "2%",
            paddingBottom: 10,
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Image
              source={require("../../assets/fast.png")}
              style={{ height: 25, width: 25, marginRight: "5%" }}
            />
            <Text style={{}}>{props.time} Delivery</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Image
              source={require("../../assets/box.png")}
              style={{ height: 25, width: 25, marginRight: "5%" }}
            />
            <Text>{props.weight} Weight</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Types;
