
import React, { useState } from 'react';
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Resolve Room Conflict</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="text-sm text-red-500">
            Room conflict detected! The session "{session.module}" for {session.groupe} conflicts with 
            "{conflictSession.module}" in room {conflictSession.salle}.
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Select a different room:</p>
            <Select value={selectedRoom} onValueChange={setSelectedRoom}>
              <SelectTrigger>
                <SelectValue placeholder="Select a room" />
              </SelectTrigger>
              <SelectContent>
                {rooms
                  .filter(room => room !== conflictSession.salle)
                  .map((room) => (
                    <SelectItem key={room} value={room}>
                      {room}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={() => {
              onRoomSelect(selectedRoom);
              onClose();
            }}
            disabled={!selectedRoom}
          >
            Confirm Change
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RoomSelector;
