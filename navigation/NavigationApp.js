import {
  View,
  Text,
  Alert,
  Button,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Signup from "../Screen/authentication/Signup";
import Login from "../Screen/authentication/Login";
import DeliveryHome from "../Screen/Home/DeliveryHome";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { authentication, db } from "../firebase/firebaseConfig/firebaseConfig";
import Modal from "../Screen/Modal/Modal";
import MapScreen from "../Screen/Home/Client/MapScreen";
import ClientHome from "../Screen/Home/Client/ClientHome";
import CommandeInfos from "../Screen/Home/Client/CommandeInfos";
import ValidationScreen from "../Screen/Home/Client/ValidationScreen";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import YourOrders from "../Screen/Home/Client/YourOrders";
import adminHome from "../Screen/Home/admin/adminHome";
import AdminHome from "../Screen/Home/admin/adminHome";
import deliveryFind from "../Screen/Home/admin/deliveryFind";
import DeliveryFind from "../Screen/Home/admin/deliveryFind";

import DeliveryOrders from "../Screen/Home/deliveryOrders";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import Map from "../components/DeliveryHome/Map";
import CurrentOrders from "../Screen/Home/CurrentOrders";
import TrackingDelivery from "../Screen/Home/TrackingDelivery";
import Tracking from "../Screen/Home/Client/Tracking";
import RefusedOrders from "../Screen/Home/admin/RefusedOrders";
import Stats from "../Screen/Home/admin/Stats";
import Paypal from "../Screen/Home/Client/Paypal";
import TrackingMap from "../components/DeliveryHome/trackingMap";
import RequestedDelivery from "../Screen/Home/admin/RequestedDelivery";
import MapAdmin from "../components/adminHome/Map";
import CanceledOrders from "../Screen/Home/CacenledOrders";
import BreakdownOrders from "../Screen/Home/admin/BreakdownOrders";
import Ccp from "../Screen/Home/Client/Ccp";
import ChosenOrders from "../Screen/Home/admin/ChosenOrders";

const Stack = createStackNavigator();
const ClientDrawer = createDrawerNavigator();
const AuthStack = createStackNavigator();
const HomeStack = createStackNavigator();
const OrdersStack = createStackNavigator();
const DeliveryHomeStack = createStackNavigator();
const DeliveryDrawer = createDrawerNavigator();
const AdminStack = createStackNavigator();
const DeliveryOrder = createStackNavigator();
const AdminDrawer = createDrawerNavigator();

export const AuthNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={({}) => ({ headerShown: false })}>
      <AuthStack.Screen name="Signup" component={Signup} />
      <AuthStack.Screen name="Login" component={Login} />
    </AuthStack.Navigator>
  );
};

const HomeNavigator = () => {
  return (
    <HomeStack.Navigator screenOptions={({}) => ({ headerShown: false })}>
      <HomeStack.Screen name="ClientHome" component={ClientHome} />
      <HomeStack.Screen name="Commande" component={CommandeInfos} />
      <HomeStack.Screen name="MapScreen" component={MapScreen} />
      <HomeStack.Screen name="CommandeInfos" component={CommandeInfos} />
      <HomeStack.Screen name="ValidationScreen" component={ValidationScreen} />
      <HomeStack.Screen name="Paypal" component={Paypal} />
    </HomeStack.Navigator>
  );
};

export const DeliveryHomeNavigator = () => {
  return (
    <DeliveryHomeStack.Navigator
      screenOptions={({}) => ({ headerShown: false })}
    >
      <DeliveryHomeStack.Screen name="DeliveryHome" component={DeliveryHome} />
      <DeliveryHomeStack.Screen name="Modal" component={Modal} />
      <DeliveryHomeStack.Screen name="Map" component={Map} />
    </DeliveryHomeStack.Navigator>
  );
};
const OrdersNavigator = () => {
  return (
    <OrdersStack.Navigator screenOptions={({}) => ({ headerShown: false })}>
      <OrdersStack.Screen name="YourOrders" component={YourOrders} />
      <OrdersStack.Screen name="Tracking" component={Tracking} />
      <OrdersStack.Screen name="Paypal1" component={Paypal} />
      <OrdersStack.Screen name="Ccp" component={Ccp} />
    </OrdersStack.Navigator>
  );
};

