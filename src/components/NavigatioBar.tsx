import React, {useState} from 'react';
import {useSheets} from '../providers/sheets';
import Modal from "./Modal";
import styles from "./styles/NavigationBar.module.css";

const NavigationBar = () => {
    const {sheets, selectedSheets, setSelectedSheets} = useSheets();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleToggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

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
            <button
                className={`${styles.button} ${isModalOpen ? styles.open : ''}`}
                onClick={handleToggleModal}>Change Theme
            </button>
            {isModalOpen && <Modal onClose={handleToggleModal}/>}
        </div>
    );
};

export default NavigationBar;
