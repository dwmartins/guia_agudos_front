import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../../../components/footer/footer.component';
import { ListingCategoryService } from '../../../services/listing-category.service';
import { ListingCategory } from '../../../models/listingCategory';

@Component({
    selector: 'app-listing-new',
    standalone: true,
    imports: [CommonModule, FooterComponent, FormsModule],
    templateUrl: './listing-new.component.html',
    styleUrl: './listing-new.component.css'
})
export class ListingNewComponent implements OnInit{
    categoryService = inject(ListingCategoryService);

    categories: ListingCategory[] = [];
    searchItensCategory: ListingCategory[] = [];
    searchItem: string = '';

    ngOnInit(): void {
        this.goToTheTopWindow();
        this.getCategories();
    }

    getCategories() {
        this.categoryService.categories(null).subscribe((response) => {
           this.categories = response;
           this.searchItensCategory = response;
        }, (error) => {
           console.error('ERROR: ', error);
        })
    }

    filterCategories(): void {
        this.searchItensCategory = this.categories.filter(object =>
           object.cat_name.toLowerCase().includes(this.searchItem.toLowerCase())
        );
    }

    goToTheTopWindow() {
        window.scrollTo(0, 0);
    }
}
