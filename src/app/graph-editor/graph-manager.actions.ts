import { createAction, props } from '@ngrx/store';
import { Edge } from '../model/model';

export const selectNode = createAction(
  '[GraphManager] Select Node',
  props<{ nodeId: number }>()
);

export const loadNodes = createAction(
  '[GraphManager] Load Nodes',
  props<{ queryBuilder: any }>()
);

export const loadNodesSuccess = createAction(
  '[GraphManager] Load Nodes Success',
  props<{ data: any }>()
);

export const loadNodesFailure = createAction(
  '[GraphManager] Load Nodes Failure',
  props<{ error: any }>()
);

export const loadEdges = createAction(
  '[GraphManager] Load Edges',
  props<{ queryBuilder: any }>()
);

export const loadEdgesSuccess = createAction(
  '[GraphManager] Load Edges Success',
  props<{ data: any }>()
);

export const loadEdgesFailure = createAction(
  '[GraphManager] Load Edges Failure',
  props<{ error: any }>()
);

export const createEdge = createAction(
  '[GraphManager] Create Edge',
  props<{ edge: Edge }>()
);

export const createEdgeSuccess = createAction(
  '[GraphManager] Create Edge Success',
  props<{ edge: Edge }>()
);

export const createEdgeFailure = createAction(
  '[GraphManager] Create Edge Failure',
  props<{ error: any }>()
);
