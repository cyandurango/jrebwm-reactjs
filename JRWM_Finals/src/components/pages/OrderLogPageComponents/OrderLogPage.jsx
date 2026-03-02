//FUNCTION IMPORTS
import { React } from 'react';
import "./OrderLogDesign.css";
import Header from '../GeneralPageComponents/header';
import Footer from '../GeneralPageComponents/FooterBar';
import AddOrder from './addOrder.jsx';
import OrderDBTable from './OrderLogTable';

const OrderLogPage = () => {
    return (
        <div>
            <Header/>
            <div className='OrderLogBase'>
                <div className='RoundedCorners'></div>
                <div className='RoundedCorners2'></div>
                <div className='AddOrderContainer'>
                    <button className='AddOrderButton' onClick={() => setButtonPopUp(true)}><AddOrder/></button>
                    
                </div>
                <div className='ViewExcessContainer'>
                    <button className='ViewExcessButton'>{"VIEW EXCESS INVENTORY"}</button>
                </div>
               <OrderDBTable/> 
            </div>
            
            <Footer/>
        </div>
    );  
};

export default OrderLogPage;