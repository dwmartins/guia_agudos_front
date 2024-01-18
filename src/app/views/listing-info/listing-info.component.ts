import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Lightbox, LightboxModule } from 'ngx-lightbox';

@Component({
  	selector: 'app-listing-info',
  	standalone: true,
  	imports: [RouterModule, CommonModule, LightboxModule],
  	templateUrl: './listing-info.component.html',
  	styleUrl: './listing-info.component.css'
})
export class ListingInfoComponent implements OnInit{	
	route = inject(ActivatedRoute);
	router = inject(Router);
	lightbox = inject(Lightbox);
	modal = inject(NgbModal);

	@ViewChild('modalAssessment', {static: true}) modalAssessment!: ElementRef

	listingId: number = 0;
	iconCategories: boolean = false;

	galleryImages = [
		'https://images.unsplash.com/photo-1682687220247-9f786e34d472?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxfHx8ZW58MHx8fHx8',
		'https://images.unsplash.com/photo-1682687982134-2ac563b2228b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		'https://images.unsplash.com/photo-1682686580036-b5e25932ce9a?q=80&w=1375&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		'https://images.unsplash.com/photo-1682687220199-d0124f48f95b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHw2fHx8ZW58MHx8fHx8',
		'https://images.unsplash.com/photo-1682685797828-d3b2561deef4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxMXx8fGVufDB8fHx8fA%3D%3D'
	]

	ngOnInit(): void {
		this.getParams(); 
	}

	getParams() {
		this.route.params.subscribe(params => {
			console.log(params['id']);
			this.listingId = params['id'];
		})
	}

	toggleIconOpeningHours() {
      this.iconCategories = !this.iconCategories;
   	}

	openLightbox(index: number): void {
		const album = this.galleryImages.map(link => {
		  return { src: link, caption: '', thumb: '' };
		});
  
		this.lightbox.open(album, index);
	}
	
	OpenModalUserAssessment() {
		this.modal.open(this.modalAssessment, {centered: true});
	}
}
