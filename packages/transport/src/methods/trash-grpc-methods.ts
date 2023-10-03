export const trashGrpcMethods = {
  getAllTrash: 'getAllTrash',
  getTrashByTags: 'getTrashByTags',
  getTrashInDistance: 'getTrashInDistance',
  createTrash: 'createTrash',
  updateTrash: 'updateTrash',
  deleteTrash: 'deleteTrash',
} as const;

export type trashGrpcMethodsEnum = keyof typeof trashGrpcMethods;
