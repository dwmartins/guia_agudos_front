import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  	selector: 'app-listing-info',
  	standalone: true,
  	imports: [RouterModule, CommonModule],
  	templateUrl: './listing-info.component.html',
  	styleUrl: './listing-info.component.css'
})
export class ListingInfoComponent implements OnInit{	
	route = inject(ActivatedRoute);
	router = inject(Router);

	listingId: number = 0;

	ngOnInit(): void {
		this.getParams(); 
	}

	getParams() {
		this.route.params.subscribe(params => {
			console.log(params['id']);
			this.listingId = params['id'];
		})
	}
}
