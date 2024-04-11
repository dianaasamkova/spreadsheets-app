import React, {useCallback, useMemo} from 'react';
import {useSheets} from '../providers/sheets';
import {ISheets, ThemeSettings} from "../definitions";
import {useTheme} from "../providers/theme";

const SheetsDisplay = () => {
    const {sheets, selectedSheets} = useSheets();
    const {themeSettings} = useTheme();


    const applyStyles = useCallback((rowIndex: number, cellIndex: number) => {
        const isRowEven = rowIndex % 2 === 0;
        const isCellEven = cellIndex % 2 === 0;

        let rowStyle: Partial<ThemeSettings> = isRowEven ? themeSettings.evenRows : themeSettings.oddRows;
        let cellStyle: Partial<ThemeSettings> = isCellEven ? themeSettings.evenCellValues : themeSettings.oddCellValues;

        if (!rowStyle.color) {
            const {color, ...rest} = rowStyle
            rowStyle = {...rest}
        }
        if (!rowStyle.backgroundColor) {
            const {backgroundColor, ...rest} = rowStyle
            rowStyle = {...rest}
        }
        return {
            ...cellStyle,
            ...rowStyle,
        };
    }, [themeSettings]);


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
                                    <div
                                        key={cellIndex}
                                        style={applyStyles(rowIndex, cellIndex)}
                                        className="cell"
                                    >{cell}</div>
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
