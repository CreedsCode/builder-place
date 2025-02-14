import { CheckCircleIcon } from '@heroicons/react/24/outline';

function ToastStep({
  status,
  title,
  children,
}: {
  status: string;
  title: string;
  children: (() => JSX.Element) | null;
}) {
  return (
    <li>
      {status === 'complete' ? (
        <div className='group'>
          <span className='flex items-start flex-wrap'>
            <span className='relative flex h-5 w-5 flex-shrink-0 items-center justify-center'>
              <CheckCircleIcon className='h-full w-full text-content group-hover:text-content' />
            </span>
            <span className='ml-3 text-sm font-medium text-base-content opacity-50 group-hover:text-base-content'>
              {title}
            </span>
          </span>
          <>{children && children()}</>
        </div>
      ) : status === 'current' ? (
        <div className='flex items-start flex-wrap'>
          <span className='relative flex h-5 w-5 flex-shrink-0 items-center justify-center '>
            <span className='animate-ping absolute h-4 w-4 rounded-full bg-zinc-200' />
            <span className='relative block h-2 w-2 rounded-full bg-zinc-600' />
          </span>
          <span className='ml-3 text-sm font-medium text-content'>{title}</span>
          <>{children && children()}</>
        </div>
      ) : (
        <div className='group'>
          <div className='flex items-start flex-wrap'>
            <div className='relative flex h-5 w-5 flex-shrink-0 items-center justify-center'>
              <div className='h-2 w-2 rounded-full bg-gray-300 group-hover:bg-gray-400' />
            </div>
            <p className='ml-3 text-sm font-medium text-base-content opacity-50 group-hover:text-base-content'>
              {title}
            </p>
          </div>
          <>{children && children()}</>
        </div>
      )}
    </li>
  );
}

export default ToastStep;
