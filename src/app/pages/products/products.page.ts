import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { IonButton, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
  standalone: true,
  imports: [IonCardHeader, IonHeader, IonToolbar, IonTitle, IonCardTitle, IonCardSubtitle, IonButton, IonCard, IonContent, CommonModule],
})
export class ProductsPage implements OnInit {
  products: any[] = [];
  apiUrl = 'https://dummyjson.com/products';

  constructor(private http: HttpClient, private toastController: ToastController) {}

  ngOnInit() {
    this.getProducts();
  }

  getProducts() {
    this.http.get(`${this.apiUrl}`).subscribe(
      (response: any) => {
        this.products = response.products;
      },
      async (error) => {
        const toast = await this.toastController.create({
          message: 'Erro ao buscar produtos.',
          duration: 2000,
          color: 'danger',
        });
        toast.present();
      }
    );
  }

  addProduct() {
    const newProduct = {
      title: 'Novo Produto',
      price: 99.99,
    };

    this.http.post(`${this.apiUrl}/add`, newProduct).subscribe(
      async (response: any) => {
        const toast = await this.toastController.create({
          message: 'Produto cadastrado com sucesso!',
          duration: 2000,
          color: 'success',
        });
        toast.present();
        this.getProducts(); 
      },
      async (error) => {
        const toast = await this.toastController.create({
          message: 'Erro ao cadastrar o produto.',
          duration: 2000,
          color: 'danger',
        });
        toast.present();
      }
    );
  }
}
