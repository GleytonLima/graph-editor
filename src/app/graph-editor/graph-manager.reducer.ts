import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { Edge, Node } from '../model/model';
import * as GraphManagerActions from './graph-manager.actions';

export interface NodeState extends EntityState<Node> {}

export const adapterNode = createEntityAdapter<Node>();
const initialStateNode: NodeState = adapterNode.getInitialState();

export const graphManagerFeatureKey = 'graphManager';

export interface State {
  nodeSelected: Node | undefined;
  nodes: NodeState;
  edges: Edge[];
}

export const initialState: State = {
  nodeSelected: undefined,
  nodes: initialStateNode,
  edges: [],
};

const graphManagerReducer = createReducer(
  initialState,

  on(GraphManagerActions.selectNode, (state: any, action: any) => {
    return { ...state, nodeSelected: state.nodes.entities[action.nodeId] };
  }),

  on(GraphManagerActions.createEdgeSuccess, (state, action) => {
    const updatedNodes: any[] = [];

    selectAllNodes(state.nodes).forEach((n) => {
      if (n.id === action.edge.nodeFrom || n.id === action.edge.nodeTo) {
        updatedNodes.push({
          id: n.id,
          changes: { edges: [...n.edges, action.edge] },
        });
      }
    });
    const newNodeState = adapterNode.updateMany(updatedNodes, {
      ...state.nodes,
    });
    return {
      ...state,
      edges: [...state.edges, action.edge],
      nodes: newNodeState,
    };
  }),

  on(GraphManagerActions.loadNodes, (state) => state),
  on(GraphManagerActions.loadNodesSuccess, (state, action) => {
    return { ...state, nodes: adapterNode.addMany(action.data, state.nodes) };
  }),
  on(GraphManagerActions.loadNodesFailure, (state, action) => state),

  on(GraphManagerActions.loadEdges, (state) => state),
  on(GraphManagerActions.loadEdgesSuccess, (state, action) => {
    return { ...state, edges: action.data };
  }),
  on(GraphManagerActions.loadEdgesFailure, (state, action) => state)
);

export function reducer(state: State | undefined, action: Action) {
  return graphManagerReducer(state, action);
}

export const selectNodeState = (state: State) => state.nodes;
export const { selectAll: selectAllNodes } = adapterNode.getSelectors();
