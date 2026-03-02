import React, { useState, useEffect } from 'react';
import { database } from '../../../config/firebase';
import './statusCellDesign.css';
import { updateDoc, doc, deleteDoc } from 'firebase/firestore';

//The function initializes an individual status cell that allows the user to change the status of a single product
function StatusCell({ getValue, id }) {
    const initialValue = getValue()
    const [productStatus, setProductStatus] = useState(initialValue);
    const [buttonLabel, setButtonLabel] = useState('');
    // const [dropdownVisible, setDropdownVisible] = useState(false);
      
    //Codes for the three statuses in the database
    const STATUS_CODES = [
        "STATUS_ON_DISPLAY",
        "STATUS_IN_STOCK",
        "STATUS_SOLD"
    ];

    //status labels
    const STATUS_LABELS = [
        "On Display",
        "In Stock",
        "Sold"
    ];

    //changes the button label to the status
    useEffect(() => {
        const index = STATUS_CODES.indexOf(productStatus);
        if (index !== -1) {
            setButtonLabel(STATUS_LABELS[index]); 
        }
    }, [productStatus]);

    //assigns the new status
    const statusChange = async (newStatus) => {
        setProductStatus(newStatus);
        try {
            const productRef = doc(database, 'singleProduct', id);
            await updateDoc(productRef, { status: newStatus });
            console.log('Status updated successfully in Firestore');

            if(newStatus === "STATUS_SOLD"){
                await deleteDoc(productRef);
            }

        } catch (error) {
            console.error('Error updating status in Firestore:', error);
        }
    }

    return (
        <div className="dropdown">
            <button className="dropbtn">{buttonLabel}</button>
                <div className="dropdown-content">
                    <a onClick={() => statusChange(STATUS_CODES[0])}>On Display</a>
                    <a onClick={() => statusChange(STATUS_CODES[1])}>In Stock</a>
                    <a onClick={() => statusChange(STATUS_CODES[2])}>Sold</a>
                </div>
        </div>
    );
}

export default StatusCell;
