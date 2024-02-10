import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ListingCategoryService } from '../../../services/listing-category.service';
import { ListingCategory } from '../../../models/listingCategory';
import { FooterComponent } from '../../components/footer/footer.component';
import { AlertService } from '../../../services/components/alert.service';
import { ActivatedRoute } from '@angular/router';
import { ListingPlans } from '../../../models/ListingPlans';
import { PlansService } from '../../../services/plans.service';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-listing-new',
    standalone: true,
    imports: [CommonModule, FooterComponent, FormsModule, NgbTooltipModule],
    templateUrl: './listing-new.component.html',
    styleUrl: './listing-new.component.css'
})
export class ListingNewComponent implements OnInit{
    categoryService = inject(ListingCategoryService);
    alertService    = inject(AlertService);
    route           = inject(ActivatedRoute);
    plansService    = inject(PlansService);

    categories: ListingCategory[] = [];
    searchItensCategory: ListingCategory[] = [];
    searchItem: string = '';
    categoriesSelect: ListingCategory[] = [];
    planId!: number;
    listingPlans: ListingPlans[] = [];

    keywords: string[] = [];
    searchKeywords!: string;

    tooltips = {
        keywords: 'Palavras-chaves para as pessoas encontrarem seu negocio mais fácil',
        phone: 'Será utilizado para WhatsApp'
    }


    ngOnInit(): void {
        this.goToTheTopWindow();
        this.getParameterData();
        this.getListingPlans();
        this.getCategories();
    }

    getListingPlans() {
        this.plansService.getPlansById(this.planId,"Y").subscribe(response => {
            this.listingPlans = response;
        }, error => {
            console.error('ERROR: ', error);
            this.alertService.showAlert('error', 'Falha ao buscar os planos.');
        })
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
        const categoryInfo = this.listingPlans[0].plansInfo;

        const maxCategory = categoryInfo.find(item => {
            return item.description === "Categorias";
        });

        if(this.categoriesSelect.length === maxCategory?.value) {
            this.alertService.showAlert('info', 'Você atingiu o limite máximo de categorias do seu plano.');
            return;
        }

        const exists = this.categoriesSelect.some(existsCategory => existsCategory.id === category.id);
        if(exists) {
            this.alertService.showAlert('info', 'Você já selecionou essa categoria.');
            return;
        }
        
        this.categoriesSelect.push(category);
    }

    removeCategory(id: number) {
        this.categoriesSelect = this.categoriesSelect.filter(category => category.id !== id);
    }

    setKeywords(keywords: string){
        const keywordsInfo = this.listingPlans[0].plansInfo;
        
        const maxKeywords = keywordsInfo.find(item => {
            return item.description === "Palavras-chave";
        });

        if(this.keywords.length === maxKeywords?.value) {
            this.alertService.showAlert('info', 'Você atingiu o limite máximo de palavras-chave do seu plano.');
            return;
        }

        const exists = this.keywords.some(existisKeywords => existisKeywords === keywords);

        if(exists) {
            this.alertService.showAlert('info', 'Você já adicionou uma palavra-chave igual.');
            return;
        }

        this.keywords.push(keywords);
        this.searchKeywords = '';
    }

    removeKeyword(keywords: string) {
        this.keywords = this.keywords.filter(item => item !== keywords);
    }

    getParameterData() {
        this.route.params.subscribe(params => {
            this.planId = params['planId'];
        })
    }

    goToTheTopWindow() {
        window.scrollTo(0, 0);
    }
}
