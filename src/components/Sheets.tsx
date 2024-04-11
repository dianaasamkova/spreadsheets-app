import React, {useMemo} from 'react';
import {useSheets} from '../providers/sheets';
import {ISheets} from "../definitions";

const SheetsDisplay = () => {
    const {sheets, selectedSheets} = useSheets();

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


    return (
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
    );
};

export default SheetsDisplay;
