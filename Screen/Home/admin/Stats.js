import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Button,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig/firebaseConfig";
import DeliveryStats from "../../../components/adminHome/DeliveryStats";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {
  VictoryBar,
  VictoryChart,
  VictoryGroup,
  VictoryLegend,
} from "victory-native";

const Stats = ({ navigation }) => {
  const [stats, setStats] = useState();
  const [deliveryInfos, setDeliveryInfos] = useState([]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState(new Date());

  const fetchStats = async (date) => {
    let notAcceptedYet = [];
    let waiting = [];
    let onGoing = [];
    let finished = [];
    let refused = [];
    {
      /*NOT ACCEPTED YET */
    }
    var start = new Date(date);
    start.setHours(0, 0, 0, 0);

    var end = new Date(start.getTime());
    end.setHours(23, 59, 59, 999);

    const ref = collection(db, "notValidatedOrders");
    const q = query(
      ref,
      where("status", "==", "Not accepted yet"),
      where("date", ">=", start),
      where("date", "<=", end)
    );
    const snapshot = await getDocs(q);
    snapshot.forEach((doc) => {
      notAcceptedYet.push(doc.id);
    });

    {
      /*WAITING*/
    }
    const waitingRef = collection(db, "notValidatedOrders");
    const waitingQ = query(
      waitingRef,
      where("status", "==", "Waiting"),
      where("date", ">=", start),
      where("date", "<=", end)
    );
    const waitingSnapshot = await getDocs(waitingQ);
    waitingSnapshot.forEach((doc) => {
      if (doc.exists()) {
        waiting.push(doc.id);
      }
    });

    {
      /*ON GOING*/
    }
    const onGoingRef = collection(db, "validatedOrders");
    const onGoingQ = query(
      onGoingRef,
      where("status", "==", "Accepted"),
      where("date", ">=", start),
      where("date", "<=", end)
    );
    const onGoingSnapshot = await getDocs(onGoingQ);
    onGoingSnapshot.forEach((doc) => {
      if (doc.exists()) {
        onGoing.push(doc.id);
      }
    });

    {
      /* Finished*/
    }
    const finishedRef = collection(db, "validatedOrders");
    const finishedQ = query(
      finishedRef,
      where("status", "==", "Delivered"),
      where("date", ">=", start),
      where("date", "<=", end)
    );

    const finishedSnapshot = await getDocs(finishedQ);
    finishedSnapshot.forEach((doc) => {
      finished.push(doc.id);
    });

    {
      /*REFUSED */
    }
    const refusedRef = collection(db, "notValidatedOrders");
    const refusedQ = query(
      refusedRef,
      where("status", "==", "Refused"),
      where("date", ">=", start),
      where("date", "<=", end)
    );
    const refusedSnapshot = await getDocs(refusedQ);
    refusedSnapshot.forEach((doc) => {
      refused.push(doc.id);
    });

    return {
      notAcceptedYet: notAcceptedYet.length,
      waiting: waiting.length,
      onGoing: onGoing.length,
      finished: finished.length,
      refused: refused.length,
    };
  };

  useEffect(() => {
    fetchStats(date).then((res) => {
      setStats(res);
    });
  }, []);

  useEffect(() => {
    const fetchDeliveryMen = async () => {
      let DeliveryMenIds = [];
      let ref = collection(db, "users", "jobs", "delivery");
      let q = query(ref, where("Accepted", "==", true));
      let snapshot = await getDocs(q);

      snapshot.forEach((doc) => {
        DeliveryMenIds.push({ id: doc.id, ...doc.data() });
      });

      return DeliveryMenIds;
    };

    fetchDeliveryMen().then((res) => {
      setDeliveryInfos(res);
    });
  }, []);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setDate(date);
    fetchStats(date)
      .then((res) => {
        setStats(res);
      })
      .then(() => {
        hideDatePicker();
      });
  };

  const data = {
    planned: [null, null],
    actual: [
      { x: "OnProcessing", y: 4 },
      { x: "Waiting", y: 5 },
      { x: "Finished", y: 2 },
      { x: "Refused", y: 1 },
      { x: "NotAcceptedYet", y: 9 },
    ],
  };

  return (
    <ScrollView
      style={{ marginTop: "5%", flex: 1, backgroundColor: "#F6F6F6" }}
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
          <Text style={styles.TitleText}>App Statistics</Text>
        </View>
      </View>
      <TouchableOpacity
        style={{
          position: "relative",
          top: 20,
          marginLeft: "5%",
          alignSelf: "flex-start",
        }}
        onPress={showDatePicker}
      >
        <Text
          style={{
            color: "grey",
            fontSize: 18,
            fontWeight: "bold",
            borderBottomColor: "grey",
            borderBottomWidth: 0.8,
          }}
        >
          Set Date
        </Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={(date) => {
          handleConfirm(date);
        }}
        onCancel={hideDatePicker}
      />

      {stats && (
        <View style={{ maxWidth: "70%" }}>
          <VictoryChart>
            <VictoryBar
              animate
              barWidth={20}
              data={data.actual}
              style={{
                data: { fill: "#EA0039" },
                strokeWidth: 0,
              }}
              alignment="start"
            />
          </VictoryChart>
        </View>
      )}

      {/* <View
        style={{
          paddingTop: "10%",
          height: "40%",
          borderBottomColor: "black",
          borderBottomWidth: 2,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            marginBottom: 5,
          }}
        >
          <View>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              Not Accepted Yet Orders
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "#EA0039",
              paddingHorizontal: 3,
              paddingVertical: 1,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
              {stats?.notAcceptedYet >= 100 ? "99+" : stats?.notAcceptedYet}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            marginBottom: 5,
          }}
        >
          <View>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              Waiting Orders
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "#EA0039",
              paddingHorizontal: 3,
              paddingVertical: 1,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
              {stats?.waiting >= 100 ? "99+" : stats?.waiting}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            marginBottom: 5,
          }}
        >
          <View>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              On Processing Orders
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "#EA0039",
              paddingHorizontal: 3,
              paddingVertical: 1,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
              {stats?.onGoing >= 100 ? "99+" : stats?.onGoing}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            marginBottom: 5,
          }}
        >
          <View>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              Finished Orders
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "#EA0039",
              paddingHorizontal: 3,
              paddingVertical: 1,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
              {stats?.finished >= 100 ? "99+" : stats?.finished}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            marginBottom: 5,
          }}
        >
          <View>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              Refused Orders
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "#EA0039",
              paddingHorizontal: 3,
              paddingVertical: 1,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
              {stats?.refused >= 100 ? "99+" : stats?.refused}
            </Text>
          </View>
        </View>
      </View> */}
      <View style={{ paddingHorizontal: 20, marginBottom: 10 }}>
        <Text style={{ color: "#EA0039", fontSize: 21, fontWeight: "bold" }}>
          Delivery men Statistics :
        </Text>
      </View>
      <View>
        {deliveryInfos?.map((delivery, index) => (
          <DeliveryStats delivery={delivery} />
        ))}
      </View>
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
    marginLeft: "5%",
    marginRight: "30%",
    marginBottom: "2%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
});

export default Stats;
