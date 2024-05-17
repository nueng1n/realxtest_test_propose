
import { useEffect } from 'react';
import ReactDOM from 'react-dom';
import {ModalProps} from '../interface/modal'

function Modal({ onClose, children, actionBar }: ModalProps) {
  useEffect(() => {
    document.body.classList.add('overflow-hidden');

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);

  const modalContainer = document.querySelector('.modal-container');

  if (!modalContainer) {
   
    return null;
  }

  return ReactDOM.createPortal(
    <div>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-gray-300 opacity-80"
      ></div>
      <div className="fixed inset-40 p-10 bg-white">
        <div className="flex flex-col justify-between h-full">
          {children}
          <div className="flex justify-end">{actionBar}</div>
        </div>
      </div>
    </div>,
    modalContainer
  );
}

export default Modal;
