import { useState } from 'react'
// @ts-ignore
import MMMGrid from 'react-mmm-grid'
// @ts-ignore
import type { MMMGridColumnProps } from 'react-mmm-grid'

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
        return (
          <div>
            <div
              style={{
                display: row.name ? "flex" : "none",
                width: 35,
                height: 35,
                borderRadius: 25,
                backgroundColor: "#1976d2",
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

    const [rows, setRows] = useState([{}, {}]);
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

    if (rowIndex >= temp.length - 2) {
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
    temp.push({});

    setRows(temp);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>React MMM Grid Example</h1>
       <MMMGrid
            columns={columns}
            rows={rows}
            height={200}
            handleChange={handleGridChange}
            deleteRows
            handleDelete={handleRowsDelete}
            setActiveGridRow={setActiveGridRow}
            enableSearch={true}
            idPrefix="grid1" // should be unique for each grid in the same page
          />
    </div>
  )
}

export default App
