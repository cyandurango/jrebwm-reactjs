//CSS IMPORTS
import './orderStatusDesign.css';

//FUNCTION IMPORTS
import React, { useState, useEffect } from 'react';
import { database } from "../../../config/firebase";
import { updateDoc, doc, addDoc, collection, getDoc } from 'firebase/firestore';

//The function initializes an individual status cell that allows the user to change the status of a single product
function OrderStatusCell({getValue, id}) {
    const orderNum = id;
    const initialValue = getValue();
    const [orderStatus, setOrderStatus] = useState(initialValue);
    const [buttonLabel, setButtonLabel] = useState('');
    const [productNameArray, setProdNameArray] = useState([]);
    const [productPriceArray, setProdPriceArray] = useState([]);
    const [productQuantityArray, setProdQtyArray] = useState([]);
    const [productExpiryDate, setProdExpDate] = useState([]);
    const [supplierName, setSupplierName] = useState("");

    const orderRef = doc(database, "orderedItems", orderNum);
    const productCollectionRef = collection(database, "singleProduct");

    useEffect(() => {
        async function getProducts() {
            if (!orderNum) return; // Prevent running if orderNum is not set
            try {
                const orderData = await getDoc(orderRef);
                if (orderData.exists()) {
                    const filteredData = orderData.data();
                    setProdNameArray(filteredData.prodNames);
                    setProdPriceArray(filteredData.prodPrices);
                    setProdQtyArray(filteredData.prodQuantity);
                    setProdExpDate(filteredData.prodExpiryDates);
                    setSupplierName(filteredData.supplierName);
                } else {
                    console.log("No such document!");
                }
            } catch (err) {
                console.error("Error fetching order data:", err);
            }
        }
        getProducts();
    }, [orderNum]);

    //Codes for the three statuses in the database
    const STATUS_CODES = [
        "STATUS_REQUESTED",
        "STATUS_ARRIVED",
    ];

    //status labels
    const STATUS_LABELS = [
        "Order Requested",
        "Order Arrived",
    ];

    //changes the button label to the status
    useEffect(() => {
        const index = STATUS_CODES.indexOf(orderStatus);
        if (index !== -1) {
            setButtonLabel(STATUS_LABELS[index]);
        }
    }, [orderStatus]);

    async function statusChange(newStatus) {
        console.log('Status changing to:', newStatus);
        setOrderStatus(newStatus);
        try {
            await updateDoc(orderRef, { status: newStatus });
            console.log('Status updated successfully in Firestore');

            if (newStatus === "STATUS_ARRIVED") {
                console.log('Adding products to DB...');
                for (let i = 0; i < productNameArray.length; i++) {
                    const uniqueIdentifier = getUniqueIdentifier(productNameArray[i]);
                    for (let j = 1; j <= productQuantityArray[i]; j++) {
                        await addDoc(productCollectionRef, {
                            productName: productNameArray[i],
                            uniqueIdentifier: uniqueIdentifier,
                            price: productPriceArray[i],
                            expirationDate: productExpiryDate[i],
                            supplierName: supplierName,
                            status: "STATUS_IN_STOCK",
                            serialNum: j
                        });
                        console.log(`Added product ${productNameArray[i]} - ${j}`);
                    }
                }
                console.log('Products added to DB successfully.');
            } else {
                console.log('Status not "STATUS_ARRIVED", not adding products to DB');
            }
        } catch (error) {
            console.error('Error updating status in Firestore:', error);
        }
    }

    function getUniqueIdentifier(productName) {
        let consonants = '';
        for (let char of productName.toUpperCase()) {
            if (/[BCDFGHJKLMNPQRSTVWXYZ]/.test(char)) {
                consonants += char;
            }
        }
        return consonants;
    }
    
    return (
        <div className={`orderStatus-dropdown ${orderStatus === "STATUS_ARRIVED" ? "disabled" : ""}`}>
            <button className="orderStatus-dropbtn" disabled={orderStatus === "STATUS_ARRIVED"} >{buttonLabel}</button>
            <div className="orderStatus-dropdown-content">
                <a onClick={() => statusChange(STATUS_CODES[0])}>Requested</a>
                <a onClick={() => statusChange(STATUS_CODES[1]) }>Arrived</a>
            </div>
            
        </div>
    );
}

export default OrderStatusCell;
