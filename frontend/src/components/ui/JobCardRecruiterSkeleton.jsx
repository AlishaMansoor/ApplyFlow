import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const JobCardRecruiterSkeleton = () => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4 sm:mb-6">
        <div className="p-4 sm:p-6">
            {/* Title row + status pill */}
            <div className="flex justify-between items-start mb-1 gap-2">
                <Skeleton width="45%" height={18} className="sm:!h-6" />
                <Skeleton width={55} height={22} borderRadius={12} className="sm:!w-[65px] sm:!h-6" />
            </div>

            {/* Posted date */}
            <Skeleton width={110} height={12} style={{ marginTop: 4 }} className="sm:!w-[140px] sm:!h-[14px]" />

            <div className="border-t border-gray-100 my-3 sm:my-4" />

            {/* Type + salary + experience pills */}
            <div className="flex gap-2 flex-wrap">
                <Skeleton width={55} height={22} borderRadius={12} className="sm:!w-[70px] sm:!h-[26px]" />
                <Skeleton width={80} height={22} borderRadius={12} className="sm:!w-[95px] sm:!h-[26px]" />
                <Skeleton width={75} height={22} borderRadius={12} className="sm:!w-[90px] sm:!h-[26px]" />
            </div>

            {/* Skills label + pills */}
            <div className="mt-3 sm:mt-4">
                <Skeleton width={50} height={14} className="sm:!w-[60px] sm:!h-4" />
                <div className="flex gap-2 mt-2 flex-wrap">
                    <Skeleton width={55} height={20} borderRadius={10} className="sm:!w-[65px] sm:!h-6" />
                    <Skeleton width={40} height={20} borderRadius={10} className="sm:!w-[45px] sm:!h-6" />
                    <Skeleton width={45} height={20} borderRadius={10} className="sm:!w-[50px] sm:!h-6" />
                </div>
            </div>

            {/* Applicants pill */}
            <div className="mt-3 sm:mt-4">
                <Skeleton width={90} height={26} borderRadius={14} className="sm:!w-[110px] sm:!h-8" />
            </div>
        </div>

        {/* Footer bar — Edit / Delete */}
        <div className="bg-gray-100 px-4 sm:px-6 py-3 sm:py-4 flex justify-end gap-2 sm:gap-3">
            <Skeleton width={65} height={30} borderRadius={16} className="sm:!w-20 sm:!h-9" />
            <Skeleton width={70} height={30} borderRadius={16} className="sm:!w-[85px] sm:!h-9" />
        </div>
    </div>
);

export default JobCardRecruiterSkeleton;