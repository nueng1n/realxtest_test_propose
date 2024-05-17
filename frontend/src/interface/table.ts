export interface MarkupObject {
    __html: string;
}

export interface ColumnConfig<T> {
    label: string;
    render: (row: T) => React.ReactNode;
    header?: () => React.ReactNode;
}

export interface TableProps<T> {
    data: T[];
    config: ColumnConfig<T>[];
    keyFn: (row: T) => string;
}