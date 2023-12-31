import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ListingCategoryComponent } from '../../components/listing-category/listing-category.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ListingCategoryComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
