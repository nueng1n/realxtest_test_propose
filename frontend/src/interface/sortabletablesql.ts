export interface ColumnConfig<T> {
    label: string;
    render: (row: T) => React.ReactNode;
    sortValue?: (row: T) => string | number;
    header?: () => React.ReactNode;
  }
  
export  interface SortableTableProps<T> {
    sortPost:any;
    data_ :any;
    config: ColumnConfig<T>[];
    keyFn: (row: T) => string;
  }
  
export  interface SortField {
    field: string;
    order: 'asc' | 'desc';
  }
  