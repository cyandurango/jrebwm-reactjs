import { React, useState } from 'react';
// import { useNavigate } from "react-router-dom";
import Header from "../GeneralPageComponents/header";
// import Sidebar from "../components/sidebar";
// import Minibar from '../components/minibar';
// import Dashboard from '../components/dashboard';
import ProdDBTable from './ProdDBTable';
import ProdDBAddProduct from './ProdDBAddProduct';
import "/src/components/generalPageStyles/general.css";
import Footer from '../GeneralPageComponents/FooterBar';

const homepage = () => {

  return (
      <div>
          <div className="background"></div>
            <Header />
          <div className="ProductDatabaseContainer">
            <div className="WidthFlexContainer">
                <div className="ImaginaryWidth"></div>
                <div className="HeightFlexContainer">
                    <div className="ImaginaryHeight"></div>
                    <div className="ProductContainer">
                        <ProdDBTable />
                    </div>
                </div>
            </div>
          </div>
          <Footer />
      </div>
  );  
};

export default homepage;