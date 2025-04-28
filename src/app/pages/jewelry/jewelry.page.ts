import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-jewelry',
  templateUrl: './jewelry.page.html',
  styleUrls: ['./jewelry.page.scss'],
  standalone: false,
})
export class JewelryPage implements OnInit {
  selectedCategory: string = 'All';
  
  constructor(private router: Router) { }

  ngOnInit() {
  }
  
  selectCategory(category: string) {
    this.selectedCategory = category;
  }

  navigateToPage(page: string) {
    this.router.navigateByUrl(`/${page}`);
  }
}
