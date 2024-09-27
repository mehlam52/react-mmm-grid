import { useEffect, useRef, useState } from "react";
import "./grid.scss";
import AsyncSelect from "react-select/async";
import Select, { createFilter } from "react-select";
import CreatableSelect from "react-select/creatable";

const KEY_ENTER = "Enter";
const KEY_TAB = "Tab";
const KEY_ESC = "Escape";

export type MMMGridColumnProps = {
  name: string;
  title: string;
  minWidth?: number;
  columnType?: "text" | "numeric" | "date";
  decimals?: number;
  hidden?: boolean;
  type?: "select" | "text";
  selectOptions?: (row: any) => { label: string; value: string }[];
  selectType?: "normal" | "async" | "creatable";
  disabled?: (row: any) => boolean;
  render?: (
    row: any,
    rowIndex: number,
    colIndex: number,
    rows: any,
    isDisabled?: boolean,
    isFocused?: boolean,
    columns?: any,
    idPrefix?: string
  ) => JSX.Element;
  style?: (
    row: any,

    isDisabled?: boolean
  ) => object;
};

type MMMGridProps = {
  rows: any;
  columns: MMMGridColumnProps[];
  height?: number;
  disabled?: boolean;
  deleteRows?: boolean;
  resetVariable?: any;
  idPrefix?: string;
  handleChange: (
    rowIndex: number,
    name: string,
    value: any,
    inputType: "select" | "text" | undefined
  ) => void;
  handleDelete?: (rowIndexes: number[]) => void;
  rowDisabled?: (row: any) => boolean;
  setActiveGridRow?: any;
  setSelectedRows?: any;
};

