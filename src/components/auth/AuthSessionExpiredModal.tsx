import React from 'react';
import { Button } from '../ui/Button';

interface Props {
  onClick: () => void
}

export const AuthSessionExpiredModal = (props: Props) => {
  return (
    <>
      <div className="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
          <div className="fixed inset-0 bg-gray-400 bg-opacity-90 transition-opacity" aria-hidden="true" />

          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
							&#8203;
						</span>

          <div className="inline-block bg-white px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
            <div className="mt-3 text-center sm:mt-5">
              Your session has expired!
              <br /> Please sign in again.
            </div>

            <div className="mt-5 sm:mt-6 text-center w-full">
              <Button onClick={props.onClick}>
                OK
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}