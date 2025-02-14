import Link from 'next/link';
import { useChainId } from '../hooks/useChainId';
import { IService, IUser, ServiceStatusEnum } from '../types';
import { renderTokenAmountFromConfig } from '../utils/conversion';
import { formatDate } from '../utils/dates';
import ServiceStatus from './ServiceStatus';

function UserServiceItem({ user, service }: { user: IUser; service: IService }) {
  const chainId = useChainId();

  const isBuyer = user?.id === service.buyer.id;

  return (
    <div className='flex flex-row gap-2 rounded-xl p-4 border border-info text-base-content bg-base-100'>
      <div className='flex flex-col items-top justify-between gap-4 w-full'>
        <div className='flex flex-col justify-start items-start gap-4 relative'>
          <div className='flex items-center justify-start'>
            <img
              src={
                service?.buyer?.description?.image_url ||
                `/images/default-avatar-${Number(service.buyer.id) % 9}.jpeg`
              }
              className='w-10 mr-4 rounded-full'
              width={50}
              height={50}
              alt='default avatar'
            />
            <div className='flex flex-col'>
              <p className='text-base-content font-medium break-all'>
                {service.description?.title}
              </p>
              <p className='text-xs text-base-content opacity-50'>
                created by {service.buyer.handle} the {formatDate(Number(service.createdAt) * 1000)}
              </p>
            </div>
            <span className='absolute right-0 inline-flex items-center'>
              <ServiceStatus status={service.status} />
            </span>
          </div>

          <div className=' border-t border-info pt-4'>
            <div>
              {service.description?.keywords_raw?.split(',').map((keyword, i) => (
                <span
                  key={i}
                  className='inline-block bg-info rounded-full px-2 py-1 text-xs font-semibold text-base-content mr-2 mb-2'>
                  {keyword}
                </span>
              ))}
            </div>
            <p className='text-sm text-base-content  line-clamp-1 mt-4'>
              <strong>About:</strong> {service.description?.about}
            </p>
          </div>
        </div>

        <div className='flex flex-row gap-4 justify-between items-center border-t border-info pt-4'>
          {service.description?.rateToken && service.description?.rateAmount && (
            <p className='text-base-content font-bold line-clamp-1 max-w-[100px]'>
              {renderTokenAmountFromConfig(
                chainId,
                service.description.rateToken,
                service.description.rateAmount,
              )}
            </p>
          )}
          <Link
            className='text-primary bg-primary hover:opacity-70 px-5 py-2.5 rounded-xl text-md relative'
            href={`/work/${service.id}`}>
            show details
            {isBuyer && service.status == ServiceStatusEnum.Opened && (
              <div className='inline-flex absolute -top-2 -right-2 justify-center items-center w-6 h-6 text-xs font-bold text-base-content bg-base-200 rounded-full border-2 border-white'>
                {service.proposals.length}
              </div>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default UserServiceItem;
