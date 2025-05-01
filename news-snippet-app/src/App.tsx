import React from 'react';
import { ConfigProvider, theme } from 'antd';
import Home from './page/Home';
import './styles/App.scss'; 

const App: React.FC = () => (
  <ConfigProvider
    theme={{
      algorithm: theme.darkAlgorithm,
    }}
  >
    <div className="gradient-background">
      <Home />
    </div>
  </ConfigProvider>
);

export default App;
