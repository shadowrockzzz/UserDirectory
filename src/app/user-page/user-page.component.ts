import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WebCallsService } from '../web-calls.service';
import { Post, PostsCount, User } from '../main-page/main-page.component';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
})
export class UserPageComponent {
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public cdr: ChangeDetectorRef,
    public apiCall: WebCallsService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.userId = params['id'];
    });

    this.apiCall.getCountries().subscribe((data) => {
      this.countryList = data;
    });
    this.apiCall.getUsers().subscribe((data) => {
      this.users = data;
    });
    this.apiCall.getPosts().subscribe((data) => {
      this.posts = data;
      this.countPosts();
      this.getUserPosts();
    });
    this.getLocalTime(this.countryTimeZone);
  }

  goToMainPage() {
    this.router.navigate(['']);
  }

  users: User[] = [];
  posts: Post[] = [];
  postsCount: PostsCount[] = [];
  countryTimeZone: string = 'Africa' + '/' + 'Abidjan';
  countryList: string[] = [];
  isTimerRunning: boolean = true;
  seconds: number = 0;
  interval: any = -1;
  userId: string = '';
  time: string = '';
  localTime = {
    hrs: 0,
    mins: 0,
    secs: 0,
    milliSecs: 0,
  };

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

  getUserPostsCount(userId: number): number {
    for (let i = 0; i < this.postsCount.length; i++) {
      if (this.postsCount[i].userId === userId) return this.postsCount[i].count;
    }
    return -1;
  }

  setInterval() {
    this.seconds = this.localTime.secs;
    this.interval = setInterval(() => {
      this.seconds += 1;
      this.localTime.secs += 1;
      if (this.seconds % 60 == 0) {
        this.localTime.secs = 0;
        this.localTime.mins += 1;
        if (this.localTime.mins == 60) {
          this.localTime.mins = 0;
          this.localTime.hrs += 1;
          if (this.localTime.hrs == 24) {
            this.localTime.hrs = 0;
          }
        }
      }
    }, 1000);
  }

  getLocalTime(timeZone: string) {
    this.apiCall.getLocalTime(timeZone).subscribe((data) => {
      clearInterval(this.interval);
      this.time = data.datetime;
      this.localTime.hrs = parseInt(this.time.substring(11, 13));
      this.localTime.mins = parseInt(this.time.substring(14, 16));
      this.localTime.secs = parseInt(this.time.substring(17, 19));
      this.localTime.milliSecs = parseInt(this.time.substring(20, 23));
      this.setInterval();
      this.cdr.detectChanges();
    });
  }

  get2Digits(num: number): string {
    if (num >= 10) return num.toString();
    return '0' + num;
  }

  timerTrigger() {
    if (this.isTimerRunning === true) {
      clearInterval(this.interval);
      this.isTimerRunning = !this.isTimerRunning;
    } else {
      this.setInterval();
      this.isTimerRunning = !this.isTimerRunning;
    }
  }

  timeZoneChangeEvent(item: any) {
    this.countryTimeZone = item.target.value;
    this.getLocalTime(item.target.value);
    this.cdr.detectChanges();
  }

  getUserProfile(): User {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].id === parseInt(this.userId)) {
        return this.users[i];
      }
    }
    return this.users[0];
  }

  userPosts: Post[] = [];

  getUserPosts() {
    for (let i = 0; i < this.posts.length; i++) {
      if (this.posts[i].userId === parseInt(this.userId)) {
        this.userPosts.push(this.posts[i]);
      }
    }
  }
}
