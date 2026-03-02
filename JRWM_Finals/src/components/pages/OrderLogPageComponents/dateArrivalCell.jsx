import React, { useState, useEffect } from 'react';
import { database } from "../../../config/firebase";
import { updateDoc, doc, getDoc, Timestamp } from 'firebase/firestore';


function DateArrivalCell({getValue, id, status, requestDate}) {
    const [dateArrived, setDateArrived] = useState("");
    const orderRef = doc(database, 'orderedItems', id);

    useEffect(() => {
        async function checkDates() {
            try {
                if (status === "STATUS_REQUESTED" && requestDate === getValue()) {
                    setDateArrived("-");
                } else if (status === "STATUS_ARRIVED") {
                    const orderDoc = await getDoc(orderRef);
                    const data = orderDoc.data();
                    if (data && data.date_arrived) {
                        setDateArrived(data.date_arrived.toDate().toLocaleDateString());
                    } else {
                        // If no date_arrived is found in the document, set it to today's date
                        const today = new Date();
                        const formattedToday = today.toLocaleDateString();
                        setDateArrived(formattedToday);

                        // Optionally, update the Firestore document with today's date
                        await updateDoc(orderRef, { date_arrived: Timestamp.fromDate(today) });
                    }
                }
            } catch (error) {
                console.error('Error fetching document:', error);
                setDateArrived("Error fetching date");
            }
        }
        checkDates();
    }, [status, requestDate, getValue, orderRef]);

    return (
        <div>
            {dateArrived}
        </div>
    );
}

export default DateArrivalCell;
