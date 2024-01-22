import { ChangeDetectorRef, Component } from '@angular/core';
import { WebCallsService } from '../web-calls.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
  users: User[] = [];
  posts: Post[] = [];
  postsCount: PostsCount[] = [];
  isTimerRunning: boolean = true;
  seconds: number = 0;
  interval: any = -1;
  localTime = {
    hrs: 0,
    mins: 0,
    secs: 0,
    milliSecs: 0,
  };
  constructor(
    public apiCall: WebCallsService,
    public cdr: ChangeDetectorRef,
    public router: Router
  ) {}

  ngOnInit() {
    this.apiCall.getUsers().subscribe((data) => {
      this.users = data;
    });
    this.apiCall.getPosts().subscribe((data) => {
      this.posts = data;
      this.countPosts();
    });
  }

  countPosts() {
    for (let i = 0; i < this.posts.length; i++) {
      let isPresent: boolean = false;
      for (let j = 0; j < this.postsCount.length; j++) {
        if (this.postsCount[j].userId === this.posts[i].userId) {
          this.postsCount[j].count += 1;
          isPresent = true;
        }
      }
      if (isPresent === false) {
        this.postsCount.push({ userId: this.posts[i].userId, count: 1 });
      }
    }
  }

  userClkBtn(userId: number) {
    this.router.navigate(['/user'], { queryParams: { id: userId } });
  }

  getUserPostsCount(userId: number): number {
    for (let i = 0; i < this.postsCount.length; i++) {
      if (this.postsCount[i].userId === userId) return this.postsCount[i].count;
    }
    return -1;
  }
}

export class PostsCount {
  'userId': number;
  'count': number;
}

export class Post {
  'userId': number;
  'id': number;
  'title': string;
  'body': string;
}

export class User {
  'id': number;
  'name': string;
  'username': string;
  'email': string;
  'address': {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  'phone': string;
  'website': string;
  'company': {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}
