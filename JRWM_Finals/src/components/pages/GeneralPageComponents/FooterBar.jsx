import { React } from 'react';
import './FooterBar.css';

const FooterBar = () => {
  return (
    <div className='FooterContainer'>
      <div className='FooterBox'>
        <div className='Footer-Space'></div>
        <div className='JRWM-Label'>
          Jerango Ebanque
        </div>
        <div className='CopyrightBox'>
        &#169; <span className='Copyright-Year'>2024</span>
        </div>
      </div>
    </div>
  );
}

export default FooterBar; 