const MMMGrid = ({
  rows,
  columns,
  height,
  deleteRows,
  handleChange,
  handleDelete,
  disabled = false,
  rowDisabled = () => false,
  idPrefix = "gridcell",
  setActiveGridRow,
  setSelectedRows,
}: MMMGridProps) => {
  // ================ constants ==================

  const inputRef = useRef<HTMLInputElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);

  // ================ usestate ==================
  const [focusedCell, setFocusedCell] = useState({ row: -1, col: -1 });
  const [tableData, setTableData] = useState<any>([{}]);
  const [initialized, setInitialized] = useState<boolean>(false);

  // ================ useeffect ==================
  useEffect(() => {
    const handleKeyDown = (event: any) => {
      const { row, col } = focusedCell;
      if (row === -1 || col === -1) return;
      let newRow = row;
      let newCol = col;

      // const columns = columns[]

      const currentElement = document.getElementById(
        `${idPrefix}-${row}-${col}`
      );
      if (event.key === KEY_ESC && currentElement?.querySelector("input")) {
        currentElement.querySelector("input")?.blur();
        return;
      }

      if (currentElement?.querySelector("input") && event.key === KEY_ENTER) {
        return;
      }

      currentElement?.querySelector("input")?.focus();

      if (
        (currentElement?.querySelector('div[class*="menu"]') ||
          currentElement?.querySelector(".select__menu")) &&
        (event.key === KEY_ENTER ||
          event.key === "ArrowUp" ||
          event.key === "ArrowDown")
      ) {
        return;
      }
      if (document)
        if (event.shiftKey && event.key === KEY_TAB) {
          event.preventDefault();
          // if shift + tab
          let increment4 = 0;
          while (
            columns[col - 1 - increment4]?.hidden ||
            (columns[col - 1 - increment4]?.disabled &&
              columns[col - 1 - increment4].disabled(rows[row]))
          ) {
            increment4++;
          }

          newCol = col - 1 - increment4 >= 0 ? col - 1 - increment4 : col;

          if (col - 1 - increment4 >= 0) {
            newCol = col - 1 - increment4;
          } else {
            newRow = row - 1 >= 0 ? row - 1 : row;
            increment4 = columns.length - 1;
            while (
              columns[increment4]?.hidden ||
              (columns[increment4]?.disabled &&
                columns[increment4].disabled(rows[newRow]))
            ) {
              increment4--;
            }

            // newCol = deleteRows ? increment4 + 1 : increment4;
            newCol = increment4;
          }

          event.target?.blur();
        } else if (event.key === KEY_TAB) {
          event.preventDefault();
          let increment3 = 0;
          while (
            columns[col + 1 + increment3]?.hidden ||
            (columns[col + 1 + increment3]?.disabled &&
              columns[col + 1 + increment3].disabled(rows[row]))
          ) {
            increment3++;
          }
          if (col + 1 + increment3 < columns.length) {
            newCol = col + 1 + increment3;
          } else {
            newRow =
              row < tableData.length - 1 ? row + 1 : tableData.length - 1;

            increment3 = 0;
            while (
              columns[increment3]?.hidden ||
              (columns[increment3]?.disabled &&
                columns[increment3].disabled(rows[newRow]))
            ) {
              increment3++;
            }

            // newCol = deleteRows ? increment3 - 1 : increment3;
            newCol = increment3;
          }

          event.target?.blur();
        } else {
          switch (event.key) {
            case "ArrowUp":
              event.preventDefault();
              newRow = row - 1 >= 0 ? row - 1 : row;
              event.target?.blur();
              break;
            case "ArrowDown":
              event.preventDefault();
              newRow =
                row < tableData.length - 1 ? row + 1 : tableData.length - 1;
              event.target?.blur();
              break;
            case "ArrowLeft": {
              let increment = 0;
              while (columns[col - 1 - increment]?.hidden) {
                increment++;
              }
              newCol = col - 1 - increment >= 0 ? col - 1 - increment : col;
              event.target?.blur();
              break;
            }

            // case arrow right or tab
            case "ArrowRight": {
              let increment2 = 0;
              while (columns[col + 1 + increment2]?.hidden) {
                increment2++;
              }
              newCol =
                col + 1 + increment2 < columns.length
                  ? col + 1 + increment2
                  : columns.length - 1;

              event.target?.blur();
              break;
            }
            default:
              break;
          }
        }

      // if (event.key === KEY_ENTER && inputRef.current?.contains(event.target as Node)) {
      if (event.key === KEY_ENTER) {
        newRow = row < tableData.length - 1 ? row + 1 : tableData.length - 1;
        // setFocusedCell({ row: newRow, col: newCol });
        event.target?.blur();
      }

      // event.target?.focus();

      const element = document.getElementById(
        `${idPrefix}-${newRow}-${newCol}`
      );

      if (
        // event.key != KEY_TAB &&
        // !event.shiftKey &&
        event.key != "ArrowLeft" &&
        event.key != "ArrowRight" &&
        event.key != KEY_ENTER &&
        event.key != "ArrowUp" &&
        event.key != "ArrowDown"
      ) {
        if (
          element?.tagName === "INPUT" &&
          event.key != KEY_TAB &&
          !event.shiftKey
        ) {
          element.focus();
        } else if (element?.querySelector("input")) {
          element.querySelector("input")?.focus();
        }
      }

      if (
        element?.tagName === "INPUT" &&
        event.key != "ArrowLeft" &&
        event.key != "ArrowRight"
      ) {
        element.focus();
      } else if (element) {
        const rect = element.getBoundingClientRect();
        const isVisible =
          rect.top - 250 >= 0 &&
          rect.left >= 0 &&
          rect.bottom + 50 <= window.innerHeight &&
          rect.right <= window.innerWidth;

        if (!isVisible) {
          // element.focus();

          // if (element?.tagName === 'INPUT') {
          //     element.focus();
          // } else {
          // scroll in view horizontally
          if (rect.left < 0) {
            element.scrollIntoView({ block: "nearest", inline: "start" });
          } else if (rect.right > window.innerWidth) {
            element.scrollIntoView({ block: "nearest", inline: "start" });
          } else if (rect.top - 250 < 0) {
            element.scrollIntoView({ block: "center", inline: "nearest" });
          } else {
            element.scrollIntoView({ block: "nearest", inline: "nearest" });
          }
          // }
        }
      }
      setFocusedCell({ row: newRow, col: newCol });

      // if (event.key === 'Control') {
      //     event.target?.select();
      // }
    };

    const handleBlur = (event: any) => {
      if (tableRef.current?.contains(event.target)) return;
      else if (!initialized) {
        setFocusedCell({ row: -1, col: -1 });
        setInitialized(true);
      } else {
        setFocusedCell({ row: -1, col: -1 });
      }
    };

    if (setActiveGridRow) {
      if (focusedCell.row !== -1 && focusedCell.col !== -1) {
        setActiveGridRow(rows[focusedCell.row]);
      } else {
        setActiveGridRow(null);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleBlur);
    // inputRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleBlur);
    };
  }, [focusedCell]);

  useEffect(() => {
    if (rows.length > 0) {
      const temp = structuredClone(rows);
      temp.map((row: any) => {
        const tempRow = row;
        for (let i = 0; i < columns.length; i++) {
          const col = columns[i];
          if (
            col.columnType === "numeric" &&
            tempRow[col.name] != null &&
            tempRow[col.name] != ""
          ) {
            tempRow[col.name] = parseFloat(tempRow[col.name]).toFixed(
              col.decimals || 0
            );
          }
        }
        return tempRow;
      });
      setTableData(temp);
    }
  }, [rows]);

  // ================ functions ==================

  const handleFocus = (row: number, col: number) => {
    setFocusedCell({ row, col });
  };

  const handleTableDataChange = (
    rowIndex: number,
    name: string,
    value: any
  ) => {
    // const newData = structuredClone(tableData);
    // newData[rowIndex][name] = value;
    // setTableData(newData);

    setTableData((prevTableData: any) => {
      const newData = [...prevTableData];
      newData[rowIndex] = { ...newData[rowIndex], [name]: value };
      return newData;
    });
  };

  const handleBlur = (
    value: any,
    rowIndex: number,
    col: any,
    inputType?: "select" | "text"
  ) => {
    let val = value;
    if (inputType == "select") {
      val = value?.value;
    }
    if (
      val == "" &&
      (rows[rowIndex][col.name] == null || rows[rowIndex][col.name] == "")
    ) {
      return;
    }

    if (val != rows[rowIndex][col.name]) {
      handleChange(rowIndex, col.name, value, inputType);
    }
  };

  const loadOptions = (options: any, inputValue: string, callback: any) => {
    const ops = options
      ?.filter((x: any) =>
        x?.label?.toLowerCase().includes(inputValue.toLowerCase())
      )
      .sort((a: any, b: any) => a.label?.localeCompare(b.label))
      .map((x: any) => ({
        label: x.label,
        value: x.value,
      }));

    setTimeout(() => {
      callback(ops);
    }, 1000);
  };

  return (
    <div className="my-grid-container" style={{ height: height ? height : "" }}>
      <table ref={tableRef}>
        <thead>
          <tr>
            {!disabled && deleteRows && (
              <th>
                <div className="grid-delete">
                  {/* <MdDelete
                                        onClick={() => {
                                            let temp = [...tableData];
                                            // temp = temp.filter((row: any) => !row.checked);
                                            // setTableData(temp);

                                            handleDelete(
                                                temp
                                                    .filter((row: any) => row.checked)
                                                    .map((row) => {
                                                        return tableData.indexOf(row);
                                                    })
                                            );
                                        }}
                                        className="icon"
                                    /> */}

                  <div
                    onClick={() => {
                      const temp = [...tableData];
                      // temp = temp.filter((row: any) => !row.checked);
                      // setTableData(temp);
                      if (handleDelete)
                        handleDelete(
                          temp
                            .filter((row: any) => row.checked)
                            .map((row) => {
                              return tableData.indexOf(row);
                            })
                        );
                    }}
                    className="icon"
                    style={{ cursor: "pointer" }}
                  >
                    <svg
                      fill="#af0c0c"
                      width="18px"
                      height="18px"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M5.755,20.283,4,8H20L18.245,20.283A2,2,0,0,1,16.265,22H7.735A2,2,0,0,1,5.755,20.283ZM21,4H16V3a1,1,0,0,0-1-1H9A1,1,0,0,0,8,3V4H3A1,1,0,0,0,3,6H21a1,1,0,0,0,0-2Z" />
                    </svg>
                  </div>
                </div>
              </th>
            )}
            {columns.map((item, idx) => (
              <th
                key={idx}
                style={{
                  minWidth: item.minWidth ? item.minWidth : "",
                  display: item.hidden ? "none" : "",
                }}
              >
                {item.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row: any, rowIndex: number) => (
            <tr key={rowIndex} className={row.checked ? "checked" : ""}>
              {!disabled && deleteRows && (
                <td>
                  <input
                    type="checkbox"
                    disabled={rowDisabled(row)}
                    checked={row.checked ? row.checked : false}
                    onChange={(e) => {
                      const temp = [...tableData];
                      temp[rowIndex].checked = e.target.checked;
                      setTableData(temp);

                      if (setSelectedRows)
                        setSelectedRows(temp.filter((row: any) => row.checked));
                    }}
                    style={{
                      width: 30,
                      height: 15,
                    }}
                  />
                </td>
              )}
              {columns.map((col, colIndex: number) => (
                <td
                  key={colIndex}
                  style={{
                    display: col.hidden ? "none" : "",
                    background:
                      (col.disabled && col.disabled(row)) ||
                      disabled ||
                      rowDisabled(row)
                        ? "#f0f0f0"
                        : "",
                  }}
                >
                  <div
                    className={
                      focusedCell.row === rowIndex &&
                      focusedCell.col === colIndex
                        ? "focused"
                        : ""
                    }
                    onClick={() => {
                      handleFocus(rowIndex, colIndex);
                    }}
                    style={{
                      minWidth: col.minWidth,
                      minHeight: 30,
                      padding: "0 5px",
                      boxSizing: "border-box",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {col.render ? (
                      <div
                        style={{ flexGrow: 1 }}
                        id={`${idPrefix}-${rowIndex}-${colIndex}`}
                      >
                        {col.render(
                          row,
                          rowIndex,
                          colIndex,
                          rows,
                          disabled || rowDisabled(row),
                          focusedCell.row == rowIndex &&
                            focusedCell.col == colIndex,
                          columns,
                          idPrefix
                        )}
                      </div>
                    ) : disabled ? (
                      <div
                        style={{ flexGrow: 1 }}
                        id={`${idPrefix}-${rowIndex}-${colIndex}`}
                      >
                        {row[col.name]}
                      </div>
                    ) : col.type == "select" ? (
                      <>
                        <div
                          style={{ flexGrow: 1 }}
                          id={`${idPrefix}-${rowIndex}-${colIndex}`}
                        >
                          {focusedCell.row == rowIndex &&
                          focusedCell.col == colIndex ? (
                            <>
                              {col.selectType === "async" ? (
                                <AsyncSelect
                                  loadOptions={(
                                    inputValue: string,
                                    callBack: any
                                  ) =>
                                    loadOptions(
                                      col.selectOptions(row),
                                      inputValue,
                                      callBack
                                    )
                                  }
                                  defaultOptions
                                  isClearable
                                  filterOption={createFilter({
                                    ignoreAccents: false,
                                  })}
                                  isDisabled={
                                    col.disabled
                                      ? col.disabled(row)
                                      : rowDisabled(row) || disabled
                                  }
                                  value={{
                                    label: row[col.name],
                                    value: row[col.name],
                                  }}
                                  onChange={(x: any) => {
                                    handleBlur(x, rowIndex, col, "select");
                                  }}
                                />
                              ) : col.selectType === "creatable" ? (
                                <CreatableSelect
                                  value={{
                                    label: row[col.name],
                                    value: row[col.name],
                                  }}
                                  // isDisabled={isDisabled || row.type == 'single'}
                                  isDisabled={
                                    col.disabled
                                      ? col.disabled(row)
                                      : rowDisabled(row) || disabled
                                  }
                                  onChange={(x: any) => {
                                    handleBlur(x, rowIndex, col, "select");
                                  }}
                                  id={`gridcell-${rowIndex}-${colIndex}`}
                                  isClearable
                                  options={col.selectOptions(row)}
                                />
                              ) : (
                                <Select
                                  value={{
                                    label: row[col.name],
                                    value: row[col.name],
                                  }}
                                  options={col.selectOptions(row)}
                                  // placeholder="Search By Name / SKU"
                                  classNamePrefix="select"
                                  isSearchable
                                  isClearable
                                  isDisabled={
                                    col.disabled
                                      ? col.disabled(row)
                                      : rowDisabled(row) || disabled
                                  }
                                  onChange={(x: any) => {
                                    handleBlur(x, rowIndex, col, "select");
                                  }}
                                />
                              )}
                            </>
                          ) : (
                            row[col.name]
                          )}
                        </div>
                      </>
                    ) : (
                      <input
                        autoComplete="off"
                        style={col.style ? col.style(row, disabled) : {}}
                        value={row[col.name] || ""}
                        disabled={
                          col.disabled
                            ? col.disabled(row)
                            : rowDisabled(row) || disabled
                        }
                        id={`${idPrefix}-${rowIndex}-${colIndex}`}
                        onFocusCapture={(e) => {
                          e.target.select();
                        }}
                        onChange={(e) => {
                          e.preventDefault();

                          handleTableDataChange(
                            rowIndex,
                            col.name,
                            e.target.value
                          );
                        }}
                        onBlur={(e) =>
                          handleBlur(e.target.value, rowIndex, col)
                        }
                        ref={
                          focusedCell.row === rowIndex &&
                          focusedCell.col === colIndex
                            ? inputRef
                            : null
                        }
                        onFocus={() => handleFocus(rowIndex, colIndex)}
                        type={col.columnType === "date" ? "date" : "text"}
                        // type="text"
                      />
                    )}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MMMGrid;
