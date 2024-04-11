import React, {useEffect, useMemo, useState} from 'react';
import './App.css';
import {ISheets} from "./definitions";


function App() {
    const [sheets, setSheets] = useState<ISheets>({})
    const [selectedSheets, setSelectedSheets] = useState<string[]>([]);

    const filteredSheets = useMemo(() => {
        const filteredData: ISheets = {};
        for (let key in sheets) {
            if (selectedSheets.includes(key))
                filteredData[key] = sheets[key];
        }
        return filteredData;
    }, [selectedSheets, sheets]);

    const maxCells = useMemo(() => {
        return Object.values(sheets).reduce((max, table) => {
            return Math.max(max, ...table.map(row => row.length));
        }, 0);
    }, [sheets]);

    const fetchData = async () => {
        try {
            const response = await fetch('https://clinch-public-documents.s3.amazonaws.com/clinch-recruitment/spreadsheet.json');
            const jsonData = await response.json();
            const data = JSON.parse(jsonData)
            setSheets(data)
        } catch (error) {
            console.log("Request has failed")
        }
    };

    useEffect(() => {
        fetchData();
    }, [])

    const handleSheetSelection = (sheetName: string) => {
        if (selectedSheets.includes(sheetName)) {
            setSelectedSheets((prev) => prev.filter(name => name !== sheetName));
        } else {
            setSelectedSheets(prev => [...prev, sheetName]);
        }
    };
    return (
        <div className="container">
            <div className="column">
                {Object.keys(sheets).map((key) => {
                    return (
                        <div
                            key={key}
                            onClick={() => handleSheetSelection(key)}
                            className={`sheetName ${selectedSheets.includes(key) ? 'selected' : ''}`}
                        >
                            {key}
                        </div>
                    )
                })}
            </div>
            <div className="column">
                {Object.entries(filteredSheets).length ?
                    Object.entries(filteredSheets).map(([sheetName, table]) => (
                        <div className="table" key={sheetName}>
                            {table.map((row, rowIndex) => (
                                <div key={rowIndex} className="row"
                                     style={{gridTemplateColumns: `repeat(${maxCells}, minmax(50px, 1fr))`}}>
                                    {row.map((cell, cellIndex) => (
                                        <div key={cellIndex} className="cell">{cell}</div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )) : <div>No spreadsheet selected</div>
                }
            </div>
        </div>
    );
}

export default App;
