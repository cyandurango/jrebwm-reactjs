//CSS IMPORTS
import './ProdDBAddProduct.css'

//FUNCTION IMPORTS
import React, { useState, useEffect, useMemo } from "react";
import { collection, addDoc, onSnapshot, query, orderBy, Timestamp } from "firebase/firestore";
import { database } from "/src/config/firebase";

function ProdDBAddProduct(){
    const productCollectionRef = collection(database, "singleProduct");
    const[newProductName, setProductName] = useState("");
    const[newSupplierName, setSupplierName] = useState("");
    const[newSerialNum, setSerialNum] = useState(0);
    const[newProductPrice, setProductPrice] = useState(0);
    const[newExpirationDate, setExpirationDate] = useState(new Date());

    const [buttonPopUp, setButtonPopUp] = useState(false);

    function getUniqueIdentifier(productName){
        let consonants = '';
        for (let char of productName.toUpperCase()) {
            if (/[BCDFGHJKLMNPQRSTVWXYZ]/.test(char)) {
                consonants += char;
            }
        }
        return consonants;
    }

    async function onSubmitProduct() {
        try{
            const expirationTimestamp = Timestamp.fromDate(newExpirationDate);
            await addDoc(productCollectionRef, {
                productName: newProductName, 
                supplierName: newSupplierName, 
                price: newProductPrice, 
                expirationDate: expirationTimestamp,
                serialNum: newSerialNum,
                status: "STATUS_IN_STOCK",
                uniqueIdentifier: getUniqueIdentifier(newProductName)
            });
            setButtonPopUp(false)
        } catch (err) {
            console.error(err); 
        }
    }

    return (
        <div className="addproductsection">
            <button className="addproduct-popupbtn" onClick={() => setButtonPopUp(true)}>Add Product</button>
            {buttonPopUp && (
                <div className="addproduct-popup-content">
                    <div className="addproduct-popup-content-inner">
                        <span className="addproduct-text">ADD PRODUCT</span>
                        <input className="ProdName"
                            placeholder = 'Product Name' 
                            onChange = { (e) => setProductName(e.target.value) } 
                        /> <br />

                        <input className="SupName"
                            placeholder = 'Supplier Name'  
                            onChange = { (e) => setSupplierName(e.target.value) } 
                        /> <br />

                        <input className="Price"
                            placeholder = 'Price' 
                            onChange = { (e) => setProductPrice(Number(e.target.value)) } 
                        /> <br />

                        <input className="SerNum"
                            placeholder = 'Serial Number' 
                            onChange = { (e) => setSerialNum(Number(e.target.value))  } 
                        /> <br />
        
                        <span className="ExpiryDateText">Expiration Date</span>

                        <input type = 'date'
                            placeholder = 'Expiration Date'  
                            onChange = { (e) => setExpirationDate(new Date(e.target.value)) } 
                        /> <br />

                        <button 
                            className='addproduct-submitbtn'
                            onClick={onSubmitProduct} 
                        > Submit </button>
                        <button 
                            className="addproduct-exitbtn"
                            onClick={() => setButtonPopUp(false)}
                        > Close </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProdDBAddProduct;