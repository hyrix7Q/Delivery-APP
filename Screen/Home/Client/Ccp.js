import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import React from "react";

const Ccp = ({ navigation, route }) => {
  const { price, onCancel } = route.params;
  return (
    <View style={{ flex: 1 }}>
      <Image
        source={require("../../../assets/ccp.png")}
        style={{
          height: 125,
          width: 110,
          alignSelf: "center",
          marginTop: "10%",
        }}
      />
      <View style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: 20, marginTop: 50 }}>
          <Text style={{ fontSize: 16 }}>
            Account number :{" "}
            <Text style={{ color: "grey", fontSize: 16 }}>00974541854 </Text>
          </Text>
          <Text style={{ fontSize: 16 }}>
            Account key :{" "}
            <Text style={{ color: "grey", fontSize: 16 }}>45 </Text>
          </Text>
          <Text style={{ fontSize: 16 }}>
            Account name :{" "}
            <Text style={{ color: "grey", fontSize: 16 }}>
              Brahim Zakaria Kendil Hadjaz{" "}
            </Text>
          </Text>
          <Text style={{ fontSize: 16 }}>
            Price to be payed:{" "}
            <Text style={{ color: "grey", fontSize: 16 }}>{price}DA</Text>
          </Text>
        </View>

        <TouchableOpacity
          style={{
            marginTop: "auto",
            marginBottom: 20,
            backgroundColor: "#E2BA39",
            alignSelf: "center",
            paddingHorizontal: 40,
            paddingVertical: 5,
            borderRadius: 25,
          }}
          onPress={() => {
            Alert.alert(
              "Warning!",
              "Don't forget to pay ! either way you will be reported to the police !",
              [
                {
                  text: "Okay",
                  onPress: () => {
                    onCancel(), navigation.goBack();
                  },
                },
              ]
            );
          }}
        >
          <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
            Return
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Ccp;
