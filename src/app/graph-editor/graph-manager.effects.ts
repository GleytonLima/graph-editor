import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';

import { EdgeService } from '../service/edge.service';
import { NodeService } from '../service/node.service';
import * as GraphManagerActions from './graph-manager.actions';

@Injectable()
export class GraphManagerEffects {
  constructor(
    private actions$: Actions,
    private nodeService: NodeService,
    private edgeService: EdgeService
  ) {}

  loadNodes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GraphManagerActions.loadNodes),
      concatMap((action) => {
        return this.nodeService.getAll(action.queryBuilder).pipe(
          map((data) => {
            return GraphManagerActions.loadNodesSuccess({ data: data.content });
          }),
          catchError((error) =>
            of(GraphManagerActions.loadNodesFailure({ error }))
          )
        );
      })
    );
  });

  loadEdges$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GraphManagerActions.loadEdges),
      concatMap((action) => {
        return this.edgeService.list(action.queryBuilder).pipe(
          map((data) => {
            return GraphManagerActions.loadEdgesSuccess({ data: data.content });
          }),
          catchError((error) =>
            of(GraphManagerActions.loadEdgesFailure({ error }))
          )
        );
      })
    );
  });

  createEdge$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GraphManagerActions.createEdge),
      concatMap((action) => {
        return this.edgeService.create(action.edge).pipe(
          map((newEdge) => {
            return GraphManagerActions.createEdgeSuccess({ edge: newEdge });
          }),
          catchError((error) =>
            of(GraphManagerActions.createEdgeFailure({ error }))
          )
        );
      })
    );
  });
}
