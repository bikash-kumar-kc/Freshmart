type PaginationSkeletonProps = {
  count?: number;
};

const PaginationSkeleton = ({ count = 3 }: PaginationSkeletonProps) => {
  return (
    <div className="relative m-auto w-full max-w-7xl px-4 py-4 lg:px-0">
      <div className="mt-8 flex w-full flex-row items-center justify-center sm:mt-12">
        <div className="flex gap-3 sm:gap-4">
          {Array.from({ length: count }).map((_, index) => (
            <div key={index} className="skeleton h-10 w-10 rounded-sm" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaginationSkeleton;