import React, { useMemo, Fragment, useState } from 'react';
import { useTable, useFilters } from 'react-table'
import matchSorter from 'match-sorter'

const FilterToggleHeader = ({ data, column, onToggle }) => {
    return (
        <Fragment>
            <span style={{ padding: "0 10px" }}>{column.parent.Header}</span>
            <button onClick={() => onToggle(column.index)}>!</button>
        </Fragment>
    );
};

// This is a custom filter UI for selecting
// a unique option from a list
function SelectColumnFilter({
    column: { filterValue, setFilter, preFilteredRows, id },
}) {
    // Calculate the options for filtering
    // using the preFilteredRows
    const options = React.useMemo(() => {
        const options = new Set()
        preFilteredRows.forEach(row => {
            options.add(row.values[id])
        })
        return [...options.values()]
    }, [id, preFilteredRows])

    // Render a multi-select box
    return (
        <select
            value={filterValue}
            onChange={e => {
                setFilter(e.target.value || undefined)
            }}
        >
            <option value="">All</option>
            {options.map((option, i) => (
                <option key={i} value={option}>
                    {option}
                </option>
            ))}
        </select>
    )
}

// Define a default UI for filtering
function DefaultColumnFilter({
    column: { filterValue, preFilteredRows, setFilter },
}) {
    const count = preFilteredRows.length
    return (
        <div>
            <input
                value={filterValue || ''}
                onChange={e => {
                    setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
                }}
                placeholder={`Search ${count} records...`}
            />
        </div>
    )
}


function fuzzyTextFilterFn(rows, id, filterValue) {
    return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = val => !val

// Our table component
function Table({ columns, data }) {
    const filterTypes = useMemo(
        () => ({
            // Add a new fuzzyTextFilterFn filter type.
            fuzzyText: fuzzyTextFilterFn,
            // Or, override the default text filter to use
            // "startWith"
            text: (rows, id, filterValue) => {
                return rows.filter(row => {
                    const rowValue = row.values[id]
                    return rowValue !== undefined
                        ? String(rowValue)
                            .toLowerCase()
                            .startsWith(String(filterValue).toLowerCase())
                        : true
                })
            },
        }),
        []
    )

    const defaultColumn = useMemo(
        () => ({
            // Let's set up our default Filter UI
            Filter: DefaultColumnFilter,
        }),
        []
    )

    const { getTableProps, headerGroups, rows, prepareRow } = useTable(
        {
            columns,
            data,
            defaultColumn, // Be sure to pass the defaultColumn option
            filterTypes,
        },
        useFilters // useFilters!
    )

    // We don't want to render all of the rows for this example, so cap
    // it for this use case
    const firstPageRows = rows.slice(0, 10)

    return (
        <>
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th {...column.getHeaderProps()}>
                                    {column.render('Header')}
                                    <div>{column.canFilter ? column.render('Filter') : null}</div>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {firstPageRows.map(
                        (row, i) =>
                            prepareRow(row) || (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map(cell => {
                                        return (
                                            <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                        )
                                    })}
                                </tr>
                            )
                    )}
                </tbody>
            </table>
            <br />
            <div>Showing the first 20 results of {rows.length} rows</div>
        </>
    )
}

// Define a custom filter filter function!
function filterGreaterThan(rows, id, filterValue) {
    return rows.filter(row => {
        const rowValue = row.values[id]
        return rowValue >= filterValue
    })
}

// This is an autoRemove method on the filter function that
// when given the new filter value and returns true, the filter
// will be automatically removed. Normally this is just an undefined
// check, but here, we want to remove the filter if it's not a number
filterGreaterThan.autoRemove = val => typeof val !== 'number'

export default function Table2() {
    const [valid, setValid] = useState(false);

    function ColumnFilter({
        column: { filterValue, preFilteredRows, setFilter },
    }) {
        const count = preFilteredRows.length
        console.log(valid)
        return (
            <div>
                {valid ? <input
                    value={filterValue || ''}
                    onChange={e => {
                        setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
                    }}
                    placeholder={`Search ${count} records...`}
                /> : <h1>teste</h1>}
            </div>
        )
    }
    
    function toggleFilter() {
        setValid(valid ? false : true);
    };

    const columns = useMemo(
        () => [
            {
                Header: 'Name',
                columns: [
                    {
                        Header: props => (
                            <FilterToggleHeader
                                {...props}
                                onToggle={toggleFilter}
                            />
                        ),
                        accessor: 'id',
                        Filter: ColumnFilter,
                    },
                    {
                        Header: 'Last Name',
                        accessor: 'name',
                        Filter: SelectColumnFilter,
                        filter: 'includes',
                    },
                    {
                        Header: 'First Name',
                        accessor: 'price',
                    },
                    {
                        Header: 'Last Name',
                        accessor: 'date',
                    },
                ],
            },
        ],
        []
    )

    const products = [
        {
            id: 1,
            name: 'product 1',
            price: 100,
            date: '05/06/2018'
        },
        {
            id: 2,
            name: 'product 2',
            price: 200,
            date: '06/06/2018'
        },
        {
            id: 3,
            name: 'product 3',
            price: 300,
            date: '07/06/2018'
        },
        {
            id: 4,
            name: 'product 4',
            price: 400,
            date: '08/06/2018'
        },
        {
            id: 5,
            name: 'product 5',
            price: 500,
            date: '09/06/2018'
        },
    ];

    return (
        <Table columns={columns} data={products}/>
    )
}
