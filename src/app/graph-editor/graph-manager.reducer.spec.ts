import { reducer, initialState } from "./graph-manager.reducer";

describe("GraphManager Reducer", () => {
    describe("an unknown action", () => {
        it("should return the previous state", () => {
            const action = {} as any;

            const result = reducer(initialState, action);

            expect(result).toBe(initialState);
        });
    });
});
