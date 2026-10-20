import React from 'react';
import { Z_INDEX } from '../../config/frets.config';
  
const PanelComponent = ({ children, show = false, className = '' }) => {
    return <div className={`legacy-nav-panel ${className} ${show ? 'legacy-nav-panel-open' : 'legacy-nav-panel-closed'}`} style={{ zIndex: Z_INDEX.Panel }}>
        {children}
    </div>
};

export default PanelComponent;