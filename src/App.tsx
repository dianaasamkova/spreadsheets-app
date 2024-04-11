import React from 'react';
import './App.css';
import NavigationBar from './components/NavigatioBar';
import SheetsDisplay from './components/Sheets';
import { SheetsProvider } from './providers/sheets';

function App() {
    return (
        <SheetsProvider>
            <div className="container">
                <NavigationBar />
                <SheetsDisplay />
            </div>
        </SheetsProvider>
    );
}

export default App;
