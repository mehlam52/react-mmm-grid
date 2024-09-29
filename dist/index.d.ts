import * as react_jsx_runtime from 'react/jsx-runtime';

type MMMGridColumnProps = {
    name: string;
    title: string;
    minWidth?: number;
    columnType?: "text" | "numeric" | "date";
    decimals?: number;
    hidden?: boolean;
    type?: "select" | "text";
    selectOptions?: (row: any) => {
        label: string;
        value: string;
    }[];
    selectType?: "normal" | "async" | "creatable";
    disabled?: (row: any) => boolean;
    render?: (row: any, rowIndex: number, colIndex: number, rows: any, isDisabled?: boolean, isFocused?: boolean, columns?: any, idPrefix?: string) => JSX.Element;
    style?: (row: any, isDisabled?: boolean) => object;
};
type MMMGridProps = {
    rows: any;
    columns: MMMGridColumnProps[];
    height?: number;
    disabled?: boolean;
    deleteRows?: boolean;
    resetVariable?: any;
    idPrefix?: string;
    handleChange: (rowIndex: number, name: string, value: any, inputType: "select" | "text" | undefined) => void;
    handleDelete?: (rowIndexes: number[]) => void;
    rowDisabled?: (row: any) => boolean;
    setActiveGridRow?: any;
    setSelectedRows?: any;
};
declare const MMMGrid: ({ rows, columns, height, deleteRows, handleChange, handleDelete, disabled, rowDisabled, idPrefix, setActiveGridRow, setSelectedRows, }: MMMGridProps) => react_jsx_runtime.JSX.Element;

export { type MMMGridColumnProps, MMMGrid as default };
