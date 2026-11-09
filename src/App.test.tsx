import React from 'react';
import {act, fireEvent, render, screen} from '@testing-library/react';
import App from './App';

// The real endpoint returns a JSON-encoded string of the sheets object.
const SHEETS = {'Sheet 1': [[1, 2, 3], [4, 5, 7]], 'Sheet 2': [[10, 20]]};

beforeEach(() => {
    jest.useFakeTimers();
    global.fetch = jest.fn().mockResolvedValue({json: () => Promise.resolve(JSON.stringify(SHEETS))}) as jest.Mock;
});

afterEach(() => {
    jest.useRealTimers();
});

async function renderApp() {
    render(<App/>);
    await screen.findByText('Sheet 1');
}

test('lists the sheets and shows nothing until one is selected', async () => {
    await renderApp();
    expect(screen.getByText('Sheet 2')).toBeInTheDocument();
    expect(screen.getByText('No spreadsheet selected')).toBeInTheDocument();
});

test('shows a selected sheet with a sum for every row', async () => {
    await renderApp();
    fireEvent.click(screen.getByText('Sheet 1'));

    expect(screen.getByText('6')).toHaveClass('sum'); // 1 + 2 + 3
    expect(screen.getByText('16')).toHaveClass('sum'); // 4 + 5 + 7
    expect(screen.queryByText('No spreadsheet selected')).not.toBeInTheDocument();
});

test('applies theme edits made in quick succession to different fields', async () => {
    await renderApp();
    fireEvent.click(screen.getByText('Sheet 1'));
    fireEvent.click(screen.getByText('Change Theme'));

    // Inputs are ordered: evenRows, oddRows, evenCellValues, oddCellValues.
    const colorInputs = screen.getAllByPlaceholderText('Color');
    fireEvent.change(colorInputs[0], {target: {value: 'red'}}); // even rows (row 2)
    fireEvent.change(colorInputs[1], {target: {value: 'blue'}}); // odd rows (row 1)

    act(() => {
        jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText('1')).toHaveStyle({color: 'blue'});
    expect(screen.getByText('4')).toHaveStyle({color: 'red'});
});
