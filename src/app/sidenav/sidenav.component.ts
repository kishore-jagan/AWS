import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';
import { HomePageComponent } from '../home-page/home-page.component';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css',
})
export class SidenavComponent {
  constructor(private layout: LayoutComponent, private router: Router) {}

  isPageSelected(name: string): boolean {
    return this.layout.page === name;
  }

  onPageChange(name: String) {
    this.layout.page = name;
    // this.router.navigate(['/base', name]);
  }
}
