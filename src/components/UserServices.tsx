import { useContext } from 'react';
import useServices from '../hooks/useServices';
import { IUser } from '../types';
import UserServiceItem from './UserServiceItem';
import BuilderPlaceContext from '../modules/BuilderPlace/context/BuilderPlaceContext';
import Notification from './Notification';
import Loading from './Loading';
import ServiceItem from './ServiceItem';

interface IProps {
  user: IUser;
  type: 'buyer' | 'seller';
}

function UserServices({ user, type }: IProps) {
  const { builderPlace, isBuilderPlaceOwner } = useContext(BuilderPlaceContext);

  const { services, loading } = useServices(
    undefined,
    builderPlace?.ownerTalentLayerId || undefined,
    type == 'seller' ? user.id : undefined,
  );

  if (loading) {
    return <Loading />;
  }

  if (services.length === 0) {
    if (isBuilderPlaceOwner && type == 'buyer') {
      return (
        <>
          <h2 className='pb-4 text-base font-bold break-all'>projects posted</h2>
          <Notification
            title='post your first project!'
            text='post something your team needs help with'
            link='/work/create'
            linkText='post a project'
            color='primary'
            imageUrl={
              user?.description?.image_url
                ? user?.description?.image_url
                : `/images/default-avatar-${Number(user?.id ? user.id : '1') % 9}.jpeg`
            }
          />
        </>
      );
    } else {
      return null;
    }
  }

  return (
    <>
      <h2 className='pb-4 text-base font-bold break-all'>
        {type == 'buyer' ? 'my posts' : 'posts applied to'}
      </h2>
      <div className='grid grid-cols-1 gap-4'>
        {services.map((service, i) => {
          return <ServiceItem service={service} key={i} />;
        })}
      </div>

      {services.length === 20 && (
        <a
          href='#'
          className='px-5 py-2  border border-zinc-600 rounded-full text-content hover:text-base hover:bg-base-200'>
          Load More
        </a>
      )}
    </>
  );
}

export default UserServices;
