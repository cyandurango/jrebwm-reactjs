import React, { useEffect, useState } from 'react';
import { getDocs, collection } from "firebase/firestore";
import { database } from "../../../config/firebase";
import "./productQuantity.css";

function ProductQuantity(){
    const [productList, setProductList] = useState([]);
    const productCollectionRef = collection(database, "singleProduct");
    const [prodQuantities, setProdQuantities] = useState({});
    const [lowQuantity, setLowQuantity] = useState([]);
    const [highQuantity, setHighQuantity] = useState([]);
    const [showReport, setShowReport] = useState(false);
    const [reportType, setReportType] = useState('');

    async function getProductList() {
        try {
            const data = await getDocs(productCollectionRef);
            const filteredData = data.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id
            }));

            setProductList(filteredData);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getProductList();
    }, []);

    useEffect(() => {

        const countProduct = {};
        productList.forEach((product) => {
            const productName = product.productName;
            countProduct[productName] = (countProduct[productName] || 0) + 1;
        });
        setProdQuantities(countProduct);
    }, [productList]);

    useEffect(() => {
        const lowQuantity = [];
        Object.keys(prodQuantities).forEach((productName) => {
            if (prodQuantities[productName] < 10) {
                lowQuantity.push(productName);
            }
        });
        setLowQuantity(lowQuantity);
        
    }, [prodQuantities]);

    useEffect(() => {
        const highQuantity = [];
        Object.keys(prodQuantities).forEach((productName) => {
            if (prodQuantities[productName] > 20) {
                highQuantity.push(productName);
            }
        });
        setHighQuantity(highQuantity);
        
    }, [prodQuantities]);

    const handleClick = () => {
        alert(`Products with low quantity:\n${lowQuantity.join('\n')}`);
    };

    const handleButtonClick = (type) => {
        setShowReport(true);
        setReportType(type);
    };

    const handleCloseClick  = () => {
        setShowReport(false);
    }

    return (
        <div>
            <div className="SideContainer">
                <button className="LowQuanButton" onClick={() => handleButtonClick("low")}>
                    Product Category of Low Quantity
                </button>

                <button className="HighQuanButton" onClick={() => handleButtonClick("high")}>
                    Product Category of High Quantity
                </button>

                {showReport && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={handleCloseClick}>&times;</span>
                            <h2>{reportType === "low" ? "Low Quantity" : "High Quantity"} Products</h2>
                            <ul>
                                {(reportType === "low" ? lowQuantity : highQuantity).map(productName => (
                                    <li key={productName}>
                                        {productName} :&nbsp; &nbsp; {prodQuantities[productName]}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
            

            {/* {Object.keys(prodQuantities).map((productName) => (
                    <p key = {productName}>
                        {productName} - Quantity: {prodQuantities[productName]}
                    </p>
            ))} */}
        </div>
    )
}

export default ProductQuantity;
