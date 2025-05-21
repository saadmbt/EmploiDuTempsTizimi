import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ScheduleGrid from '../components/ScheduleGrid';
import FilterBar from '../components/FilterBar';
import { useSchedule } from '../hooks/useSchedule';
import { FilterType } from '../types';
import { useToast } from '../components/ui/use-toast';

const Index = () => {
  const {
    sessions,
    loading,
    error,
    hasConflict,
    updateSession,
    fetchData,
    uniqueFormateurValues,
    uniqueGroupeValues,
    uniqueSalleValues,
    filters,
    addFilter,
    removeFilter,
  } = useSchedule();

  const { toast } = useToast();

  // Convert filters array to Record<string, string> for FilterBar
  const filtersRecord: Record<string, string> = {};
  filters.forEach(filter => {
    filtersRecord[filter.type] = filter.value;
  });

  const handleFilterChange = (type: FilterType, value: string) => {
    addFilter({ type, value });
  };

  const handleClearFilter = (type: FilterType) => {
    removeFilter(type);
  };

  const handleRefresh = () => {
    fetchData();
    toast({
      title: 'Schedule refreshed',
      description: 'The latest schedule data has been loaded.',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b p-4 shadow-sm">
        <h1 className="text-2xl font-bold">Session Grid Harmonizer</h1>
        <p className="text-gray-500">Manage and organize teaching sessions with ease</p>
      </header>

      <main className="container mx-auto py-6 px-4">
        <FilterBar
          formateurOptions={uniqueFormateurValues}
          groupeOptions={uniqueGroupeValues}
          salleOptions={uniqueSalleValues}
          onFilterChange={handleFilterChange}
          onClearFilter={handleClearFilter}
          onRefresh={handleRefresh}
          filters={filtersRecord}
          isLoading={loading}
        />

        {error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-md my-4">
            {error}
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="bg-white rounded-md shadow-sm mt-6">
            <DndProvider backend={HTML5Backend}>
              <ScheduleGrid
                sessions={sessions}
                hasConflict={hasConflict}
                updateSession={updateSession}
                rooms={uniqueSalleValues}
                isLoading={loading}
              />
            </DndProvider>
          </div>
        )}
      </main>

      <footer className="mt-12 py-4 bg-gray-100 border-t text-center text-gray-600 text-sm">
        Session Grid Harmonizer &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default Index;
