//Import Statements Here
import React, { useState, useEffect } from 'react';
import { database } from "../../../config/firebase";
import { getDoc, doc } from 'firebase/firestore';
import './SeeProductsCellDesign.css';

//The function allows user to see the products listed under a certain order
function SeeProductsCell({id}) {

    const [productNameArray, setProdNameArray] = useState([]);
    const [productPriceArray, setProdPriceArray] = useState([]);
    const [productQuantityArray, setProdQtyArray] = useState([]);
    const [productExpiryDate, setProdExpDate] = useState([]);
    
    const [buttonPopUp, setButtonPopUp] = useState(false);
    const orderRef = doc(database, "orderedItems", id);
    
    useEffect(() => {
        async function getProducts() {
            try {
                const orderData = await getDoc(orderRef);
                const filteredData = orderData.data();
                setProdNameArray(filteredData.prodNames)
                setProdPriceArray(filteredData.prodPrices)
                setProdQtyArray(filteredData.prodQuantity)
                setProdExpDate(filteredData.prodExpiryDates)
            } catch (err) {
                console.error(err);
            }
        }
        getProducts();

    }, []);

    function ProductsOrderedTable(){
        const rows = [];
        for (let i = 0; i < productNameArray.length; i++) {
            rows.push(
                <tr key={i}>
                    <td>{productNameArray[i]}</td>
                    <td>{productPriceArray[i]}</td>
                    <td>{productQuantityArray[i]}</td>
                    <td>{productExpiryDate[i].toDate().toLocaleDateString()}</td>
                </tr>
            );
        }
        return (
            <table>
                <thead >
                    <tr>
                        <th> Product Name </th>
                        <th> Price </th>
                        <th> Quantity </th>
                        <th> Expiry Date </th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
        );
    }

    return (
        <div className="seeproducts-popup">
            <button className="seeproducts-popupbtn" onClick={()=>setButtonPopUp(true)}> See Products Ordered </button>
            {buttonPopUp && (
                <div className="seeproducts-popup-content">
                    <div className="seeproducts-popup-content-inner"><div className="HeaderConnector"> </div>
                        
                        <ProductsOrderedTable/><br/>
                        <button className = "seeproducts-exitbtn" onClick={()=>setButtonPopUp(false)}> Close </button> 
                    </div>
                </div>
            )}
        </div>
    );
}

export default SeeProductsCell;
