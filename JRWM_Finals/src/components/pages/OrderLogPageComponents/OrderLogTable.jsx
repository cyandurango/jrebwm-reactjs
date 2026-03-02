import "./OrderLogDesign.css"

//IMPORT STATEMENTS UNDER HERE
import React, { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { database } from "../../../config/firebase";
import {
    useReactTable,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
} from "@tanstack/react-table"
import AddOrder from "./addOrder";
import OrderStatusCell from "./orderStatus";
import SeeProductsCell from "./seeProductsCell";
import DateArrivalCell from "./dateArrivalCell";

//=================================================================================================
//  FUNCTION NAME	:	OrderDBTable
//  DESCRIPTION		:	A function that generates a list of orders and displays them in a table
//=================================================================================================
function OrderDBTable(){
    const [orderList, setOrderList] = useState([]);
    const orderCollectionRef = collection(database, "orderedItems");
    
    useEffect(() => {
        const q = query(orderCollectionRef, orderBy("date_request","desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const updatedOrderList = snapshot.docs.map((doc) => {
                const orderData = doc.data();
                return {
                    ...orderData,
                    orderNum: doc.id,
                    date_request: orderData.date_request
                        ? new Date(orderData.date_request.toDate()).toLocaleDateString()
                        : "",
                    date_arrived: orderData.date_arrived
                        ? new Date(orderData.date_arrived.toDate()).toLocaleDateString()
                        : "",
                };
            });
            setOrderList(updatedOrderList);
        });

        return () => unsubscribe();
    }, []);

    const columns = [
        {
            header: 'Order Number',
            accessorKey: 'orderNum'
        },
        {
            header: 'Products Ordered',
            accessorKey: 'orderedProducts',
            cell: ({row}) => <SeeProductsCell id={row.original.orderNum}/>,
        },
        {
            header: 'Supplier',
            accessorKey: 'supplierName'
        },
        {
            header: 'Date of Request',
            accessorKey: 'date_request'
        },
        {
            header: 'Date of Arrival',
            accessorKey: 'date_arrived',
            cell: ({row}) => <DateArrivalCell 
                                id={row.original.orderNum} 
                                getValue = {() => row.original.date_arrived} 
                                status = {row.original.status} 
                                requestDate = {row.original.date_request}
                            />,
        },
        {
            header: 'Order Status',
            accessorKey: 'status',
            cell: ({row}) =>    <OrderStatusCell 
                                    getValue={() => row.original.status}
                                    id={row.original.orderNum} 
                                />,
        },
    ]

    const reactTable = useReactTable({
        data: orderList, 
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        autoResetPageIndex: false,
    });

    return (
        <><div className="OrderLogContent">
          <table className="OrderLogTable">
              <thead className="OrderLogTableHeader">
                {reactTable.getHeaderGroups().map(headerGroup => (<tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (<th key={header.id}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>))}
                </tr>))} 
              </thead>
              <tbody className="OrderLogTableBody">
                {reactTable.getRowModel().rows.map(row => (<tr key={row.id}>
                    {row.getVisibleCells().map(cell => (<td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>))}
                </tr>))}
              </tbody>
          </table>
          <div className="PaginationContainer">
              
                <div className="prevButton">
                 <button classname="prevPageButton"
                onClick = {()=>reactTable.previousPage()}
                disabled = {!reactTable.getCanPreviousPage()}
                  >{"<<"}</button>
                </div>

                <div className="Pagination">
                Page {reactTable.getState().pagination.pageIndex+1} of {(" ")}
                {reactTable.getPageCount()}
              </div>
              
                <div className="nextButton">
                 <button classname="nextPageButton"
                onClick = {()=>reactTable.nextPage()}
                disabled = {!reactTable.getCanNextPage()}
                  >{">>"}</button>
                </div>  
            </div>
        </div></>
      )
}

export default OrderDBTable
