import React, { useState, useEffect } from 'react';
import { database } from "../../../config/firebase";
import { onSnapshot, collection, query, orderBy, where, doc, getDoc } from "firebase/firestore";
import {
    useReactTable,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
} from "@tanstack/react-table"
import ProductQuantity from "./productQuantity";
import "./IARTable.css";

function ReportTable (){
    
    const [productList, setProductList] = useState([]);
    const productCollectionRef = collection(database, "singleProduct");
    const [prodQuantities, setProdQuantities] = useState({});
    const totalCapacity = 1000;
    
    useEffect(() => {
        const q = query(productCollectionRef, orderBy("expirationDate","asc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const updatedProductList = snapshot.docs.map((doc) => {
                const productData = doc.data();
                const serialNumStr = productData.serialNum.toString().padStart(10, "0");
                const prodNum = `${productData.uniqueIdentifier}-${serialNumStr}`;
                return {
                    ...productData,
                    expirationDate: productData.expirationDate
                        ? new Date(productData.expirationDate.toDate()).toLocaleDateString()
                        : "",
                    prodNum,
                    id: doc.id,
                };
            });
            setProductList(updatedProductList);
        });
        return () => unsubscribe();
    }, []);

    const groupedExpirationDate = {};
    productList.forEach((product) => {
        const expirationDate = new Date(product.expirationDate.seconds * 1000).toLocaleDateString();
        if (!groupedExpirationDate[expirationDate]) {
            groupedExpirationDate[expirationDate] = [];
        }
        groupedExpirationDate[expirationDate].push(product);
        // console.log(groupedExpirationDate[expirationDate]);
    });

    const columns = [
        {
            header: 'Product Number',
            accessorKey: 'prodNum',
        },
        {
            header: 'Product Name',
            accessorKey: 'productName',
        },
        {
            header: 'Expiration Date',
            accessorKey: 'expirationDate',
        },
    ];
    
    const reactTable = useReactTable({
        data: productList, 
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        autoResetPageIndex: false,
    });

    return  (
        <div>
            <div className="SideContainer">
                <ProductQuantity />
                <div className= 'total-capacity'>
                    Total Capacity: {productList.length} / {totalCapacity}
                </div>
            </div>
                <table className="ExpDateTable">
                    <thead className="ExpDateTableHeader">
                        {reactTable.getHeaderGroups().map(headerGroup => (<tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (<th key={header.id}>
                                {flexRender(header.column.columnDef.header, header.getContext())}
                            </th>))}
                        </tr>))} 
                    </thead>
                    <tbody className="ExpDateTableBody">
                        {reactTable.getRowModel().rows.map(row => (<tr key={row.id}>
                            {row.getVisibleCells().map(cell => (<td className="adj-width" key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>))}
                        </tr>))}
                    </tbody>
                </table>
                <div className="pagesContainerIAR">
                <button className="prevPage"
                    onClick = {()=>reactTable.previousPage()}
                    disabled = {!reactTable.getCanPreviousPage()}
                >{"<<"}</button>
                <div className="pagination">
                    Page {reactTable.getState().pagination.pageIndex+1} of {(" ")}
                    {reactTable.getPageCount()}
                </div>
                <button className="nextPage"
                    onClick = {()=>reactTable.nextPage()}
                    disabled = {!reactTable.getCanNextPage()}
                >{">>"}</button>
            </div>
        </div>
    )  
}

export default ReportTable