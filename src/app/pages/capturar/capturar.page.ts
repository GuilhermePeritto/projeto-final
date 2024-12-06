import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonTextarea, IonItem, IonButton, ModalController } from '@ionic/angular/standalone';
import { Camera, CameraDirection, CameraResultType, CameraSource, Photo } from '@capacitor/camera'
import { Filesystem } from '@capacitor/filesystem';
import { Directory, WriteFileResult } from '@capacitor/filesystem/dist/esm/definitions';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-capturar',
  templateUrl: './capturar.page.html',
  styleUrls: ['./capturar.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    IonItem, IonTextarea, IonButton]
})
export class CapturarPage implements OnInit {

  public foto: Photo | null = null;
  public texto: string = ''

  private modalController = inject(ModalController)

  constructor() { }

  ngOnInit() {
    this.capturar()
  }

  public async capturar() {
    if (await this.isPermitido()) {
      this.foto = await Camera.getPhoto({
        source: CameraSource.Camera,
        quality: 90,
        resultType: CameraResultType.Base64,
        allowEditing: false,
        direction: CameraDirection.Rear
      })
    } else {
      await Camera.requestPermissions({ permissions: ["camera"] })
      this.capturar()
    }
  }

  public async salvar() {
    if (this.foto && this.foto.base64String) {
      const nomeArquivo = new Date().toISOString() + '.jpeg'

      try {
        const arquivoSalvo = await Filesystem.writeFile({
          data: this.foto.base64String,
          path: nomeArquivo,
          directory: Directory.Data
        })

        if (arquivoSalvo) {
          await this.salvarRegistro(arquivoSalvo, nomeArquivo, this.texto)
          this.modalController.dismiss()
        }
      } catch (error) {
        alert('Erro ao salvar imagem')
      }
    }
  }

  private async salvarRegistro(arquivoSalvo: WriteFileResult, nomeArquivo: string, texto: string) {
    const dados = await Preferences.get({key: "galeria"})

    const registros = JSON.parse(dados.value ?? '[]') as any[]

    registros.push({
      texto,
      nomeArquivo,
      pasta: Directory.Data
    })

    await Preferences.set({key: "galeria", value: JSON.stringify(registros)})
  }

  private async isPermitido() {
    const permissao = await Camera.checkPermissions();
    return permissao.camera === 'granted'
      || permissao.photos === 'granted'
  }

}
