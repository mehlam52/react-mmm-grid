# react-mmm-grid

[![npm version](https://badge.fury.io/js/react-mmm-grid.svg)](https://badge.fury.io/js/react-mmm-grid)
[![types](https://img.shields.io/npm/types/react-mmm-grid)](https://www.npmjs.com/package/react-mmm-grid)
[![npm bundle size](https://img.shields.io/bundlephobia/min/react-mmm-grid)](https://www.npmjs.com/package/react-mmm-grid)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
<!-- [![npm](https://img.shields.io/npm/dm/react-mmm-grid)](https://www.npmjs.com/package/react-mmm-grid)
[![npm](https://img.shields.io/npm/dt/react-mmm-grid)](https://www.npmjs.com/package/react-mmm-grid) -->

`react-mmm-grid` is a highly customizable and performant grid component for React, designed to provide a desktop-like experience. It supports features like sorting, filtering, pagination, and more.

<!-- link gif -->
![react-mmm-grid](./mmm-grid.gif)


<!--Live Demo Link-->
[Live Demo](https://react-mmm-grid.netlify.app/)


## Features

- **Customizable Columns**: Easily configure the columns to display.
- **Responsive Design**: Adapts to different screen sizes.
- **Keyboard Navigation**: Navigate through the grid using keyboard shortcuts.
- **Theming**: Customize the look and feel with theming support.

## Installation

Install the package via npm:

```sh
npm install react-mmm-grid
```
Or via yarn:

```sh
yarn add react-mmm-grid
```

## Usage

```jsx
import { useState } from "react";
import MyGrid, { MMMGridColumnProps } from "react-mmm-grid";


function App() {
  const columns: MMMGridColumnProps[] = [
    {
      name: "name",
      title: "First Name",
      minWidth: 150,
    },
    {
      name: "lastName",
      title: "Last Name",
      minWidth: 150,
    },
    {
      name: "age",
      title: "Age",
      columnType: "numeric",
      minWidth: 80,
      decimals: 1,
    },
    {
      name: "gender",
      title: "Gender",
      type: "select",
      minWidth: 100,
      selectOptions: () => [
        { label: "Male", value: "male" },
        { label: "Female", value: "female" },
      ],
    },
    {
      name: "email",
      title: "Email",
      minWidth: 120,
    },
    {
      name: "city",
      title: "City",
      minWidth: 120,
      type: "select",
      selectType: "async",
      selectOptions: () => [
        { label: "Banglore", value: "Banglore" },
        { label: "Mumbai", value: "Mumbai" },
        { label: "Nasik", value: "Nasik" },
        { label: "Pune", value: "Pune" },
        { label: "Delhi", value: "Delhi" },
        { label: "Chennai", value: "Chennai" },
        { label: "Hyderabad", value: "Hyderabad" },
        { label: "Kolkata", value: "Kolkata" },
      ],
    },
  {
      name: "avatar",
      title: "Avatar",
      minWidth: 150,
      render: (row: any, rowIndex: number) => {
        const colors = ["red", "green", "blue", "orange", "purple"];
        const color = colors[Math.floor(Math.random() * colors.length)];
        return (
          <div>
            <div
              style={{
                display: row.name ? "flex" : "none",
                width: 35,
                height: 35,
                borderRadius: 25,
                backgroundColor: color,
                justifyContent: "center",
                alignItems: "center",
                margin: "auto",
                fontSize: 16,
                color: "white",
              }}
            >
              {row.name?.charAt(0).toUpperCase()}
              {row.lastName?.charAt(0).toUpperCase()}
            </div>
          </div>
        );
      },
    },
  ];


  const [rows, setRows] = useState([{}]);
  const [activeGridRow, setActiveGridRow] = useState<any>();

  const handleGridChange = async (
    rowIndex: number,
    name: string,
    value: any,
    inputType?: "select" | "text"
  ) => {
    const temp: any = structuredClone(rows);

    let val = value;
    if (inputType === "select") {
      val = value?.label;
    }
    temp[rowIndex] = { ...temp[rowIndex], [name]: val };

    if (rowIndex >= temp.length - 1) {
      temp.push({});
    }

    setRows(temp);
  };

  const handleRowsDelete = (indexes: number[]) => {
    let temp = structuredClone(rows);
    for (let i = 0; i < indexes.length; i++) {
      temp[indexes[i]] = {};
    }
    temp = temp.filter((x: any) => x.name);
    temp.push({});

    setRows(temp);
  };



  return (
    <div>
      <h1 style={{ textAlign: "center", color: "gray" }}>
        <u>MMM Grid Demo</u>
      </h1>

      <h2 style={{ color: "gray" }}>Grid 1</h2>
      <MyGrid
        columns={columns}
        rows={rows}
        height={200}
        handleChange={handleGridChange}
        deleteRows
        handleDelete={handleRowsDelete}
        setActiveGridRow={setActiveGridRow}
        idPrefix="grid1" // should be unique for each grid in the same page
      />
      <div style={{ marginTop: 7, textAlign: "center", color: "blue" }}>
        <b>Active row first name : {activeGridRow?.name}</b>
      </div>
      <br />
    </div>
  );
}

export default App;

```

## Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| columns | `MMMGridColumnProps[]` | `[]` | The columns to display in the grid. |
| rows | `any[]` | `[]` | The rows to display in the grid. |
| height | `number` | `300` | The height of the grid. |
| handleChange | `(rowIndex: number, name: string, value: any, inputType?: "select" | "text") => void` | `() => {}` | The function to call when a cell value changes. |
| deleteRows | `boolean` | `false` | Whether to show the delete rows button. |
| handleDelete | `(indexes: number[]) => void` | `() => {}` | The function to call when the delete rows button is clicked. |
| setActiveGridRow | `(row: any) => void` | `() => {}` | The function to call when a row is clicked. |
| idPrefix | `string` | `""` | A unique prefix for the grid's IDs. |

## License

MIT

## Author

Mehlam Hamid





