import FilterDrawer from "./FilterDrawer";
import { useSearchParams } from "next/navigation";
import { muscles } from "@/lib/filters";

export default function Filters({ className }: { className: string }) {
    const searchParams = useSearchParams();
    const currentFilters = {
        muscle: searchParams.get("muscle"),
        equipment: searchParams.get("equipment"),
        level: searchParams.get("level"),
    };

    return (
        <div className={className}>
            {/* Filters */}
            <FilterDrawer
                drawerTitle='Muscle Groups'
                drawerDescription='Select muscle groups to filter exercises.'
                options={muscles}
                filterKey={"muscles"}
                allowAnyFilter={true}
                currentFilters={currentFilters}
            />
        </div>
    );
}
