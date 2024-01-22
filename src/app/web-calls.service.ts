import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebCallsService {

  private timeZonebaseURI = "http://worldtimeapi.org/api/timezone"
  private usersBaseURI = "https://jsonplaceholder.typicode.com"

  constructor(private http:HttpClient) { 

  }

  getCountries():Observable<any>{
    return this.http.get<any>(this.timeZonebaseURI)
  }

  getUsers():Observable<any>{
    return this.http.get<any>(this.usersBaseURI+"/users")
  }

  getPosts():Observable<any>{
    return this.http.get<any>(this.usersBaseURI+"/posts")
  }

  getLocalTime(timeZone:string):Observable<any>{
    return this.http.get<any>(this.timeZonebaseURI+"/"+timeZone)
    
  }
}
