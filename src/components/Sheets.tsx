import React, {useCallback, useMemo} from 'react';
import {useSheets} from '../providers/sheets';
import {ISheets, ThemeSettings} from "../definitions";
import {useTheme} from "../providers/theme";

const SheetsDisplay = () => {
    const {sheets, selectedSheets} = useSheets();
    const {themeSettings} = useTheme();

    const applyStyles = useCallback((rowIndex: number, cellValue: number) => {
        const isRowEven = rowIndex % 2 === 0;
        const isCellEven = cellValue % 2 === 0;

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

    const calculateSum = (row: number[]) => {
        return row.reduce((sum, value) => sum + value, 0);
    }

    const view: {
        sheets: ISheets
        sum: { [key: string]: number[] }
    } = useMemo(() => {
        const filteredSheets: ISheets = {};
        const sum: { [key: string]: number[] } = {}
        for (let key in sheets) {
            if (selectedSheets.includes(key)) {
                filteredSheets[key] = sheets[key];
                sum[key] = sheets[key].map(row => calculateSum(row))
            }
        }
        return {
            sheets: filteredSheets,
            sum
        };
    }, [selectedSheets, sheets]);

    /**
     * for smooth responsive behaviour
     */
    const maxCells = useMemo(() => {
        return Object.values(sheets).reduce((max, table) => {
            return Math.max(max, ...table.map(row => row.length));
        }, 0);
    }, [sheets]);


    return (
        <div className="column">
            {Object.entries(view?.sheets).length ?
                Object.entries(view?.sheets).map(([sheetName, table]) => (
                    <div className="table" key={sheetName}
                    >
                        {table.map((row, rowIndex) => (
                            <div
                                key={rowIndex} className="row"
                                style={{gridTemplateColumns: `repeat(${maxCells + 1}, minmax(50px, 1fr))`}}
                            >
                                {row.map((cell, cellIndex) => (
                                    <div
                                        key={cellIndex}
                                        style={applyStyles(rowIndex + 1, cell)}
                                        className="cell"
                                    >{cell}</div>
                                ))}
                                <div className="cell sum">{view?.sum?.[sheetName]?.[rowIndex]}</div>
                            </div>
                        ))}
                    </div>
                )) : <div>No spreadsheet selected</div>
            }
        </div>
    );
};

export default SheetsDisplay;
