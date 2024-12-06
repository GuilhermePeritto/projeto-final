import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Filesystem } from '@capacitor/filesystem';
import { Directory } from '@capacitor/filesystem/dist/esm/definitions';
import { Preferences } from '@capacitor/preferences';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonFab, IonFabButton,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem, IonLabel,
  IonList,
  IonTitle,
  IonToolbar,
  ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cameraOutline } from 'ionicons/icons';
import { CapturarPage } from '../pages/capturar/capturar.page';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonLabel, RouterModule, IonHeader, IonToolbar, IonTitle, IonContent, IonItem,
    IonCard, IonCardHeader, IonCardContent, IonCardTitle,
    IonButton, IonFab, IonFabButton, IonIcon, IonList, IonLabel, IonInput, CommonModule, FormsModule],
})
export class HomePage implements OnInit {

  private modalController = inject(ModalController)

  public novoComentario: string = '';

  imagens = [
    {
      foto: '',
      texto: 'Imagem de exemplo',
      comentarios: [],
    },
  ];

  constructor() {
    addIcons({ cameraOutline });
  }

  ngOnInit(): void {
    this.carregarImagens()
  }

  public async onRealizarCaptura() {
    const modal = await this.modalController.create({
      component: CapturarPage,
      breakpoints: [0.5, 0.75, 1],
      initialBreakpoint: 0.5
    })

    modal.onWillDismiss().then(() => this.carregarImagens())

    modal.present()
  }

  private async carregarImagens() {
    const dados = await Preferences.get({ key: 'galeria' });
    const registros = JSON.parse(dados.value ?? '[]') as any[];
    const imagens: any[] = [];
  
    for (const registro of registros) {
      const foto = await Filesystem.readFile({
        path: registro.nomeArquivo,
        directory: Directory.Data
      });
      imagens.push({
        ...registro,
        foto: foto.data,
        comentarios: registro.comentarios || [] 
      });
    }
  
    this.imagens = imagens;
  }

  public async excluir(imagem: any) {
    try {
      if (imagem.foto) {
        await Filesystem.deleteFile({
          directory: Directory.Data,
          path: imagem.nomeArquivo
        })

        const dados = await Preferences.get({ key: 'galeria' })
        let registros = JSON.parse(dados.value ?? '[]') as any[]

        registros = registros.filter(registro => registro.nomeArquivo !== imagem.nomeArquivo)

        await Preferences.set({
          key: 'galeria',
          value: JSON.stringify(registros)
        })

        this.carregarImagens()

      }
    } catch (error) {
      alert("Erro ao excluir imagem");
    }
  }

  adicionarComentario(imagem: any, comentario: string): void {
    if (comentario) {
  
      imagem.comentarios = [...(imagem.comentarios || []), comentario];


      Preferences.get({ key: 'galeria' }).then((dados) => {
        let registros = JSON.parse(dados.value ?? '[]') as any[];

        const registroIndex = registros.findIndex(registro => registro.nomeArquivo === imagem.nomeArquivo);
        if (registroIndex !== -1) {
          registros[registroIndex].comentarios = imagem.comentarios;
        }


        Preferences.set({
          key: 'galeria',
          value: JSON.stringify(registros)
        });
      });

      this.novoComentario = '';
    }
  }
}
