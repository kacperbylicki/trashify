export const trashGrpcMethod = {
  getAllTrash: 'getAllTrash',
  getTrashByTags: 'getTrashByTags',
  getTrashInDistance: 'getTrashInDistance',
  createTrash: 'createTrash',
  updateTrash: 'updateTrash',
  deleteTrash: 'deleteTrash',
} as const;

export type trashGrpcMethodEnum = keyof typeof trashGrpcMethod;
