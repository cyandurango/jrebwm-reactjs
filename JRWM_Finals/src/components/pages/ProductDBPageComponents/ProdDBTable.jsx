//IMPORT STATEMENTS UNDER HERE
import React, { useState, useEffect, useMemo } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { database } from "/src/config/firebase";
import {
    useReactTable,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
} from "@tanstack/react-table"
import StatusCell from "./statusCell";
import ProdDBAddProduct from './ProdDBAddProduct';
import "./minibar.css";
import "./ProdDBTable.css";

//=================================================================================================
//  FUNCTION NAME	:	ProdDBTable
//  DESCRIPTION		:	A function that generates a list of products and displays them in a table
//=================================================================================================

function ProdDBTable() {
    const [productList, setProductList] = useState([]);
    const productCollectionRef = collection(database, "singleProduct");
    const [searchTerm, setSearchTerm] = useState('');
    const [sorting, setSorting] = useState({ key: 'productName', direction: 'asc' });

    useEffect(() => {
        const q = query(productCollectionRef, orderBy("uniqueIdentifier"));
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

    const filteredProductList = useMemo(() => {
        return productList.filter(product =>
            product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.prodNum.includes(searchTerm)
        );
    }, [productList, searchTerm]);

    const sortedProductList = useMemo(() => {
        const sortedList = [...filteredProductList];
        sortedList.sort((a, b) => {
            if (sorting.key === 'productName') {
                return sorting.direction === 'asc'
                    ? a.productName.localeCompare(b.productName)
                    : b.productName.localeCompare(a.productName);
            } else if (sorting.key === 'serialNum') {
                return sorting.direction === 'asc' ? a.serialNum - b.serialNum : b.serialNum - a.serialNum;
            }
            // Add more sorting criteria if needed
            return 0;
        });
        return sortedList;
    }, [filteredProductList, sorting]);

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
            header: 'Supplier',
            accessorKey: 'supplierName',
        },
        {
            header: 'Price',
            accessorKey: 'price',
        },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: ({ row }) => <StatusCell id={row.original.id} getValue={() => row.original.status} />,
        },
        {
            header: 'Expiration Date',
            accessorKey: 'expirationDate',
        },
    ];
    
    const reactTable = useReactTable({
        data: sortedProductList, 
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        autoResetPageIndex: false,
    });

    const calculateVisibleRows = () => {
        const tableHeight = 300;
        const rowHeight = 50;
        const availableRows = Math.floor(tableHeight / rowHeight);
        return sortedProductList.slice(0, availableRows);
    };

    const visibleRows = calculateVisibleRows();
    
    return (
        <div>
            <div className="MinibarContainer">
                <div className="minibar">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Item, value, or code" 
                    />
                    <button type="submit" className="search-button">
                        <img src="src/assets/icons/search-icon.svg" alt="srch" className="srch" />
                    </button>
                <div className="filter">
                    <img src="src/assets/icons/filter-icon.svg" alt="ftr" className="ftr" />
                    <select
                        value={sorting.key}
                        onChange={(e) => setSorting({ ...sorting, key: e.target.value })}
                        className="sort1"
                    >
                        <option value="productName">Product Name</option>
                        <option value="prodNum">Product Number</option>
                    </select>
                    <select
                        value={sorting.direction}
                        onChange={(e) => setSorting({ ...sorting, direction: e.target.value })}
                        className="sort2"
                    >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                    </div>
                </div>
                <ProdDBAddProduct />
            </div>
                <table className="table">
                    <thead className="table-header">
                        {reactTable.getHeaderGroups().map(headerGroup => (<tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (<th key={header.id}>
                                {flexRender(header.column.columnDef.header, header.getContext())}
                            </th>))}
                        </tr>))} 
                    </thead>
                    <tbody className="table-body">
                        {reactTable.getRowModel().rows.map(row => (<tr key={row.id}>
                            {row.getVisibleCells().map(cell => (<td className="adj-width" key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>))}
                        </tr>))}
                    </tbody>
                </table>
            <div className="pagesContainer">
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
    );
}

export default ProdDBTable;