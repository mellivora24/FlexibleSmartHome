export interface Event {
  id: number;
  deviceName: string;
  action: string;
  payload: Record<string, any>;
  createdAt: string;
}

export interface EventList {
  total: number;
  list: Event[];
}
