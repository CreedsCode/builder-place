import { useWeb3Modal } from '@web3modal/react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useContext } from 'react';
import { usePublicClient, useWalletClient } from 'wagmi';
import * as Yup from 'yup';
import TalentLayerContext from '../../context/talentLayer';
import { useChainId } from '../../hooks/useChainId';
import useMintFee from '../../hooks/useMintFee';
import useTalentLayerClient from '../../hooks/useTalentLayerClient';
import { NetworkEnum } from '../../types';
import { createTalentLayerIdTransactionToast, showErrorTransactionToast } from '../../utils/toast';
import HelpPopover from '../HelpPopover';
import { delegateMintID } from '../request';
import { HandlePrice } from './HandlePrice';
import SubmitButton from './SubmitButton';
import Web3MailContext from '../../modules/Web3mail/context/web3mail';
import { createWeb3mailToast } from '../../modules/Web3mail/utils/toast';

interface IFormValues {
  handle: string;
}

function TalentLayerIdForm({ handle, callback }: { handle?: string; callback?: () => void }) {
  const chainId = useChainId();
  const { open: openConnectModal } = useWeb3Modal();
  const { platformHasAccess } = useContext(Web3MailContext);
  const { account, refreshData } = useContext(TalentLayerContext);
  const { data: walletClient } = useWalletClient({ chainId });
  const publicClient = usePublicClient({ chainId });
  const talentLayerClient = useTalentLayerClient();
  const { calculateMintFee } = useMintFee();

  const initialValues: IFormValues = {
    handle: handle || '',
  };

  const validationSchema = Yup.object().shape({
    handle: Yup.string()
      .min(2)
      .max(20)
      .matches(/^[a-z0-9][a-z0-9-_]*$/, 'Only a-z, 0-9 and -_ allowed, and cannot begin with -_')
      .when('isConnected', {
        is: account && account.isConnected,
        then: schema => schema.required('handle is required'),
      }),
  });

  const onSubmit = async (
    submittedValues: IFormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    if (account && account.address && account.isConnected && publicClient && walletClient) {
      try {
        let tx;
        const handlePrice = calculateMintFee(submittedValues.handle);

        if (process.env.NEXT_PUBLIC_ACTIVE_DELEGATE_MINT === 'true') {
          const response = await delegateMintID(
            chainId,
            submittedValues.handle,
            String(handlePrice),
            account.address,
          );
          tx = response.data.transaction;
        } else {
          if (talentLayerClient) {
            tx = await talentLayerClient.profile.create(submittedValues.handle);
          }
        }
        await createTalentLayerIdTransactionToast(
          chainId,
          {
            pending: 'Minting your Talent Layer Id...',
            success: 'Congrats! Your Talent Layer Id is minted',
            error: 'An error occurred while creating your Talent Layer Id',
          },
          publicClient,
          tx,
          account.address,
        );

        if (callback) {
          await callback();
        }

        setSubmitting(false);
        refreshData();
      } catch (error: any) {
        showErrorTransactionToast(error);
      }
    } else {
      openConnectModal();
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      enableReinitialize={true}>
      {({ isSubmitting, values }) => (
        <Form>
          <p className='text-2xl text-center sm:text-4xl font-bold mb-3 mt-6'>
            mint a TalentLayer ID
          </p>
          <p className='text-center mb-8'>
            your TalentLayerID is a work identity that allows ownership and growth of reputation
            across many hiring marketplaces. TalentLayer IDs live inside crypto wallets; this means
            that reputation is self-custodied by the wallet owner and lives separately from
            integrated platforms; meaning you can use it across any integrated platform and retain
            full control of your reputation.
          </p>
          <div className='flex  bg-base-300 py-4 px-4 mb-2 sm:px-0 justify-center items-center flex-row drop-shadow-lg rounded'>
            <div className='px-6 flex flex-row items-center gap-2'>
              <Field
                type='text'
                className='text-base-content opacity-50 py-2 focus:ring-0 outline-none text-sm border-0 rounded-xl h-[40px]'
                placeholder='choose your handle'
                id='handle'
                name='handle'
                required
              />
            </div>

            <div className='flex items-center'>
              {values.handle && chainId != NetworkEnum.IEXEC && (
                <HandlePrice handle={values.handle} />
              )}
              <div>
                <div className='sm:pl-2 sm:pr-4 sm:space-x-4 relative'>
                  <SubmitButton isSubmitting={isSubmitting} />
                  <HelpPopover>
                    <h3 className='font-semibold text-base-content dark:text-base-content'>
                      What is a TalentLayerID?
                    </h3>
                    <p>
                      TalentLayerID is a work identity that allows ownership and growth of
                      reputation across many marketplaces. Anon IDs are ERC-721 NFTs that live
                      inside crypto wallets; this means that reputation is self-custodied by the
                      wallet owner and lives separately from integrated platforms.
                    </p>
                    <h3 className='font-semibold text-base-content dark:text-base-content'>
                      What is the handle?
                    </h3>
                    <p>
                      Your TalentLayerID Handle is a unique string of characters and numbers that
                      you can choose when you create your TalentLayerID. This handle is how others
                      can search for your reputation. You can have a maximum of 10 characters in
                      your TalentLayerID.
                    </p>
                    <a
                      target='_blank'
                      href='https://docs.talentlayer.org/basics/elements/what-is-talentlayer-id'
                      className='flex items-center font-medium text-info dark:text-info dark:hover:text-info hover:text-info'>
                      Read more{' '}
                      <svg
                        className='w-4 h-4 ml-1'
                        aria-hidden='true'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                        xmlns='http://www.w3.org/2000/svg'>
                        <path
                          fillRule='evenodd'
                          d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                          clipRule='evenodd'></path>
                      </svg>
                    </a>
                  </HelpPopover>
                </div>
              </div>
            </div>
          </div>
          <span className='label-text text-alone-error mt-2'>
            <ErrorMessage name='handle' />
          </span>
        </Form>
      )}
    </Formik>
  );
}

export default TalentLayerIdForm;
