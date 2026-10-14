import React from 'react';
import { Panel } from './Panel.styled';
  
const PanelComponent = ({ children, show = false }) => {
    return <Panel show={show}>
        {children}
    </Panel>
};

export default PanelComponent;