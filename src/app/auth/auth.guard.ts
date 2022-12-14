import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StorageService } from "../_services/storage.service"
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private storageService: StorageService
  ) { }
  canActivate() {
    if (this.storageService.isLoggedIn())
      return true;
    this.router.navigate(["/login"]);
    return false;
  }
}