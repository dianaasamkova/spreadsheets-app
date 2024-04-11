import React from 'react';
import './App.css';
import NavigationBar from './components/NavigatioBar';
import SheetsDisplay from './components/Sheets';
import {SheetsProvider} from './providers/sheets';
import {ThemeProvider} from "./providers/theme";

function App() {
    return (
        <ThemeProvider>
            <SheetsProvider>
                <div className="container">
                    <NavigationBar/>
                    <SheetsDisplay/>
                </div>
            </SheetsProvider>
        </ThemeProvider>

    );
}

export default App;