function CustomDrawerContent(props) {
  const name = authentication.currentUser.displayName;

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <View
        style={{
          height: "20%",
          paddingLeft: 12,
          borderBottomWidth: 1,
          borderBottomColor: "grey",
          justifyContent: "center",
          marginBottom: 10,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <View style={{ marginBottom: 10 }}>
            <Image
              source={require("../assets/avatar.png")}
              style={{ height: 60, width: 60, borderRadius: 25 }}
            />
          </View>
        </View>
        <Text style={{ fontSize: 20, color: "black", fontWeight: "bold" }}>
          {authentication.currentUser.displayName}
        </Text>
      </View>
      <DrawerItemList {...props} />
      <View
        style={{
          position: "absolute",
          bottom: 30,
          width: "100%",
          alignSelf: "center",
          borderTopWidth: 1,
          borderTopColor: "grey",

          alignItems: "center",
        }}
      >
        <TouchableOpacity
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
          style={{
            marginTop: 20,
            backgroundColor: "#EA0039",
            alignItems: "center",
            paddingVertical: 10,

            width: "60%",
            borderRadius: 25,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 17 }}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

function DeliveryCustomDrawerContent(props) {
  const name = authentication.currentUser.displayName;

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <View
        style={{
          height: "20%",
          paddingLeft: 12,
          borderBottomWidth: 1,
          borderBottomColor: "grey",
          justifyContent: "center",
          marginBottom: 10,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <View style={{ marginBottom: 10 }}>
            <Image
              source={require("../assets/avatar.png")}
              style={{ height: 60, width: 60, borderRadius: 25 }}
            />
          </View>
        </View>
        <Text style={{ fontSize: 20, color: "black", fontWeight: "bold" }}>
          {authentication.currentUser.displayName}
        </Text>
      </View>
      <DrawerItemList {...props} />

      <View
        style={{
          position: "absolute",
          bottom: 30,
          width: "100%",
          alignSelf: "center",
          borderTopWidth: 1,
          borderTopColor: "grey",

          alignItems: "center",
        }}
      >
        <TouchableOpacity
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
          style={{
            marginTop: 20,
            backgroundColor: "#EA0039",
            alignItems: "center",
            paddingVertical: 10,

            width: "60%",
            borderRadius: 25,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 17 }}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

export const DrawerNavigator = () => {
  return (
    <ClientDrawer.Navigator
      screenOptions={{
        activeTintColor: "white",
        headerShown: false,
        drawerActiveTintColor: "#EA0039",
        drawerInactiveTintColor: "black",
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <ClientDrawer.Screen name="Home" component={HomeNavigator} />
      <ClientDrawer.Screen name="Your Orders" component={OrdersNavigator} />
    </ClientDrawer.Navigator>
  );
};

export const DeliveryDrawerNavigator = () => {
  const [orders, setOrders] = useState(0);
  const [canceled, setCanceled] = useState(0);
  {
    useEffect(() => {
      const ordersArray = [];

      const fetchOrders = async () => {
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
        return ordersArray;
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
          orderArray.push({ orderId: doc.id });
        });
        return orderArray;
      };
      fetchOrders().then((res) => {
        setOrders(res.length);
      });
      fetchCanceled().then((res) => {
        setCanceled(res.length);
      });
    }, []);
  }
  return (
    <DeliveryDrawer.Navigator
      screenOptions={{
        activeTintColor: "white",
        headerShown: false,
        drawerActiveTintColor: "#EA0039",
        drawerInactiveTintColor: "black",
      }}
      drawerContent={(props) => <DeliveryCustomDrawerContent {...props} />}
    >
      <DeliveryDrawer.Screen name="Home" component={DeliveryHomeNavigator} />
      <DeliveryDrawer.Screen
        name="Current Order"
        component={DeliveryOrdersStack}
      />

      <DeliveryDrawer.Screen
        name="Requested Orders"
        component={DeliveryOrders}
        options={{
          drawerLabelStyle: { marginLeft: -20 },
          drawerIcon: () => (
            <View style={{ position: "relative" }}>
              <Image
                source={require("../assets/notification.png")}
                style={{ height: 30, width: 30 }}
              />
              {orders === 0 ? null : (
                <View
                  style={{
                    backgroundColor: "red",
                    position: "absolute",
                    left: -3,
                    top: -5,
                    width: 20,
                    height: 20,
                    alignItems: "center",
                    borderRadius: 10,
                  }}
                >
                  <Text style={{ color: "white" }}>{orders}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <DeliveryDrawer.Screen
        name="Canceled Orders"
        component={CanceledOrders}
        options={{
          drawerLabelStyle: { marginLeft: -20 },
          drawerIcon: () => (
            <View style={{ position: "relative" }}>
              <Image
                source={require("../assets/notification.png")}
                style={{ height: 30, width: 30 }}
              />
              {canceled === 0 ? null : (
                <View
                  style={{
                    backgroundColor: "red",
                    position: "absolute",
                    left: -3,
                    top: -5,
                    width: 20,
                    height: 20,
                    alignItems: "center",
                    borderRadius: 10,
                  }}
                >
                  <Text style={{ color: "white" }}>{canceled}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />
    </DeliveryDrawer.Navigator>
  );
};

const DeliveryOrdersStack = () => {
  return (
    <DeliveryOrder.Navigator screenOptions={({}) => ({ headerShown: false })}>
      <DeliveryOrder.Screen name="Current Order" component={CurrentOrders} />
      <DeliveryOrder.Screen name="Tracking" component={TrackingDelivery} />
      <DeliveryOrder.Screen name="Map" component={TrackingMap} />
    </DeliveryOrder.Navigator>
  );
};

function AdminCustomDrawerContent(props) {
  const name = authentication.currentUser.displayName;

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <View
        style={{
          height: "20%",
          paddingLeft: 12,
          borderBottomWidth: 1,
          borderBottomColor: "grey",
          justifyContent: "center",
          marginBottom: 10,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <View style={{ marginBottom: 10 }}>
            <Image
              source={require("../assets/avatar.png")}
              style={{ height: 60, width: 60, borderRadius: 25 }}
            />
          </View>
        </View>
        <Text style={{ fontSize: 20, color: "black", fontWeight: "bold" }}>
          Admin
        </Text>
      </View>
      <DrawerItemList {...props} />

      <View
        style={{
          position: "absolute",
          bottom: 30,
          width: "100%",
          alignSelf: "center",
          borderTopWidth: 1,
          borderTopColor: "grey",

          alignItems: "center",
        }}
      >
        <TouchableOpacity
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
          style={{
            marginTop: 20,
            backgroundColor: "#EA0039",
            alignItems: "center",
            paddingVertical: 10,

            width: "60%",
            borderRadius: 25,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 17 }}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

export const AdminNavigator = () => {
  return (
    <AdminStack.Navigator screenOptions={({}) => ({ headerShown: false })}>
      <AdminStack.Screen name="AdminHome" component={AdminHome} />
      <AdminStack.Screen name="DeliveryFind" component={DeliveryFind} />
      <AdminStack.Screen name="Map" component={MapAdmin} />
    </AdminStack.Navigator>
  );
};

export const AdminDrawerNavigator = () => {
  const [requested, setRequested] = useState(0);
  const [orders, setOrders] = useState(0);
  useEffect(() => {
    const requestedDeliverys = async () => {
      const docRef = collection(db, "users", "jobs", "delivery");
      const q = query(
        docRef,
        where("Accepted", "==", false),
        where("Declined", "==", false)
      );
      const snapshot = await getDocs(q);
      let deliverys = [];

      snapshot.forEach((doc) => {
        deliverys.push({ docId: doc.id, ...doc.data() });
      });

      return deliverys;
    };
    requestedDeliverys().then((res) => {
      setRequested(res.length);
    });
  }, []);
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
      setOrders(res.length);
    });
  }, []);
  return (
    <AdminDrawer.Navigator
      screenOptions={{
        activeTintColor: "white",
        headerShown: false,
        drawerActiveTintColor: "#EA0039",
        drawerInactiveTintColor: "black",
      }}
      drawerContent={(props) => <AdminCustomDrawerContent {...props} />}
    >
      <AdminDrawer.Screen name="Home" component={AdminNavigator} />
      <AdminDrawer.Screen name="Refused Orders" component={RefusedOrders} />
      <AdminDrawer.Screen name="ChosenOrders" component={ChosenOrders} />
      <AdminDrawer.Screen name="Stats" component={Stats} />
      <AdminDrawer.Screen
        name="RequestedDelivery"
        component={RequestedDelivery}
        options={{
          drawerLabelStyle: { marginLeft: -20 },
          drawerIcon: () => (
            <View style={{ position: "relative" }}>
              <Image
                source={require("../assets/notification.png")}
                style={{ height: 30, width: 30 }}
              />
              {requested === 0 ? null : (
                <View
                  style={{
                    backgroundColor: "red",
                    position: "absolute",
                    left: -3,
                    top: -5,
                    width: 20,
                    height: 20,
                    alignItems: "center",
                    borderRadius: 10,
                  }}
                >
                  <Text style={{ color: "white" }}>{requested}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <AdminDrawer.Screen
        name="BreakDown Orders"
        component={BreakdownOrders}
        options={{
          drawerLabelStyle: { marginLeft: -20 },
          drawerIcon: () => (
            <View style={{ position: "relative" }}>
              <Image
                source={require("../assets/notification.png")}
                style={{ height: 30, width: 30 }}
              />
              {orders === 0 ? null : (
                <View
                  style={{
                    backgroundColor: "red",
                    position: "absolute",
                    left: -3,
                    top: -5,
                    width: 20,
                    height: 20,
                    alignItems: "center",
                    borderRadius: 10,
                  }}
                >
                  <Text style={{ color: "white" }}>{orders}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />
    </AdminDrawer.Navigator>
  );
};
