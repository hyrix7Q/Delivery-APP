import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Button,
  RefreshControl,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import {
  authentication,
  db,
} from "../../firebase/firebaseConfig/firebaseConfig";

const CurrentOrders = ({ navigation }) => {
  const [orders, setOrders] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const fetchOrderInfos = async () => {
    let orderArray = [];
    setIsRefreshing(true);
    const q = query(
      collection(db, "validatedOrders"),
      where("deliveryId", "==", authentication.currentUser.uid),
      where("status", "!=", "Delivered")
    );

    const snapshot = await getDocs(q);

    snapshot.forEach((order) => {
      orderArray.push(order.data());
    });
    setIsRefreshing(false);
    return orderArray;
  };
  useEffect(() => {
    fetchOrderInfos().then((res) => {
      setOrders(...res);
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
            fetchOrderInfos().then((res) => {
              setOrders(...res);
            });
          }}
        />
      }
    >
      <View style={styles.TitleContainer}>
        <TouchableOpacity
          style={{ marginRight: 30 }}
          onPress={() => {
            navigation.toggleDrawer();
          }}
        >
          <Image
            source={require("../../assets/drawer2.png")}
            style={{ height: 35, width: 35 }}
          />
        </TouchableOpacity>
        <View style={{ alignSelf: "center" }}>
          <Text style={styles.TitleText}>Your Orders</Text>
        </View>
      </View>

      {orders && (
        <View>
          <View style={styles.orderContainer}>
            <Text style={{ fontSize: 16, fontWeight: "600" }}>
              Client Name : {orders?.clientName}
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "600" }}>
              Price : {orders?.price}DA
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "600" }}>
              Order Id : {orders?.orderId}
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: "#EA0039",
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 10,
                }}
                onPress={() => {
                  navigation.navigate("Map", {
                    orders: orders,
                  });
                }}
              >
                <Text
                  style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
                >
                  To Map
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: "#EA0039",
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 10,
                }}
                onPress={() => {
                  navigation.navigate("Tracking", { orders: orders });
                }}
              >
                <Text
                  style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
                >
                  Tracking
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
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
  orderContainer: {
    backgroundColor: "white",
    marginTop: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
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

export default CurrentOrders;
