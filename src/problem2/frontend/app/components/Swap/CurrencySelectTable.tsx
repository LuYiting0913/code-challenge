import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
} from "@nextui-org/react";


const columns = ["currency"];
const headerColumns = ["currency"];
interface CurrencySelectTableProps {
  currencies : string[];
  onSelect: (currency : string) => void;
}
const CurrencySelectTable = (props : CurrencySelectTableProps) => {
  const currencies = props.currencies;
  const onSelect = props.onSelect;
  const [filterValue, setFilterValue] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "price",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = React.useMemo(() => {
    let filteredCurrencies = [...currencies];

    if (hasSearchFilter) {
      filteredCurrencies = filteredCurrencies.filter((curr) =>
        curr.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    // if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
    //   filteredCurrencies = filteredCurrencies.filter((curr) =>
    //     Array.from(statusFilter).includes(user.status),
    //   );
    // }

    return filteredCurrencies;
    // return currencies;
  }, [currencies, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);


  const renderCell = React.useCallback((cellValue : string) => {
    return (<div>{cellValue}</div>)
  }, []);


  const onRowsPerPageChange = React.useCallback((e : any) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value : string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(()=>{
    setFilterValue("")
    setPage(1)
  },[])

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by currency name..."
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {currencies.length} currencies</span>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    onRowsPerPageChange,
    currencies.length,
    onSearchChange,
    hasSearchFilter,
  ]);


  return (
    <Table
      aria-label="currency-selection-table"
      isHeaderSticky
      classNames={{
        wrapper: "max-h-[382px]",
      }}
      color="success"
      selectionMode="single"
      topContent={topContent}
      topContentPlacement="outside"
    >
      <TableHeader columns={headerColumns}>
        {columns.map((column) => (
          <TableColumn
            key={column}
            align="center"
          >
            {column}
          </TableColumn>
        ))}

      </TableHeader>
      <TableBody emptyContent={"No currencies found"} items={filteredItems}>
        {
          filteredItems.map((item, index) => (
            <TableRow key={index} onClick={() => onSelect(item)}>
              <TableCell>{renderCell(item)}</TableCell>

            </TableRow>
          ))
        }
      </TableBody>
    </Table>
  );
}

export default CurrencySelectTable;