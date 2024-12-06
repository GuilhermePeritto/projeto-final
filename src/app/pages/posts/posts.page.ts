import { afterNextRender, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonList, IonItem,  IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Post, Posts, PostService } from 'src/app/services/post.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.page.html',
  styleUrls: ['./posts.page.scss'],
  standalone: true,
  imports: [IonList, IonItem,IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class PostsPage implements OnInit {

  private servico = inject(PostService);

  public posts: Posts = {posts: []}

  ngOnInit() {
    this.carregar()
  }

  private async carregar() {
    this.servico.listar().subscribe({
      next: (response) => {
          this.posts = response;
      },
      error: () => alert('Erro ao buscar registro')
    })
  }

  private criar() {
    const novoPost: Post = {
      id: 1,
      title: 'novo post'
    }

    this.servico.criar(novoPost)
    .subscribe({
      next: () => alert('Criado com sucesso'),
      error: () => alert('Erro ao salvar.')
    })
  }

}
