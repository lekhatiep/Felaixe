import { CanDeactivateFn } from '@angular/router';
import { Observable } from 'rxjs';

export interface HasUnsavedChanges {
  canLeave: () => Observable<boolean>;
}

export const confirmLeaveGuard: CanDeactivateFn<HasUnsavedChanges> = (
  component,
) => {

  //console.log(component);
   return component.canLeave();
};
