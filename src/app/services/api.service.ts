import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  constructor( private http: HttpClient) {}

  public postWithAbsoluteUrl(url: any, body: any, headers?: any) {
    return this.http.post(url, body, { headers: headers });
  }

  public getWithAbsoluteUrl(url: any, params?: any, headers?: any) {
    return this.http.get(url, {
      headers: headers,
      params: params ? params : "",
    });
  }
  public deleteWithAbsoluteUrl(url: any, body: any, headers?: any) {
    const options = {
      headers: headers,
      body: body,
    };
    return this.http.delete(url, options);
  }
}
