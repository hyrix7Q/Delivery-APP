import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Picker,
} from "react-native";
import React, { useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import {
  db,
  authentication,
} from "../../../firebase/firebaseConfig/firebaseConfig";

const ValidationScreen = ({ route, navigation }) => {
  const { depart, destination, price, type, description } = route.params;

  const [selectedMethod, setSelectedMethod] = useState("hand");
  console.log(selectedMethod);
  const collectionRef = collection(db, "notValidatedOrders");
  const validateOrder = async () => {
    const snaphot = await getDoc(
      doc(db, "users", "jobs", "client", authentication.currentUser.uid)
    );
    const phoneNumber = snaphot.data().phoneNumber;
    addDoc(collectionRef, {
      clientName: authentication.currentUser.displayName,
      clientId: authentication.currentUser.uid,
      depart: depart,
      destination: destination,
      price: price,
      date: serverTimestamp(),
      typeOfVehicle: type,
      status: "Not accepted yet",
      description: description,
      clientPhoneNumber: phoneNumber,
    }).then(() => {
      Alert.alert(
        "Your Order has been successfully Validated !",
        "We will notify you when your order is accepted by a delivery man ",
        [{ text: "Okay", onPress: () => navigation.navigate("ClientHome") }]
      );
    });
  };
  return (
    <View>
      <View
        style={{
          marginTop: "15%",
          marginLeft: "10%",
          marginRight: "15%",
        }}
      >
        <Text
          style={{
            color: "#EA0039",
            fontSize: 30,

            fontWeight: "bold",
          }}
        >
          Your Order is ready to be Validated !
        </Text>
      </View>

      <View
        style={{
          paddingHorizontal: 40,
          marginTop: 20,

          overflow: "hidden",
          maxHeight: 150,
        }}
      >
        <Text style={{ fontSize: 23, color: "black", fontWeight: "bold" }}>
          Your Description :{" "}
        </Text>
        <ScrollView>
          <Text
            style={{
              fontSize: 21,
              color: "grey",

              letterSpacing: 2,
            }}
          >
            {description}
          </Text>
        </ScrollView>
      </View>

      <View style={{ paddingHorizontal: 40, marginTop: 10 }}>
        <Text style={{ fontSize: 23, color: "black", fontWeight: "bold" }}>
          Delivery Method :
        </Text>
        <Text
          style={{
            fontSize: 21,
            color: "grey",

            letterSpacing: 2,
          }}
        >
          {type}
        </Text>
      </View>
      <View style={{ paddingHorizontal: 40, marginTop: 30 }}>
        <Text style={{ fontSize: 23, color: "black", fontWeight: "bold" }}>
          Price :
        </Text>
        <Text
          style={{
            fontSize: 21,
            color: "grey",

            letterSpacing: 2,
          }}
        >
          {price}
        </Text>
      </View>
      <View
        style={{
          width: 400,

          marginTop: "5%",
        }}
      >
        <View style={{ paddingHorizontal: 40 }}>
          <Text style={{ fontSize: 23, color: "black", fontWeight: "bold" }}>
            Payment Method:
          </Text>
          <Picker
            selectedValue={selectedMethod}
            style={{ height: 50, width: "100%" }}
            onValueChange={(itemValue, itemIndex) => {
              setSelectedMethod(itemValue);
            }}
          >
            <Picker.Item label="Hand-To-Hand" value="hand" />
            <Picker.Item label="Paypal" value="paypal" />
          </Picker>
        </View>
      </View>
      <View style={{ alignItems: "center", marginTop: "5%" }}>
        <TouchableOpacity
          style={{
            backgroundColor: "#EA0039",
            paddingHorizontal: 50,
            alignItems: "center",
            borderRadius: 25,
            paddingVertical: 10,
          }}
          onPress={() => {
            selectedMethod === "hand"
              ? validateOrder()
              : navigation.navigate("Paypal", {
                  depart: depart,
                  destination: destination,
                  price: price,
                  type: type,
                  description: description,
                });
          }}
        >
          <Text style={{ color: "white", fontSize: 17, fontWeight: "bold" }}>
            Validate
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ValidationScreen;
