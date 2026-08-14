import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const JobCardSkeleton = () => (
    <div className="bg-slate-50 mt-2 rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4 sm:mb-6">
        <div className="p-4 sm:p-6">
            {/* Title row + location */}
            <div className="flex justify-between items-start mb-1 gap-2">
                <div className="w-3/5">
                    <Skeleton width="80%" height={18} className="sm:!h-6" />
                    <Skeleton width="50%" height={14} style={{ marginTop: 6 }} className="sm:!h-4" />
                </div>
                <Skeleton width={60} height={16} className="sm:!w-20 sm:!h-[18px]" />
            </div>

            <div className="border-t border-gray-100 my-3 sm:my-4" />

            {/* Posted date */}
            <Skeleton width={110} height={12} className="sm:!w-[140px] sm:!h-[14px]" />

            {/* Type + salary pills */}
            <div className="flex gap-2 mt-2 sm:mt-3 flex-wrap">
                <Skeleton width={60} height={22} borderRadius={12} className="sm:!w-[70px] sm:!h-[26px]" />
                <Skeleton width={95} height={22} borderRadius={12} className="sm:!w-[110px] sm:!h-[26px]" />
            </div>

            {/* Skills label + pills */}
            <div className="mt-3 sm:mt-4">
                <Skeleton width={50} height={14} className="sm:!w-[60px] sm:!h-4" />
                <div className="flex gap-2 mt-2 flex-wrap">
                    <Skeleton width={50} height={20} borderRadius={10} className="sm:!w-[60px] sm:!h-6" />
                    <Skeleton width={45} height={20} borderRadius={10} className="sm:!w-[50px] sm:!h-6" />
                    <Skeleton width={55} height={20} borderRadius={10} className="sm:!w-[65px] sm:!h-6" />
                    <Skeleton width={48} height={20} borderRadius={10} className="sm:!w-[55px] sm:!h-6" />
                    <Skeleton width={40} height={20} borderRadius={10} className="sm:!w-[45px] sm:!h-6" />
                </div>
            </div>

            {/* Description box */}
            <div className="border border-gray-200 rounded-lg p-3 sm:p-4 mt-3 sm:mt-4">
                <Skeleton width={95} height={14} className="sm:!w-[110px] sm:!h-4" />
                <Skeleton width="90%" height={12} style={{ marginTop: 8 }} className="sm:!h-[14px]" />
            </div>
        </div>

        {/* Footer bar */}
        <div className="bg-gray-100 px-4 sm:px-6 py-3 sm:py-4 flex justify-end gap-2 sm:gap-3">
            <Skeleton width={65} height={30} borderRadius={16} className="sm:!w-20 sm:!h-9" />
            <Skeleton width={65} height={30} borderRadius={16} className="sm:!w-20 sm:!h-9" />
        </div>
    </div>
);

export default JobCardSkeleton;