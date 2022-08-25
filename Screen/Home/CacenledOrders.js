import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import {
  authentication,
  db,
} from "../../firebase/firebaseConfig/firebaseConfig";

const CanceledOrders = ({ navigation }) => {
  const [orders, setOrders] = useState();

  const onConfirm = async (id) => {
    const docRef = doc(
      db,
      "users",
      "jobs",
      "delivery",
      authentication.currentUser.uid,
      "canceledOrders",
      id
    );
    deleteDoc(docRef);
  };

  const fetchCanceled = async () => {
    const orderArray = [];
    const docRef = collection(
      db,
      "users",
      "jobs",
      "delivery",
      authentication.currentUser.uid,
      "canceledOrders"
    );
    const q = query(docRef, orderBy("date", "asc"));
    const snapshot = await getDocs(q);

    snapshot.forEach((doc) => {
      orderArray.push({ orderId: doc.id, ...doc.data() });
    });
    return orderArray;
  };
  useEffect(() => {
    fetchCanceled().then((res) => {
      setOrders(res);
    });
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: "#F6F6F6" }}>
      <View style={styles.TitleContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.toggleDrawer();
          }}
        >
          <Image
            source={require("../../assets/drawer2.png")}
            style={{ marginRight: 20 }}
          />
        </TouchableOpacity>
        <Text style={styles.TitleText}>Your Canceled Orders</Text>
      </View>
      {orders?.map((order) => (
        <View
          style={{
            marginHorizontal: 40,
            paddingHorizontal: 10,
            paddingVertical: 10,
            borderWidth: 0,
            borderColor: "grey",
            backgroundColor: "white",
            shadowColor: "#000",
            shadowOffset: {
              width: 1,
              height: 3,
            },
            shadowOpacity: 0.5,
            shadowRadius: 1.41,
            elevation: 10,
            borderRadius: 10,
          }}
        >
          <Text style={{ width: "75%", color: "grey", fontSize: 15 }}>
            Client Name : {order.clientName}
          </Text>
          <Text
            style={{ width: "75%", color: "grey", fontSize: 15 }}
            numberOfLines={1}
            ellipsizeMode="head"
          >
            Description : {order.description}
          </Text>
          <Text style={{ width: "75%", color: "grey", fontSize: 15 }}>
            Price : {order.price}DA
          </Text>
          <Text style={{ width: "75%", color: "grey", fontSize: 15 }}>
            Status : {order.status}
          </Text>
          <TouchableOpacity
            style={{
              marginTop: 20,
              alignSelf: "center",
              backgroundColor: "#EA0039",
              paddingHorizontal: 30,
              paddingVertical: 8,
              borderRadius: 20,
            }}
            onPress={() => {
              onConfirm(order.orderId).then(() => {
                fetchCanceled().then((res) => {
                  setOrders(res);
                });
              });
            }}
          >
            <Text style={{ color: "white", fontSize: 17, fontWeight: "bold" }}>
              Confirm
            </Text>
          </TouchableOpacity>
        </View>
      ))}
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
});

export default CanceledOrders;
