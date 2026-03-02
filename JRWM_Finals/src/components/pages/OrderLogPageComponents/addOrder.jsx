//CSS IMPORTS
import "./AddOrderDesign.css"

//IMPORT STATEMENTS HERE
import React, { useState, useEffect } from 'react';
import { database } from "../../../config/firebase";
import { addDoc, getDocs, collection, Timestamp } from "firebase/firestore";

 
function AddOrder(){
    const [newSupplierName, setSupplierName] = useState("");
    const [newDateRequested, setDateRequested] = useState(new Date());
    const [newProductNameArray, setProdNameArray] = useState([]);
    const [newProductPriceArray, setProdPriceArray] = useState([]);
    const [newProductQuantityArray, setProdQtyArray] = useState([]);
    const [newProductExpiryDateArray, setProdExpDateArray] = useState([]);

    const [count, setCount] = useState(1);
    const [buttonPopUp, setButtonPopUp] = useState(false);

    const orderCollectionRef = collection(database, "orderedItems");

    async function onSubmitOrder(){
        try {
            const dateRequestTimestamp = Timestamp.fromDate(newDateRequested);
            const expDatesTimestamp = newProductExpiryDateArray.map(date => Timestamp.fromDate(date)); // Convert expiry dates to Timestamp
            await addDoc(orderCollectionRef, {
                date_request: dateRequestTimestamp,
                // date_arrived: dateRequestTimestamp,
                supplierName: newSupplierName,
                prodNames: newProductNameArray,
                prodPrices: newProductPriceArray,
                prodQuantity: newProductQuantityArray,
                prodExpiryDates: expDatesTimestamp,
                status: "STATUS_REQUESTED",
            })
            setButtonPopUp(false);
            setCount(1); 
            setDateRequested(new Date()); 
            setSupplierName("");
            setProdNameArray([]); 
            setProdPriceArray([]); 
            setProdQtyArray([]);
            setProdExpDateArray([]);
        } catch (err){
            console.log(err);
        }
    };

    async function exitAddOrder(){
        setButtonPopUp(false);
        setCount(1); 
        setDateRequested(new Date()); 
        setSupplierName("");
        setProdNameArray([]); 
        setProdPriceArray([]); 
        setProdQtyArray([]);
        setProdExpDateArray([]);
    };
    const [focusedRow, setFocusedRow] = useState(0)
    const [focusedCell, setFocusedCell] = useState(0)
    
    const handleInputClick = (rowIndex, cellIndex) => {
        setFocusedRow(rowIndex);
        setFocusedCell(cellIndex);
        console.log(rowIndex,cellIndex)
    };

    function AddProductsTable(){        
        
        function handleProductNameChange(e, index) {
            const updatedNames = [...newProductNameArray];
            updatedNames[index] = e.target.value;
            setProdNameArray(updatedNames);
        }
    
        function handleProductPriceChange(e, index) {
            const updatedPrices = [...newProductPriceArray];
            updatedPrices[index] = Number(e.target.value);
            setProdPriceArray(updatedPrices);
        }
    
        function handleProductQuantityChange(e, index) {
            const updatedQuantities = [...newProductQuantityArray];
            updatedQuantities[index] = Number(e.target.value);
            setProdQtyArray(updatedQuantities);
        }
        
        function handleProductExpiryDateChange(e, index) {
            const updatedExpiryDates = [...newProductExpiryDateArray];
            updatedExpiryDates[index] = new Date(e.target.value)
            setProdExpDateArray(updatedExpiryDates);
        }

        const handleAddRow = () => {
            setCount(count + 1);
        };

        const rows = []
        for (let i = 0; i < count; i++) {
            rows.push(
                <tr key = {i}>
                    <td> {i+1} </td>
                    <td id = '1'>
                        <input
                            placeholder=""
                            value={newProductNameArray[i]}
                            onChange={(e) => handleProductNameChange(e, i)}
                            onClick={() => handleInputClick(i, 0)}
                            autoFocus = {focusedRow === i && focusedCell === 0}
                            required
                        />
                    </td>
                    <td id = '2'>
                        <input
                            placeholder=""
                            value={newProductPriceArray[i]}
                            onChange={(e) => handleProductPriceChange(e, i)}
                            onClick={() => handleInputClick(i,1)}
                            autoFocus = {focusedRow === i && focusedCell === 1}
                            required
                            
                        />
                    </td>
                    <td id = '3'>
                        <input
                            placeholder=''
                            value={newProductQuantityArray[i]}
                            onChange={(e) => handleProductQuantityChange(e, i)}
                            autoFocus = {focusedRow === i && focusedCell === 2}
                            onClick={() => handleInputClick(i,2)}
                            required
                        />
                    </td>
                    <td id = '4'>
                    <input className="AddOrderExpiry" type='date'
                            placeholder=''
                            value={newProductExpiryDateArray[i] ? newProductExpiryDateArray[i].toISOString().substr(0, 10) : ''}
                            onChange={(e) => handleProductExpiryDateChange(e, i)}
                            autoFocus={focusedRow === i && focusedCell === 3}
                            onClick={() => handleInputClick(i, 3)}
                            required
                        />
                    </td>
                    <td className="RemoveRow"><button onClick = {() => setCount(count - 1)}>
                        x
                    </button> </td>
            </tr>
            );
        }
    
        return(
            <table>
                <thead>
                    <tr>
                        <th> # </th>
                        <th> Product Name </th>
                        <th> Price </th>
                        <th> Quantity </th>
                        <th> Expiry Date </th>
                        <th className="AddRow"><div>
                            <button onClick = {handleAddRow}> + </button>
                        </div></th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
        )
    }
   
    return (
        <div className="addordersection">
            <button className="addorder-popupbtn" onClick={()=>setButtonPopUp(true)}> ADD ORDER </button>
            {buttonPopUp && (
                <div className="addorder-popup-content">
                    <div className="addorder-popup-content-inner">
                        <div>
                            <div className="DateRequestedContainer">
                                <p>Date Requested</p>
                            <input type = 'date'
                                placeholder = 'Date Requested'
                                onChange = { (e) => setDateRequested(new Date(e.target.value)) }
                                onClick = {() => handleInputClick(count + 1, 0)}
                                autoFocus = {focusedRow === (count+1) && focusedCell === 0}
                                required
                            /></div>
                             <br/>
                             <div className="DateRequestedContainer">
                                <p className="SupplierName">Supplier Name</p>
                            <input
                                className="SupplierInput"
                                placeholder = '' 
                                onChange = { (e) => setSupplierName(e.target.value) } 
                                onClick = {() => handleInputClick(count + 1, 1)}
                                autoFocus = {focusedRow === (count+1) && focusedCell === 1}
                                required
                            /></div>
                        </div>
                        <div>
                            <AddProductsTable/>
                        </div>
                        <div className="AddOrderExitButtons">
                         <button className = "addorder-exitbtn" onClick={onSubmitOrder}> Submit </button> 
                        <button className = "addorder-exitbtn" onClick={exitAddOrder}> Exit </button>   
                        </div>
                        
                    </div>
                </div>
            )}
        </div>
    )
}

export default AddOrder;
