import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  Button,
  TextInput,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState, useRef, useCallback } from "react";
import Order from "../../../components/ClientHome/Order";
import { collection, getDocs, query, where } from "firebase/firestore";
import {
  authentication,
  db,
} from "../../../firebase/firebaseConfig/firebaseConfig";
import { useDispatch, useSelector } from "react-redux";
import * as ordersActions from "../../../store/actions/orders";

const YourOrders = ({ navigation }) => {
  const ordersArray = [];
  const [isRefreshing, setIsRefreshing] = useState(false);
  const Ref = useRef();
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders.orders);
  const [ordersState, setOrdersState] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchOrders = useCallback(async () => {
    setIsRefreshing(true);
    try {
      dispatch(ordersActions.fetchOrders());
    } catch (err) {
      console.log(err.message);
    }
    setIsRefreshing(false);
  }, [setIsRefreshing, dispatch]);

  useEffect(() => {
    setIsLoading(true);
    fetchOrders()
      .then(() => {
        setOrdersState(orders);
        console.log(orders);
      })
      .then(() => {
        setIsLoading(false);
      });
  }, [dispatch, fetchOrders]);

  return (
    <View style={{ marginTop: "5%", backgroundColor: "#F6F6F6", flex: 1 }}>
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
        <View ref={Ref} style={{ alignSelf: "center" }}>
          <Text style={styles.TitleText}>Your Orders</Text>
        </View>
      </View>
      {/*<ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={fetchOrders} />
        }
        contentContainerStyle={{ paddingBottom: "50%" }}
      >
        {isLoading ? (
          <View style={styles.indicator}>
            <ActivityIndicator size="large" color="aqua" />
          </View>
        ) : (
          ordersState.map((order, index) => <Order />)
        )}
        </ScrollView>*/}

      <FlatList
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={fetchOrders} />
        }
        contentContainerStyle={{ paddingBottom: "50%" }}
        data={orders}
        renderItem={(order) => (
          <>
            <Order
              type={order.item.typeOfVehicle}
              date={order.item.date}
              price={order.item.price}
              status={order.item.status}
              navigation={navigation}
              orderId={order.item.id}
              clientId={order.item.clientId}
              description={order.item.description}
              deliveryId={order.item.deliveryId}
            />
          </>
        )}
      />
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

export default YourOrders;
