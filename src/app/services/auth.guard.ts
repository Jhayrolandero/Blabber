import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';


export const authGuard: CanActivateFn = (route, state) => {
  //Decode current token held
  const auth = inject(AuthService);
  const router = inject(Router)

  // Check the existance of token
  if (auth.getToken().length <= 0) {
    router.navigate(['home'])
    return false;
  }

  return true;

};
