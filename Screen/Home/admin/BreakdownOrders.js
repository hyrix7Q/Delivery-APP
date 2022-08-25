import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig/firebaseConfig";

const BreakdownOrders = ({ navigation }) => {
  const [orders, setOrders] = useState();

  const fetchOrders = async () => {
    const docs = [];
    const q = query(
      collection(db, "breakdownOrders"),
      where("status", "==", "Not accepted yet")
    );
    const snapShot = await getDocs(q);

    snapShot.forEach((doc) => {
      docs.push({ orderId: doc.id, ...doc.data() });
    });

    return docs;
  };
  useEffect(() => {
    fetchOrders().then((res) => {
      setOrders(res);
    });
  }, []);
  return (
    <View style={{ backgroundColor: "#F6F6F6", flex: 1 }}>
      <View style={styles.TitleContainer}>
        <TouchableOpacity
          style={{ marginRight: 30 }}
          onPress={() => {
            navigation.toggleDrawer();
          }}
        >
          <Image
            source={require("../../../assets/drawer2.png")}
            style={{ height: 35, width: 35 }}
          />
        </TouchableOpacity>
        <View style={{ alignSelf: "center" }}>
          <Text style={styles.TitleText}>BreakDown Orders</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 200 }}>
        {orders?.map((order, index) => (
          <View style={styles.orderContainer}>
            <View style={{}}>
              <Text style={{ fontSize: 19, fontWeight: "bold" }}>
                Delivery by {order.typeOfVehicle}
              </Text>
            </View>
            <View style={{ paddingVertical: 7 }}>
              <Text
                style={{
                  width: "75%",
                  color: "grey",
                  fontSize: 15,
                  marginBottom: 5,
                }}
                numberOfLines={1}
              >
                {order.description}
              </Text>

              <Text style={{ width: "75%", color: "grey", fontSize: 15 }}>
                Price : {order.price}DA
              </Text>
              <Text
                style={{
                  width: "75%",
                  color: "red",
                  fontSize: 15,
                }}
              >
                Status : BreakDown
              </Text>
              <Text style={{ width: "75%", color: "grey", fontSize: 15 }}>
                Ordered in : {new Date(order.date.toDate()).toUTCString()}
              </Text>
              <Text style={{ width: "75%", color: "grey", fontSize: 15 }}>
                Delivery Phone Number : {order.deliveryPhoneNumber}
              </Text>
              <Text style={{ width: "75%", color: "grey", fontSize: 15 }}>
                Client Phone Number : {order.clientPhoneNumber}
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <TouchableOpacity
                style={{
                  borderRadius: 10,
                  backgroundColor: "#EA0039",
                  paddingHorizontal: 30,
                  paddingVertical: 8,
                }}
                onPress={() => {
                  navigation.navigate("DeliveryFind", {
                    order,
                    fromRefused: false,
                    fromBreakDown: true,
                  });
                }}
              >
                <Text
                  style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
                >
                  Continue
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  TitleText: {
    color: "#EA0039",
    fontSize: 38,
    fontWeight: "bold",
  },
  TitleContainer: {
    marginTop: "7%",

    marginLeft: "10%",
    marginRight: "30%",
    marginBottom: "10%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  orderContainer: {
    backgroundColor: "white",
    marginTop: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: "80%",
    borderWidth: 0,
    borderColor: "grey",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 1.41,
    elevation: 10,
    alignSelf: "center",
    borderRadius: 10,
  },
});

export default BreakdownOrders;
