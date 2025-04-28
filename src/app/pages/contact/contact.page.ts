import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
  standalone: false,
})
export class ContactPage implements OnInit {

  constructor(
    private router: Router,
    private toastController: ToastController
  ) { }

  ngOnInit() {
  }

  navigateToPage(page: string) {
    this.router.navigateByUrl(`/${page}`);
  }

  openWhatsApp() {
    window.open('https://wa.me/917879902029', '_system');
  }

  openEmail() {
    window.open('mailto:sagarfancyjewellers@gmail.com', '_system');
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}
