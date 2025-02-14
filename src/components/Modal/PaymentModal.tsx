import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { renderTokenAmount } from '../../utils/conversion';
import { IPayment, IService, PaymentTypeEnum, ServiceStatusEnum } from '../../types';
import ReleaseForm from '../Form/ReleaseForm';
import { useNetwork } from 'wagmi';

interface IPaymentModalProps {
  service: IService;
  payments: IPayment[];
  isBuyer: boolean;
}

function PaymentModal({ service, payments, isBuyer }: IPaymentModalProps) {
  const [show, setShow] = useState(false);
  const rateToken = service.validatedProposal[0].rateToken;
  const rateAmount = service.validatedProposal[0].rateAmount;
  const network = useNetwork();

  const totalPayments = payments.reduce((acc, payment) => {
    return acc + BigInt(payment.amount);
  }, BigInt('0'));

  const totalInEscrow = BigInt(rateAmount) - totalPayments;

  return (
    <>
      <button
        onClick={() => setShow(true)}
        className={`block ${
          (service.status === ServiceStatusEnum.Confirmed && !isBuyer) ||
          service.status === ServiceStatusEnum.Finished
            ? 'text-success bg-success hover:bg-info'
            : 'text-content bg-zinc-50 hover:bg-zinc-500'
        } hover:text-base-content rounded-xl px-5 py-2.5 text-center`}
        type='button'
        data-modal-toggle='defaultModal'>
        {service.status === ServiceStatusEnum.Finished
          ? 'Payment summary'
          : service.status === ServiceStatusEnum.Confirmed && !isBuyer
          ? 'Reimburse payment'
          : 'Release payment'}
      </button>

      <div
        className={`${
          !show ? 'hidden' : ''
        } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal h-full bg-black/75 flex flex-col items-center justify-center`}>
        <div className='relative p-4 w-full max-w-2xl h-auto'>
          <div className='relative bg-base-300 rounded-xl shadow '>
            <div className='flex justify-between items-start p-4 rounded-t border-b border-info'>
              <h3 className='text-xl font-semibold text-base-content '>
                {service.status === ServiceStatusEnum.Confirmed
                  ? 'Release payment'
                  : 'Payment summary'}
              </h3>
              <button
                onClick={() => setShow(false)}
                type='button'
                className='text-base-content bg-transparent hover:bg-base-200 hover:text-base-content rounded-xl text-sm p-1.5 ml-auto inline-flex items-center '
                data-modal-toggle='defaultModal'>
                <svg
                  className='w-5 h-5'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                  xmlns='http://www.w3.org/2000/svg'>
                  <path
                    fillRule='evenodd'
                    d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                    clipRule='evenodd'></path>
                </svg>
                <span className='sr-only'>Close modal</span>
              </button>
            </div>
            <div className='p-6 space-y-6'>
              <div className='flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-base-200 space-y-6 text-base-content'>
                {service.status === ServiceStatusEnum.Confirmed && (
                  <h3 className='text-xl font-semibold leading-5 text-base-content'>
                    Payments summary
                  </h3>
                )}
                <div className='flex justify-center items-center w-full space-y-4 flex-col border-info border-b pb-4'>
                  <div className='flex justify-between w-full'>
                    <p className='text-base-content leading-4 text-base-content'>Rate</p>
                    <p className='text-base-content  leading-4 text-base-content'>
                      {renderTokenAmount(rateToken, rateAmount)}
                    </p>
                  </div>
                  {payments.map((payment, index) => (
                    <div key={index} className='flex justify-between w-full'>
                      <p className='text-base-content leading-4 text-base-content'>
                        <a
                          className='flex'
                          href={`${network.chain?.blockExplorers?.default.url}/tx/${payment.transactionHash}`}
                          target='_blank'>
                          {payment.paymentType == PaymentTypeEnum.Release
                            ? 'Realease'
                            : 'Reimburse'}
                          <ArrowTopRightOnSquareIcon className='ml-2 w-4 h-4' />
                        </a>
                      </p>
                      <p className='text-base-content  leading-4 text-base-content'>
                        -{renderTokenAmount(rateToken, payment.amount)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className='flex justify-between items-center w-full'>
                  <p className='text-base-content font-semibold leading-4 text-base-content'>
                    Total in the escrow
                  </p>
                  <p className='text-base-content  font-semibold leading-4 text-base-content'>
                    {renderTokenAmount(rateToken, totalInEscrow.toString())}
                  </p>
                </div>
              </div>
              {totalInEscrow == BigInt(0) && (
                <div className='p-4 mb-4 text-sm text-success bg-success rounded'>
                  All payments have been released
                </div>
              )}
            </div>

            {totalInEscrow > 0 && show && (
              <ReleaseForm
                totalInEscrow={totalInEscrow}
                rateToken={rateToken}
                service={service}
                isBuyer={isBuyer}
                closeModal={() => setShow(false)}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default PaymentModal;
