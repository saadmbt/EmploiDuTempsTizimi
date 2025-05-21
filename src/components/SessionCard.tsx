
import { useDrag } from 'react-dnd';
import { Session } from '../types';
import { cn } from '@/lib/utils';

interface SessionCardProps {
  session: Session;
  isCompact?: boolean;
}

const SessionCard = ({ session, isCompact = false }: SessionCardProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'SESSION',
    item: session,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // Generate consistent color based on module name
  const generateColor = (name: string) => {
    const colors = [
      'bg-blue-100 border-blue-300',
      'bg-green-100 border-green-300',
      'bg-yellow-100 border-yellow-300',
      'bg-purple-100 border-purple-300',
      'bg-pink-100 border-pink-300',
      'bg-indigo-100 border-indigo-300',
      'bg-orange-100 border-orange-300',
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div
      ref={drag}
      className={cn(
        'rounded-md border p-2 shadow-sm cursor-move transition-all',
        generateColor(session.module),
        isDragging ? 'opacity-50' : 'opacity-100',
        isCompact ? 'text-xs' : 'text-sm'
      )}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="font-medium truncate">{session.module}</div>
      <div className="text-gray-700 truncate">{session.groupe}</div>
      <div className="text-gray-500 truncate">{session.salle}</div>
      {!isCompact && (
        <div className="text-gray-500 truncate pt-1 text-xs">{session.formateur}</div>
      )}
    </div>
  );
};

export default SessionCard;
