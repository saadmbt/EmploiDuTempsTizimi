import { useState, useMemo } from 'react';
import { useDrop } from 'react-dnd';
import { useToast } from '@/components/ui/use-toast';
import SessionCard from './SessionCard';
import RoomSelector from './RoomSelector';
import { Session, Cell } from '@/types';
import { cn } from '@/lib/utils';

interface ScheduleGridProps {
  sessions: Session[];
  hasConflict: (session: Session, targetCell: Cell) => Session | null;
  updateSession: (sessionId: string, updates: Partial<Session>) => Promise<boolean>;
  rooms: string[];
  isLoading?: boolean;
}
const ScheduleGrid = ({
  sessions,
  hasConflict,
  updateSession,
  rooms,
  isLoading = false,
}: ScheduleGridProps) => {
  const { toast } = useToast();
  const [roomSelectorOpen, setRoomSelectorOpen] = useState(false);
  const [ListavailableRooms, setListavailableRooms] = useState<string[]>(rooms);
  const [draggedSession, setDraggedSession] = useState<Session | null>(null);
  const [conflictSession, setConflictSession] = useState<Session | null>(null);
  const [targetCell, setTargetCell] = useState<Cell | null>(null);
  
  const days = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  const timeSlots = [
    { id: 1, label: '08h30 - 11h00' },
    { id: 2, label: '11h00 - 13h30' },
    { id: 3, label: '13h30 - 16h00' },
    { id: 4, label: '16h00 - 18h30' },
  ];

  const handleDrop = async (session: Session, day: string, slot: number) => {
    if (session.jour === day && session.creneau === slot) return;
    
    const targetCell = { day, slot };
    const conflict = hasConflict(session, targetCell);
    
    if (conflict) {
      setDraggedSession(session);
      setConflictSession(conflict);
      setTargetCell(targetCell);
      setRoomSelectorOpen(true);
      const availableRooms= sessions.filter(
        s => s.jour === day && s.creneau === slot && s.salle !== conflict.salle
      );
      if (availableRooms.length === 0) {
        toast({
          title: 'Erreur de déplacement',
          description: 'Aucune salle disponible pour cette séance.',
          variant: 'destructive',
        }
      )}
      setListavailableRooms(availableRooms.map(s => s.salle));
      
      return;
    }
    
    const success = await updateSession(session.id, { jour: day, creneau: slot });
    
    if (success) {
      toast({
        title: 'Séance déplacée',
        description: `${session.module} pour ${session.groupe} a été déplacé au ${day}, ${timeSlots.find(t => t.id === slot)?.label}`,
      });
    } else {
      toast({
        title: 'Erreur de déplacement',
        description: 'Une erreur est survenue. Veuillez réessayer.',
        variant: 'destructive',
      });
    }
  };
  
  const handleRoomSelect = async (room: string) => {
    if (!draggedSession || !targetCell) return;
    
    const success = await updateSession(draggedSession.id, { 
      jour: targetCell.day, 
      creneau: targetCell.slot,
      salle: room 
    });
    
    if (success) {
      toast({
        title: 'Salle modifiée',
        description: `${draggedSession.module} pour ${draggedSession.groupe} a été déplacé vers la salle ${room}`,
      });
    } else {
      toast({
        title: 'Erreur de modification',
        description: 'Une erreur est survenue. Veuillez réessayer.',
        variant: 'destructive',
      });
    }
  };

  // Organize sessions by day and time slot for easier rendering
  const sessionsByCell = useMemo(() => {
    const result: Record<string, Record<number, Session[]>> = {};
    
    days.forEach(day => {
      result[day] = {};
      timeSlots.forEach(slot => {
        result[day][slot.id] = [];
      });
    });
    
    sessions.forEach(session => {
      if (result[session.jour] && result[session.jour][session.creneau]) {
        result[session.jour][session.creneau].push(session);
      }
    });
    
    return result;
  }, [sessions]);

  // Determine if we should use the compact view based on screen size or session count
  const [isCompact, setIsCompact] = useState(window.innerWidth < 768);
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="p-3 border"></th>
            {timeSlots.map((slot) => (
              <th key={slot.id} className="p-3 border font-medium text-center">
                {slot.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {days.map((day, dayIndex) => (
            <tr key={day} className={dayIndex % 2 === 0 ? 'bg-gray-50' : ''}>
              <td className="p-3 border font-medium capitalize">{day}</td>
              {timeSlots.map((slot) => {
                const cellSessions = sessionsByCell[day][slot.id];
                
                // Create a drop target for each cell
                const [{ isOver, canDrop }, drop] = useDrop(() => ({
                  accept: 'SESSION',
                  drop: (item: Session) => handleDrop(item, day, slot.id),
                  collect: (monitor) => ({
                    isOver: !!monitor.isOver(),
                    canDrop: !!monitor.canDrop(),
                  }),
                }));
                
                return (
                  <td 
                    ref={drop} 
                    key={`${day}-${slot.id}`} 
                    className={cn(
                      'p-2 border relative min-h-[100px]',
                      isOver && canDrop ? 'bg-blue-50' : '',
                      isOver && !canDrop ? 'bg-red-50' : ''
                    )}
                  >
                    <div className="space-y-2">
                      {cellSessions.map((session) => (
                        <SessionCard 
                          key={session.id} 
                          session={session}
                          isCompact={isCompact || cellSessions.length > 1}
                        />
                      ))}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      
      <RoomSelector
        open={roomSelectorOpen}
        onClose={() => setRoomSelectorOpen(false)}
        session={draggedSession}
        conflictSession={conflictSession}
        rooms={ListavailableRooms}
        onRoomSelect={handleRoomSelect}
      />
    </div>
  );
};

export default ScheduleGrid;
