import { useMemo } from 'react';
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
    [...formateurOptions]
      .filter(formateur => formateur && formateur.trim() !== '')
      .sort()
  , [formateurOptions]);

  const sortedGroupeOptions = useMemo(() => 
    [...groupeOptions]
      .filter(groupe => groupe && groupe.trim() !== '')
      .sort()
  , [groupeOptions]);

  const sortedSalleOptions = useMemo(() => 
    [...salleOptions]
      .filter(salle => salle && salle.trim() !== '')
      .sort()
  , [salleOptions]);
  
  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-white border-b">
      <div className="flex flex-col gap-1">
        <label htmlFor="formateur-filter" className="text-sm font-medium">
          Formateur
        </label>
        <Select
          value={filters.formateur || ''}
          onValueChange={(value) => 
            value === '_all' ? onClearFilter('formateur') : onFilterChange('formateur', value)
          }
        >
          <SelectTrigger id="formateur-filter" className="w-[200px]">
            <SelectValue placeholder="Tous les Formateurs" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_all">Tous les Formateurs</SelectItem>
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
          Groupe
        </label>
        <Select
          value={filters.groupe || ''}
          onValueChange={(value) => 
            value === '_all' ? onClearFilter('groupe') : onFilterChange('groupe', value)
          }
        >
          <SelectTrigger id="groupe-filter" className="w-[200px]">
            <SelectValue placeholder="Tous les Groupes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_all">Tous les Groupes</SelectItem>
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
          Salle
        </label>
        <Select
          value={filters.salle || ''}
          onValueChange={(value) => 
            value === '_all' ? onClearFilter('salle') : onFilterChange('salle', value)
          }
        >
          <SelectTrigger id="salle-filter" className="w-[200px]">
            <SelectValue placeholder="Toutes les Salles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_all">Toutes les Salles</SelectItem>
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
          <span className="sr-only">Actualiser</span>
        </Button>
      </div>
    </div>
  );
};

export default FilterBar;
