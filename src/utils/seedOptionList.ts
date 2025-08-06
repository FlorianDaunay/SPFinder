import { collection, setDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";

const optionList = {
    longCall: { id: "longCall", name: "Long Call" },
    shortCall: { id: "shortCall", name: "Short Call" },
    longPut: { id: "longPut", name: "Long Put" },
    shortPut: { id: "shortPut", name: "Short Put" },
    longCallDownIn: { id: "longCallDownIn", name: "Long Call Down In" },
    shortCallDownIn: { id: "shortCallDownIn", name: "Short Call Down In" },
    longCallDownOut: { id: "longCallDownOut", name: "Long Call Down Out" },
    shortCallDownOut: { id: "shortCallDownOut", name: "Short Call Down Out" },
    longCallUpIn: { id: "longCallUpIn", name: "Long Call Up In" },
    shortCallUpIn: { id: "shortCallUpIn", name: "Short Call Up In" },
    longCallUpOut: { id: "longCallUpOut", name: "Long Call Up Out" },
    shortCallUpOut: { id: "shortCallUpOut", name: "Short Call Up Out" },
    longPutDownIn: { id: "longPutDownIn", name: "Long Put Down In" },
    shortPutDownIn: { id: "shortPutDownIn", name: "Short Put Down In" },
    longPutDownOut: { id: "longPutDownOut", name: "Long Put Down Out" },
    shortPutDownOut: { id: "shortPutDownOut", name: "Short Put Down Out" },
    longPutUpIn: { id: "longPutUpIn", name: "Long Put Up In" },
    shortPutUpIn: { id: "shortPutUpIn", name: "Short Put Up In" },
    longPutUpOut: { id: "longPutUpOut", name: "Long Put Up Out" },
    shortPutUpOut: { id: "shortPutUpOut", name: "Short Put Up Out" },
    longCallDigit: { id: "longCallDigit", name: "Long Call Digit" },
    shortCallDigit: { id: "shortCallDigit", name: "Short Call Digit" },
    longPutDigit: { id: "longPutDigit", name: "Long Put Digit" },
    shortPutDigit: { id: "shortPutDigit", name: "Short Put Digit" },
};

export const seedOptionList = async () => {
    try {
        const optionListRef = collection(db, "optionList");
        for (const [key, value] of Object.entries(optionList)) {
            await setDoc(doc(optionListRef, key), value);
        }
        console.log("✅ Option list seeded to Firestore.");
    } catch (error) {
        console.error("❌ Error seeding option list:", error);
    }
};
