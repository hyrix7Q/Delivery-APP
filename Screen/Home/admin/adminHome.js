import {
  View,
  Text,
  Button,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import {
  authentication,
  db,
} from "../../../firebase/firebaseConfig/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import Order from "../../../components/ClientHome/Order";

const AdminHome = ({ navigation }) => {
  const [orders, setOrders] = useState();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchOrders = async () => {
    setIsRefreshing(true);
    const docs = [];
    const q = query(
      collection(db, "notValidatedOrders"),
      where("status", "==", "Not accepted yet")
    );
    const snapShot = await getDocs(q);

    snapShot.forEach((doc) => {
      docs.push({ orderId: doc.id, ...doc.data() });
    });
    setIsRefreshing(false);
    return docs;
  };
  useEffect(() => {
    fetchOrders().then((res) => {
      setOrders(res);
    });
  }, []);

  return (
    <ScrollView
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
      contentContainerStyle={{
        marginTop: "5%",
        flex: 1,
        backgroundColor: "#F6F6F6",
      }}
    >
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
          <Text style={styles.TitleText}> Orders</Text>
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
                  color:
                    order.status === "Accepted"
                      ? "green"
                      : order.status === "Waiting"
                      ? "orange"
                      : "red",
                  fontSize: 15,
                }}
              >
                Status :{" "}
                {order.status === "Refused" ? "Not accepted yet" : order.status}
              </Text>
              <Text style={{ width: "75%", color: "grey", fontSize: 15 }}>
                Ordered in : {new Date(order.date.toDate()).toUTCString()}
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Map", {
                    depart: order.depart,
                    destination: order.destination,
                  });
                }}
                style={{
                  borderRadius: 10,
                  backgroundColor: "#EA0039",
                  paddingHorizontal: 30,
                  paddingVertical: 8,
                }}
              >
                <Text
                  style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
                >
                  Go To Map
                </Text>
              </TouchableOpacity>
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
                    fromBreakDown: false,
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
    </ScrollView>
  );
  {
    /*<View>
      <Button
        title="Signout"
        onPress={() => {
          signOut(authentication)
            .then(() => {})
            .catch((error) => {
              Alert.alert(
                "Error has occurred",
                "Signout did not complete , Try again",
                [{ text: "Okay" }]
              );
            });
        }}
      />
      {orders?.map((order, index) => (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("DeliveryFind", {
              order,
            });
          }}
          style={{ flexDirection: "row" }}
        >
          <Text>{order.price}</Text>
          <Text>{order.orderId}</Text>
        </TouchableOpacity>
      ))}
      <View></View>
        </View>*/
  }
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
    paddingHorizontal: 20,
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

export default AdminHome;
