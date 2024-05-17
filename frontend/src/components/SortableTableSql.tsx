


import { useState, useEffect } from 'react';
import { SlArrowDown, SlArrowUp } from 'react-icons/sl';
import Table from './Table';

import {SortField, SortableTableProps} from '../interface/sortabletablesql'



function SortableTable<T>({ sortPost, data_, config, keyFn }: SortableTableProps<T>) {
  // const [data, setData] = useState<Fruit[]>([]);
  const [sortFields, setSortFields] = useState<SortField[]>([]);

  const fetchData = async () => {


    const sortFieldsUpper = sortFields.map(field => ({
      order: field.order.toUpperCase(),
      field:field.field,
  }));

    if(sortFields.length !=0){
      try{
        await sortPost(sortFieldsUpper)
      }catch(e){
        console.log("sort tabel", e);
        
      }
    }


    

    


  };

  useEffect(() => {

    fetchData();
  }, [sortFields]);

  const handleClick = (label: string) => {
    setSortFields((prevSortFields) => {
      const existingFieldIndex = prevSortFields.findIndex((sf) => sf.field === label);

      if (existingFieldIndex === -1) {
        return [...prevSortFields, { field: label, order: 'asc' }];
      }

      const existingField = prevSortFields[existingFieldIndex];
      if (existingField.order === 'asc') {
        const updatedFields = [...prevSortFields];
        updatedFields[existingFieldIndex].order = 'desc';
        return updatedFields;
      } else {
        return prevSortFields.filter((sf) => sf.field !== label);
      }
    });
  };

  const updatedConfig = config.map((column) => {
    if (!column.sortValue) {
      return column;
    }

    return {
      ...column,
      header: () => (
        <th
          className="cursor-pointer hover:bg-gray-100"
          onClick={() => handleClick(column.label)}
        >
          <div className="flex items-center">
            {getIcons(column.label, sortFields)}
            {column.label}
          </div>
        </th>
      ),
    };
  });

  return <Table data={data_ as any} config={updatedConfig} keyFn={keyFn} />;



}

function getIcons(label: string, sortFields: SortField[]) {
  const sortField = sortFields.find((sf) => sf.field === label);

  if (!sortField) {
    return (
      <div>
        <SlArrowUp />
        <SlArrowDown />
      </div>
    );
  }

  if (sortField.order === 'asc') {
    return (
      <div>
        <SlArrowUp />
      </div>
    );
  } else if (sortField.order === 'desc') {
    return (
      <div>
        <SlArrowDown />
      </div>
    );
  }
}

export default SortableTable;
