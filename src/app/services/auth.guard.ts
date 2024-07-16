import { CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';


export const authGuard: CanActivateFn = (route, state) => {
  //Decode current token held
  const auth = inject(AuthService);

  // Check the existance of token
  if (auth.getToken().length <= 0) {
    return false;
  }

  return true;

};
