import { createFeatureSelector, createSelector } from "@ngrx/store";
import * as fromGraphManager from "./graph-manager.reducer";

export const selectGraphManagerState = createFeatureSelector<fromGraphManager.State>(
    fromGraphManager.graphManagerFeatureKey
);
export const selectNodeSelected = createSelector(selectGraphManagerState, (state) => state.nodeSelected);
export const selectEdges = createSelector(selectGraphManagerState, (state) => state.edges);

export const selectNodeState = createSelector(selectGraphManagerState, fromGraphManager.selectNodeState);
export const selectAllNodes = createSelector(selectNodeState, fromGraphManager.selectAllNodes);
