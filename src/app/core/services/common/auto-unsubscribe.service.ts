import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable() // NO providedIn root, use Provider in component instead
export class AutoUnsubscribeService implements OnDestroy {
  destroyed = new Subject<void>();

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  /**
   * Using:
   * 1. Add "AutoUnsubscribeService" in providers of comp
   * 2. Declaire in constructor
   * 3. When create Observable, pipe: takeUntil  AutoUnsubscribeService.destroyed
   */
}
