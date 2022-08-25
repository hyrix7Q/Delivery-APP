import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import React from "react";

const Paypal = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          height: "40%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={require("../../../assets/paypal.png")}
          style={{ height: 120, width: 120 }}
        />
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: "#1565C0",
          alignSelf: "center",
          paddingHorizontal: 65,
          paddingVertical: 10,
          borderRadius: 20,
        }}
        onPress={() => {
          Alert.alert(
            "Paypal is not available in your country!",
            "Try changing the Payment method to Hand-by-hand ,Paypal will be available soon",
            [{ text: "Okay", onPress: () => navigation.navigate("YourOrders") }]
          );
        }}
      >
        <Text style={{ color: "white", fontSize: 17, fontWeight: "bold" }}>
          Pay NOW!
        </Text>
      </TouchableOpacity>
      <View style={{ marginHorizontal: 40, bottom: 100, position: "absolute" }}>
        <Text style={{ fontSize: 14, color: "grey" }}>
          PayPal is an online payment system that makes paying for things online
          and sending and receiving money safe and secure. When you link your
          bank account, credit card or debit card to your PayPal account, you
          can use PayPal to make purchases online with participating stores
        </Text>
      </View>
    </View>
  );
};

export default Paypal;
