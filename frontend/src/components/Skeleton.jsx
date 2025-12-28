const Skeleton = ({ className }) => (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-800 rounded-xl ${className}`}></div>
)

export const DashboardSkeleton = () => {
    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-10" />
                </div>
            </div>

            {/* Cards Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
            </div>

            {/* Content Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Skeleton className="col-span-1 md:col-span-2 h-64 sticky" />
                <Skeleton className="h-64" />
            </div>
        </div>
    )
}

export default Skeleton
