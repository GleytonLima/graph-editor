import * as fromGraphManager from "./graph-manager.actions";

describe("loadGraphManagers", () => {
    it("should return an action", () => {
        const queryBuilder = {};
        expect(fromGraphManager.loadNodes({ queryBuilder }).type).toBe("[GraphManager] Load GraphManagers");
    });
});
