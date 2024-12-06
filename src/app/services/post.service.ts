import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Post {
  id: number,
  title: string
}

export interface Posts {
  posts: Post[]
}

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private http = inject(HttpClient);
  
  public listar(): Observable<Posts> {
    return this.http.get<Posts>('https://dummyjson.com/posts')
  }

  public criar(post: Post) {
    return this.http.post('https://dummyjson.com/posts', post);
  }

}
