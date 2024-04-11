import React from 'react';
import {useSheets} from '../providers/sheets';

const NavigationBar = () => {
    const {sheets, selectedSheets, setSelectedSheets} = useSheets();

    const handleSheetSelection = (sheetName: string) => {
        if (selectedSheets.includes(sheetName)) {
            setSelectedSheets((prev) => prev.filter(name => name !== sheetName));
        } else {
            setSelectedSheets(prev => [...prev, sheetName]);
        }
    };

    return (
        <div className="column">
            {Object.keys(sheets).map((key) => (
                <div
                    key={key}
                    onClick={() => handleSheetSelection(key)}
                    className={`sheetName ${selectedSheets.includes(key) ? 'selected' : ''}`}
                >
                    {key}
                </div>
            ))}
        </div>
    );
};

export default NavigationBar;
