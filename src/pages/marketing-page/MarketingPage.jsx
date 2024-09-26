import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import AppAppBar from './components/AppAppBar';
import Highlights from './components/Highlights';
import Features from './components/Features';
import Footer from './components/Footer';
import getMPTheme from './theme/getMPTheme';
import TemplateFrame from './TemplateFrame';

export default function MarketingPage() {
  const [mode, setMode] = React.useState('light');
  
  const MPTheme = createTheme(getMPTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });

  // This code only runs on the client side, to determine the system color preference
  React.useEffect(() => {
    // Check if there is a preferred mode in localStorage
    const savedMode = localStorage.getItem('themeMode');
    if (savedMode) {
      setMode(savedMode);
    } else {
      // If no preference is found, it uses system preference
      const systemPrefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches;
      setMode(systemPrefersDark ? 'dark' : 'light');
    }
  }, []);

  const toggleColorMode = () => {
    const newMode = mode === 'dark' ? 'light' : 'dark';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode); // Save the selected mode to localStorage
  };



  return (
    <TemplateFrame
      mode={'dark'}
    >
      
        <CssBaseline enableColorScheme />
        <AppAppBar />
        <div>
          <Features />     
          <Divider />
          <Highlights />
          <Divider />
          <Footer />
        </div>

    </TemplateFrame>
  );
}
