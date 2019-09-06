import React from 'react';
import './App.css';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter, dateFilter, numberFilter  } from 'react-bootstrap-table2-filter';

const columns = [{
  dataField: 'id',
  text: 'Product ID',
  sort: true
}, {
  dataField: 'name',
  text: 'Product Name',
  sort: true,
  filter: textFilter()
}, {
  dataField: 'price',
  text: 'Product Price',
  sort: true,
  filter: numberFilter()
}, {
  dataField: 'date',
  text: 'Product Date',
  filter: dateFilter()
}];


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

function App() {
  return (
    <div className="App">
      <BootstrapTable bootstrap4 keyField='id' data={products} columns={columns} filter={ filterFactory() }/>
    </div>
  );
}

export default App;
