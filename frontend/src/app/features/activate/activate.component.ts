import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-activate',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule],
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.scss']
})
export class ActivateComponent implements OnInit {
  message: string = 'Activating account...';
  success: boolean = false;

  constructor(private route: ActivatedRoute, private authService: AuthService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.authService.activate(token).subscribe({
          next: (res) => {
            this.message = 'Account activated successfully! You can now log in.';
            this.success = true;
          },
          error: (err) => {
            this.message = 'Activation failed or token is invalid.';
            this.success = false;
          }
        });
      } else {
        this.message = 'No activation token provided.';
      }
    });
  }
}
