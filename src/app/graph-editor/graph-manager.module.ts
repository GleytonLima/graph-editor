import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { DrawGraphComponent } from './draw-graph/draw-graph.component';
import { GraphManagerRoutingModule } from './graph-manager-routing.module';
import { GraphManagerEffects } from './graph-manager.effects';
import * as fromGraphManager from './graph-manager.reducer';

@NgModule({
  declarations: [DrawGraphComponent],
  imports: [
    CommonModule,
    GraphManagerRoutingModule,
    MatSidenavModule,
    MatExpansionModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,
    MatCardModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatInputModule,
    MatSlideToggleModule,
    StoreModule.forFeature(
      fromGraphManager.graphManagerFeatureKey,
      fromGraphManager.reducer
    ),
    EffectsModule.forFeature([GraphManagerEffects]),
  ],
})
export class GraphManagerModule {}
