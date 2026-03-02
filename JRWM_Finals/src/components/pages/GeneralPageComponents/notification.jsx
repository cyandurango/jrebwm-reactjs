import React, { useEffect, useState, useRef } from 'react';
import { collection, addDoc, onSnapshot, updateDoc, doc, query, where, getDocs } from "firebase/firestore";
import { database } from "/src/config/firebase";
import { IoMdNotificationsOutline } from "react-icons/io";
import { MdCancel } from "react-icons/md";
import "./notification.css"

function Notification() {
    const notificationCollectionRef = collection(database, "notifications");
    const productCollectionRef = collection(database, "singleProduct");
    const [newNotificationList, setNotificationList] = useState([]);
    const currentDateRef = useRef(new Date());
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        const unsubscribeProduct = listenForNewProducts();
        const unsubscribeNotification = listenForNotificationUpdates();

        return () => {
            unsubscribeProduct();
            unsubscribeNotification();
        };
    }, []);

    function listenForNewProducts() {
        try {
            const unsubscribe = onSnapshot(productCollectionRef, (snapshot) => {
                snapshot.docChanges().forEach(async (change) => {
                    const productId = change.doc.id;
                    const productData = change.doc.data();

                    if (change.type === "added") {
                        const existingNotificationQuery = query(notificationCollectionRef, where("productId", "==", productId));
                        const existingNotificationSnapshot = await getDocs(existingNotificationQuery);

                        if (existingNotificationSnapshot.empty) {
                            await addDoc(notificationCollectionRef, {
                                productId: productId,
                                productName: productData.productName,
                                uniqueIdentifier: productData.uniqueIdentifier,
                                serialNum: productData.serialNum,
                                expirationDate: productData.expirationDate,
                                showNotification: false,
                                hidden: false,
                                message: "" 
                            });
                        }
                    } else if (change.type === "removed") {
                        const existingNotificationQuery = query(notificationCollectionRef, where("productId", "==", productId));
                        const existingNotificationSnapshot = await getDocs(existingNotificationQuery);

                        existingNotificationSnapshot.forEach(async (notificationDoc) => {
                            await updateDoc(notificationDoc.ref, { hidden: true });
                        });
                    }
                });
            });

            return unsubscribe;
        } catch (err) {
            console.error(err);
        }
    }

    function listenForNotificationUpdates() {
        try {
            const unsubscribe = onSnapshot(notificationCollectionRef, (snapshot) => {
                const data = snapshot.docs
                    .map((doc) => ({
                        ...doc.data(),
                        id: doc.id
                    }))
                    .filter(notification => !notification.hidden);
                setNotificationList(data);
                const count = data.filter(notification => !notification.showNotification).length;
                setCounter(count);

                const allNotificationsShown = data.every(notification => notification.showNotification);
                if (allNotificationsShown) {
                    setCounter(0);
                }
            });

            return unsubscribe;
        } catch (err) {
            console.error(err);
        }
    };

    const handleNotificationClick = async () => {
        try {
            const allNotificationsShown = newNotificationList.every(notification => notification.showNotification);

            if (allNotificationsShown) {
                setCounter(0);
            } else {
                const count = newNotificationList.filter(notification => !notification.showNotification).length;
                setCounter(count);
            }

            await Promise.all(newNotificationList.map(async (notification) => {
                const notificationDocRef = doc(database, "notifications", notification.id);
                await updateDoc(notificationDocRef, {
                    showNotification: !notification.showNotification
                });
            }));
        } catch (err) {
            console.error("Error updating notifications:", err);
        }
    };

    function isWithinOneWeek(date) {
        const targetDate = new Date(date);
        const checkWeekAhead = new Date();
        checkWeekAhead.setDate(checkWeekAhead.getDate() + 7);

        return Math.abs(targetDate.getTime() - checkWeekAhead.getTime()) <= 7 * 24 * 60 * 60 * 1000;
    }

    function arraysAreEqual(arr1, arr2) {
        if (arr1.length !== arr2.length) {
            return false;
        }

        for (let i = 0; i < arr1.length; i++) {
            if (JSON.stringify(arr1[i]) !== JSON.stringify(arr2[i])) {
                return false;
            }
        }

        return true;
    }

    useEffect(() => {
        function updateNotificationMessages(notifications) {
            return notifications.map(notification => {
                if (notification.expirationDate && isWithinOneWeek(new Date(notification.expirationDate.seconds * 1000))) {
                    return {
                        ...notification,
                        message: (
                            <div className='notificationMessage'>
                                <p>The Product: {notification.productName} will expire in one week</p>
                                <p>Product Identifier: {notification.uniqueIdentifier}{notification.serialNum}</p>
                                <p>{new Date(notification.expirationDate.seconds * 1000).toLocaleDateString()}</p>
                            </div>
                        )
                    };
                } else if (notification.expirationDate && currentDateRef.current >= new Date(notification.expirationDate.seconds * 1000)) {
                    return {
                        ...notification,
                        message: (
                            <div className='notificationMessage'>
                                <p>The Product: {notification.productName} has expired.</p>
                                <p>Product Identifier: {notification.uniqueIdentifier}{notification.serialNum}</p>
                                <p>{new Date(notification.expirationDate.seconds * 1000).toLocaleDateString()}</p>
                            </div>
                        )
                    };
                } else {
                    return notification;
                }
            });
        }

        const updatedNotifications = updateNotificationMessages(newNotificationList);

        if (!arraysAreEqual(updatedNotifications, newNotificationList)) {
            setNotificationList(updatedNotifications);
        }
    }, [newNotificationList]);

    async function hideNotification(id) {
        try {
            const notificationDoc = doc(database, "notifications", id);
            await updateDoc(notificationDoc, { hidden: true });

            const updatedNotifications = newNotificationList.filter(notification => notification.id !== id);
            setNotificationList(updatedNotifications);

            const count = updatedNotifications.filter(notification => !notification.showNotification).length;
            setCounter(count);

            const allNotificationsShown = updatedNotifications.every(notification => notification.showNotification);
            if (allNotificationsShown) {
                setCounter(0);
            }
        } catch (error) {
            console.error("Error hiding notification:", error);
        }
    }

    return (
        <div className='notification-'>
            <div className="notification-icon" onClick={handleNotificationClick}>
                <IoMdNotificationsOutline className='icon' />
                {counter > 0 && <div className='counter'>{counter}</div>}
            </div>
        {newNotificationList.some(notification => notification.showNotification) && (
            <div className='notification-case open'>
                <ul>
                    {newNotificationList.map((notification) => (
                        notification.showNotification && (
                            <li key={notification.id}>
                                {notification.message}
                                <span className='deleteNotif' onClick={() => hideNotification(notification.id)}>
                                    <MdCancel />
                                </span>
                            </li>
                        )
                    ))}
                </ul>
            </div>
        )}
</div>
    )
}

export default Notification;