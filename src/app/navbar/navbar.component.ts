import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { routes } from '../app.routes';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink,NgClass,RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  closeMenu(){
    this.isMenuOpen = false;
  }

  loading = false;

  constructor(private router: Router) {}

  navigateWithLoader(route: string) {
    this.loading = true;

    setTimeout(() => {
      this.loading = false;
      this.router.navigate([route]);
    }, 1000); // 3 seconds
  }
}