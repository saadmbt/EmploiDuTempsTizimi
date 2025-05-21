import { useState } from 'react';
import { Session } from '../types';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RoomSelectorProps {
  open: boolean;
  onClose: () => void;
  session: Session | null;
  conflictSession: Session | null;
  rooms: string[];
  onRoomSelect: (roomId: string) => void;
}

const RoomSelector = ({
  open,
  onClose,
  session,
  conflictSession,
  rooms,
  onRoomSelect,
}: RoomSelectorProps) => {
  const [selectedRoom, setSelectedRoom] = useState<string>('');

  if (!session || !conflictSession) return null;

  const availableRooms = rooms

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Résoudre le conflit de salle</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="text-sm text-red-500">
            Conflit de salle détecté ! La séance "{session.module}" pour {session.groupe} est en conflit avec 
            "{conflictSession.module}" dans la salle {conflictSession.salle}.
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Sélectionnez une autre salle :</p>
            <Select value={selectedRoom} onValueChange={setSelectedRoom}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une salle" />
              </SelectTrigger>
              <SelectContent>
                {availableRooms.length > 0 ? (
                  availableRooms.map((room) => (
                    <SelectItem key={room} value={room}>
                      {room}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-rooms-available" disabled>
                    Aucune salle disponible
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button 
            onClick={() => {
              onRoomSelect(selectedRoom);
              onClose();
            }}
            disabled={!selectedRoom || selectedRoom === 'no-rooms-available'}
          >
            Confirmer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RoomSelector;
