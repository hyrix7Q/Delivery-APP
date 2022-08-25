import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { collection, deleteDoc, getDocs } from "firebase/firestore";
import {
  authentication,
  db,
} from "../../firebase/firebaseConfig/firebaseConfig";

const DeliveryOrders = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchOrders = async () => {
    const ordersArray = [];
    setIsRefreshing(true);
    const q = collection(
      db,
      "users",
      "jobs",
      "delivery",
      authentication.currentUser.uid,
      "requestedOrders"
    );
    const snapshot = await getDocs(q);

    snapshot.forEach((doc) => {
      ordersArray.push({ orderId: doc.id, ...doc.data() });
    });
    setIsRefreshing(false);
    return ordersArray;
  };
  useEffect(() => {
    fetchOrders().then((res) => {
      setOrders(res);
    });
  }, []);
  return (
    <ScrollView
      contentContainerStyle={{
        marginTop: "5%",
        flex: 1,
        backgroundColor: "#F6F6F6",
      }}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={() => {
            fetchOrders().then((res) => {
              setOrders(res);
            });
          }}
        />
      }
    >
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
        <Text style={styles.TitleText}>Your Requested Orders</Text>
      </View>
      {orders?.map((order, index) => (
        <TouchableOpacity
          key={index}
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
          }}
          onPress={() => {
            navigation.navigate("Map", {
              order: order,
            });
          }}
        >
          <Text
            style={{
              width: "75%",
              color: "black",
              fontSize: 15,
            }}
          >
            Client Name :{" "}
            <Text style={{ color: "grey" }}>{order.clientName}</Text>
          </Text>
          <Text
            style={{ width: "75%", color: "black", fontSize: 15 }}
            numberOfLines={1}
            ellipsizeMode="head"
          >
            Description :{" "}
            <Text style={{ color: "grey" }}>{order.description}</Text>
          </Text>
          <Text style={{ width: "75%", color: "black", fontSize: 15 }}>
            Price : <Text style={{ color: "grey" }}>{order.price}DA</Text>
          </Text>
          <Text style={{ color: "black" }}>
            Status :{" "}
            <Text
              style={{
                width: "75%",
                color:
                  order.status === "Accepted" || order.status === "Delivered"
                    ? "green"
                    : order.status === "Waiting"
                    ? "orange"
                    : "red",
                fontSize: 15,
              }}
            >
              {order.status}
            </Text>
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
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
export default DeliveryOrders;
