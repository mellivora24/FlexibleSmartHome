export const ROOMS = {
    LIVING_ROOM: 0,
    BEDROOM: 1,
    KITCHEN: 2,
} as const;

export const ROOM_LIST = [
    { id: ROOMS.LIVING_ROOM, name: 'Phòng khách'},
    { id: ROOMS.BEDROOM, name: 'Phòng ngủ'},
    { id: ROOMS.KITCHEN, name: 'Phòng bếp'},
];