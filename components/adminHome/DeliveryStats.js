import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig/firebaseConfig";
import { async } from "@firebase/util";

const DeliveryStats = ({ delivery }) => {
  const [accepted, setAccepted] = useState();
  const [delivered, setDelivered] = useState();
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const funcOne = async () => {
      let refTwo = collection(
        db,
        "users",
        "jobs",
        "delivery",
        delivery.id,
        "acceptedOrders"
      );

      let snapshotTwo = await getDocs(refTwo);
      let accepted = 0;
      snapshotTwo.forEach((doc) => {
        accepted++;
      });

      return accepted;
    };

    const funcTwo = async (res) => {
      let refThree = collection(db, "validatedOrders");
      let q = query(
        refThree,
        where("deliveryId", "==", delivery.id),
        where("status", "==", "Delivered")
      );
      let snapshotThree = await getDocs(q);
      let delivered = 0;

      snapshotThree?.forEach((doc) => {
        delivered++;
      });

      return { delivered: delivered, accepted: res };
    };

    funcOne().then((res) => {
      funcTwo(res).then((res) => {
        setAccepted(res.accepted);
        setDelivered(res.delivered);
      });
    });
  }, []);
  return (
    <TouchableOpacity
      style={{
        backgroundColor: "white",
        marginVertical: 3,
        marginBottom: 40,
        marginHorizontal: 20,
        paddingHorizontal: 30,
        paddingVertical: 10,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.5,
        shadowRadius: 1.41,
        elevation: 10,
      }}
      onPress={() => {
        setPressed(!pressed);
      }}
    >
      <View style={{ flexGrow: 1 }}>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flexGrow: 1, flexDirection: "row" }}>
            <View style={{ marginRight: 15 }}>
              <Image
                source={require("../../assets/avatar.png")}
                style={{ width: 50, height: 50, borderRadius: 25 }}
              />
            </View>
            <View style={{ justifyContent: "center" }}>
              <Text
                style={{ color: "black", fontSize: 17, fontWeight: "bold" }}
              >
                {delivery?.displayName}
              </Text>
              <Text style={{ color: "grey", fontSize: 15 }}>
                {delivery?.TypeOfVehicle}
              </Text>
            </View>
          </View>
          <View style={{ justifyContent: "center" }}>
            <Image
              source={
                pressed
                  ? require("../../assets/arrowUp.png")
                  : require("../../assets/arrowDown.png")
              }
              style={{ height: 30, width: 30 }}
            />
          </View>
        </View>
      </View>
      {pressed && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            marginTop: 8,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ color: "black", fontWeight: "bold", fontSize: 17 }}>
              Accepted :
            </Text>
            <Text style={{ color: "grey", fontSize: 15 }}> {accepted}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ color: "black", fontWeight: "bold", fontSize: 17 }}>
              Delivered :
            </Text>
            <Text style={{ color: "grey", fontSize: 15 }}> {delivered}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ color: "black", fontWeight: "bold", fontSize: 17 }}>
              Refused :
            </Text>
            <Text style={{ color: "grey", fontSize: 15 }}>
              {delivery?.refusedOrders ? delivery?.refusedOrders.length : 0}
            </Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};
{
  /* <Text>{accepted}</Text>
      <Text>{delivered}</Text>
      <Text>
        {delivery?.refusedOrders ? delivery?.refusedOrders.length : 0}
      </Text>
      <Text>{delivery?.TypeOfVehicle}</Text>
  <Text>{delivery?.displayName}</Text>*/
}
export default DeliveryStats;
