import * as fromGraphManager from './graph-manager.reducer';
import { selectGraphManagerState } from './graph-manager.selectors';

describe('GraphManager Selectors', () => {
  it('should select the feature state', () => {
    const result = selectGraphManagerState({
      [fromGraphManager.graphManagerFeatureKey]: {},
    });

    expect(result).toEqual({} as any);
  });
});
