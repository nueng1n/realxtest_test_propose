export interface Option {
    value: any;
    label: string;
}

export interface DropdownProps {
    options: Option[];
    value: Option | null;
    onChange: (option: Option) => void;
}