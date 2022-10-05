import { TestBed } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import { Observable } from "rxjs";

import { GraphManagerEffects } from "./graph-manager.effects";

describe("GraphManagerEffects", () => {
    let actions$: Observable<any>;
    let effects: GraphManagerEffects;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [GraphManagerEffects, provideMockActions(() => actions$)],
        });

        effects = TestBed.get<GraphManagerEffects>(GraphManagerEffects);
    });

    it("should be created", () => {
        expect(effects).toBeTruthy();
    });
});
