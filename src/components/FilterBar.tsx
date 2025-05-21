
import { useEffect, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { FilterType } from '@/types';
import { RefreshCw } from 'lucide-react';

interface FilterBarProps {
  formateurOptions: string[];
  groupeOptions: string[];
  salleOptions: string[];
  onFilterChange: (type: FilterType, value: string) => void;
  onClearFilter: (type: FilterType) => void;
  onRefresh: () => void;
  filters: Record<string, string>;
  isLoading?: boolean;
}

const FilterBar = ({
  formateurOptions,
  groupeOptions,
  salleOptions,
  onFilterChange,
  onClearFilter,
  onRefresh,
  filters,
  isLoading = false,
}: FilterBarProps) => {
  
  const sortedFormateurOptions = useMemo(() => 
    [...formateurOptions].sort(), [formateurOptions]
  );

  const sortedGroupeOptions = useMemo(() => 
    [...groupeOptions].sort(), [groupeOptions]
  );

  const sortedSalleOptions = useMemo(() => 
    [...salleOptions].sort(), [salleOptions]
  );
  
  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-white border-b">
      <div className="flex flex-col gap-1">
        <label htmlFor="formateur-filter" className="text-sm font-medium">
          Teacher
        </label>
        <Select
          value={filters.formateur || ''}
          onValueChange={(value) => 
            value ? onFilterChange('formateur', value) : onClearFilter('formateur')
          }
        >
          <SelectTrigger id="formateur-filter" className="w-[200px]">
            <SelectValue placeholder="All Teachers" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Teachers</SelectItem>
            {sortedFormateurOptions.map((formateur) => (
              <SelectItem key={formateur} value={formateur}>
                {formateur}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="groupe-filter" className="text-sm font-medium">
          Group
        </label>
        <Select
          value={filters.groupe || ''}
          onValueChange={(value) => 
            value ? onFilterChange('groupe', value) : onClearFilter('groupe')
          }
        >
          <SelectTrigger id="groupe-filter" className="w-[200px]">
            <SelectValue placeholder="All Groups" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Groups</SelectItem>
            {sortedGroupeOptions.map((groupe) => (
              <SelectItem key={groupe} value={groupe}>
                {groupe}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="salle-filter" className="text-sm font-medium">
          Room
        </label>
        <Select
          value={filters.salle || ''}
          onValueChange={(value) => 
            value ? onFilterChange('salle', value) : onClearFilter('salle')
          }
        >
          <SelectTrigger id="salle-filter" className="w-[200px]">
            <SelectValue placeholder="All Rooms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Rooms</SelectItem>
            {sortedSalleOptions.map((salle) => (
              <SelectItem key={salle} value={salle}>
                {salle}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-end">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onRefresh} 
          disabled={isLoading}
          className="h-10 w-10"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="sr-only">Refresh</span>
        </Button>
      </div>
    </div>
  );
};

export default FilterBar;
