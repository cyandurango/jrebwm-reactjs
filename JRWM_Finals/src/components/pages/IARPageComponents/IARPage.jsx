//FUNCTION IMPORTS
import { React } from 'react';
import Header from '../GeneralPageComponents/header';
import "/src/components/generalPageStyles/general.css";
import ReportTable from './IARTable';
import Footer from '../GeneralPageComponents/FooterBar';

const IARPage = () => {
    return (
        <div>
            <div className="background"></div>
                <Header />
            <div className="IARPageContainer">
                <div className="WidthFlexContainer">
                    <div className="ImaginaryWidth"></div>
                    <div className="HeightFlexContainer">
                        <div className="ImaginaryHeight"></div>
                        <div className="IARContainer">
                            <ReportTable/>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
      </div>
    );  
};


export default IARPage;