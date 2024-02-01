import { Component } from '@angular/core';
import { ListingCategoryComponent } from '../../components/listing-category/listing-category.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-listing-category-all',
  standalone: true,
  imports: [ListingCategoryComponent, FooterComponent],
  templateUrl: './listing-category-all.component.html',
  styleUrl: './listing-category-all.component.css'
})
export class ListingCategoryAllComponent {

}
