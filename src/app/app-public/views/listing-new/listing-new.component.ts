import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ListingCategoryService } from '../../../services/listing-category.service';
import { ListingCategory } from '../../../models/listingCategory';
import { FooterComponent } from '../../components/footer/footer.component';
import { AlertService } from '../../../services/componsents/alert.service';

@Component({
    selector: 'app-listing-new',
    standalone: true,
    imports: [CommonModule, FooterComponent, FormsModule],
    templateUrl: './listing-new.component.html',
    styleUrl: './listing-new.component.css'
})
export class ListingNewComponent implements OnInit{
    categoryService = inject(ListingCategoryService);
    alertService    = inject(AlertService);

    categories: ListingCategory[] = [];
    searchItensCategory: ListingCategory[] = [];
    searchItem: string = '';

    categoriesSelect: ListingCategory[] = [];

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

    setCategory(category: ListingCategory) {
        const max = 3;

        if(this.categoriesSelect.length === max) {
            this.alertService.showAlert('info', 'Você atingiu o limite máximo de categorias do seu plano.');
            return;
        }

        const exists = this.categoriesSelect.some(existsCategory => existsCategory.id === category.id);
        if(!exists) {
            this.categoriesSelect.push(category);
            return;
        }
        this.alertService.showAlert('info', 'Você já selecionou essa categoria.');
    }

    removeCategory(id: number) {
        this.categoriesSelect = this.categoriesSelect.filter(category => category.id !== id);
    }

    goToTheTopWindow() {
        window.scrollTo(0, 0);
    }
}
