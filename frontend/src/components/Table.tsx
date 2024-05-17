import { Fragment, useState } from 'react';
import DOMPurify from 'dompurify';
import Modal from './Modal';
import {TableProps, MarkupObject} from '../interface/table'

function createMarkup(dirty: string): MarkupObject {
    return { __html: DOMPurify.sanitize(dirty) };
}



function Table<T>({ data, config, keyFn }: TableProps<T>) {

    const [showModalIndex, setShowModalIndex] = useState(null);

    const handleClick = (index: any) => {
        setShowModalIndex(index);
    };

    const handleClose = () => {
        setShowModalIndex(null);
    };


    const renderedHeaders = config.map((column) => {
        if (column.header) {

            return <Fragment key={column.label}>{column.header()}</Fragment>;
        }
        return <th key={column.label}>{column.label}</th>;
    });

    const renderedRows = data.map((rowData: any, index) => {
        const renderedCells = config.map((column) => {

            if (column.label == 'post_title') {

                return (
                    <td className="p-2" key={column.label}>
                        {/* {column.render(rowData)} */}

                        <div key={index}>
                            <div className="bg-blue-500 text-white font-bold py-2 px-4 rounded w-full" onClick={() => handleClick(index)}>
                                {rowData['post_title']}
                            </div>
                            {showModalIndex === index && (
                                <Modal onClose={handleClose} actionBar={null}>
                                    <p dangerouslySetInnerHTML={createMarkup(rowData['post_content'])} />
                                </Modal>
                            )}
                        </div>

                    </td>
                );

            }

            return (
                <td className="p-2" key={column.label}>
                    {column.render(rowData)}
                </td>
            );
        });

        return (
            <tr className="border-b" key={keyFn(rowData)}>
                {renderedCells}
            </tr>
        );
    });

    return (
        <table className="table-auto border-spacing-2">
            <thead>
                <tr className="border-b-2">{renderedHeaders}</tr>
            </thead>
            <tbody>{renderedRows}</tbody>
        </table>
    );
}

export default Table;
